# Design: add-multimodal-sources

## Context

README 自動生成管線由 `.github/workflows/ai-readme.yml` 觸發、`scripts/generate_summary.js` 執行：讀取變動活動目錄內的純文字檔（副檔名白名單）＋ PR 描述，組成單一字串 prompt 送 `gemini-2.5-flash-lite`，寫出該目錄的 `README.md` 並更新根 README 活動列表。

現況限制：

- 只吃 UTF-8 純文字（`validExtensions`），PDF/PPTX/圖片全被跳過（實例：`202602/` 的 `.pptx` 未進入紀錄）。
- 掃描器跳過所有子目錄（`generate_summary.js` 中 `stats.isDirectory()` 直接 continue）。
- prompt 的基本資訊格式假設單一投影片連結，多講者/多份投影片無法完整呈現。
- 執行環境：GitHub Actions ubuntu-latest（Ubuntu 24.04）、Node 20、唯一 npm 依賴 `@google/generative-ai`——本次遷移至 `@google/genai`，見 D9。

## Goals / Non-Goals

**Goals:**

- PDF 與 PPTX 投影片內容（含圖表、版面等視覺資訊）進入生成流程。
- 現場照片作為補充素材進入生成流程。
- 一場活動多位講者、多份投影片時，紀錄能完整列名並正確對應。
- 超出請求預算時有明確、可預期的降級行為（跳過＋log），不讓 CI 失敗。

**Non-Goals:**

- 影音檔（.mp4/.mov/.mp3 等）的處理——明確跳過，未來有需求另開 change。
- Gemini Files API 上傳流程——不做，超大檔案走降級路徑。
- 既有活動 README 的回溯重生成——管線本就不覆蓋既有 README，維持不變（維護者可自行刪除 README 觸發重生成）。
- 更換模型或 prompt 的整體改寫——只動輸入組裝與輸出格式要求。

## Decisions

### D1: PDF 以 Gemini 多模態原生輸入（inlineData），不做文字抽取

投影片的資訊密度主要在圖不在字（架構圖、程式碼截圖、圖表）。文字抽取（pdf-parse 等）會丟失視覺內容，且對掃描型 PDF 完全無效；Gemini 原生 PDF 輸入讓模型看到每頁完整圖文版面。inline base64 PDF 輸入為 Gemini API 原生能力，新舊 SDK 皆支援對應介面；本次改動採用遷移後的 `@google/genai`（見 D9）實作，官方 document-processing 文件的 JS 範例即以此 SDK 送 inline base64 PDF。

**替代方案**：pdf-parse/pdfjs-dist 抽文字——改動最小但紀錄品質差，否決。

### D2: PPTX 在 CI 以 LibreOffice headless 轉 PDF，再走 D1 路徑

Gemini 不原生支援 PPTX。LibreOffice `soffice --headless --convert-to pdf` 是最成熟的無頭轉檔方案。ubuntu-latest（Ubuntu 24.04）官方預裝清單未含 LibreOffice（來源：[actions/runner-images](https://github.com/actions/runner-images) 的 `Ubuntu2404-Readme.md`），workflow SHALL 在偵測到 `.pptx` 時明確執行 `apt-get install libreoffice-impress`，不可假設已預裝。轉檔僅在變動目錄含 `.pptx` 時執行，避免每次 CI 都付安裝成本。轉出的 PDF 為暫存檔，不 commit 回 repo。安裝與轉檔耗時官方無公開數據，實測任務見 `tasks.md`。

**替代方案**：jszip 解 PPTX 抽 `<a:t>` 文字——輕量但同 D1 丟失視覺內容，否決。

**轉檔失敗處理**：不 fail CI，跳過該檔並 log 提示（與管線「盡力而為」的既有性格一致），提示補救方式為把重點寫進 PR 描述。

### D3: 副檔名白名單改為型態分流器（modality router）

每個檔案依型態決定「怎麼進 prompt」而非「進不進」：

| 型態 | 處理 |
|---|---|
| `.md .txt .py .js .ts .html .css .json` | 文字 part（現行邏輯，含 5000/30000 字截斷） |
| `.pdf` | `inlineData: application/pdf` |
| `.pptx` | LibreOffice → PDF → 同上 |
| `.jpg .jpeg .png .webp .heic` | 縮圖後 `inlineData: image/*` |
| `.mp4 .mov .mp3` 等影音 | 跳過＋log |
| 其他二進位 | 跳過＋log |

遇到新型態時決策點明確（歸哪類、要不要轉檔），不再回頭改白名單。

### D4: 請求預算制（inline only），不上 Files API

**上限依據**：官方 image-understanding 文件載明 inline 方式的上限為「整個請求（文字＋system instruction＋inline bytes）合計 20MB」；Files API 文件另載 100MB，兩份官方文件數字不一致，保守以 **20MB** 為準（來源：[image-understanding](https://ai.google.dev/gemini-api/docs/image-understanding)、[files](https://ai.google.dev/gemini-api/docs/files)）。inline 檔案會先 base64 編碼再送入請求，體積約膨脹 **1.34 倍**；官方文件未明寫 20MB 上限是否以編碼後體積計算，保守假設計入。

**預算計算式**（以「原始檔案大小加總」X 回推，MB 為單位）：

```
X × 1.34 ＋ 文字與 system instruction 預留（0.5MB） ≤ 20MB
⟹ X ≤ (20 − 0.5) ÷ 1.34 ≈ 14.55MB
⟹ 取整數並留安全 buffer，訂為 14MB
```

單一 PDF 上限採同一保守比例，訂為 **9MB**（9MB × 1.34 ≈ 12.06MB，加文字預留仍在 20MB 內，且低於 14MB 總量門檻，可在總量檢查前先攔截單一超大檔）。

預算規則：

- 請求 inline（原始檔案，未編碼前）總體積上限 **14MB**（對應 base64 編碼後＋文字約 19.3MB，在 20MB 官方上限內留約 0.7MB buffer）。
- 素材優先序：投影片（PDF）> 筆記文字 > 照片。
- 超出預算時依優先序反向捨棄（先丟照片、再丟後序投影片），以整檔為單位，每次捨棄都 log。
- 單一 PDF 超過單檔上限（**9MB**）直接跳過＋log 提示寫 PR 描述。
- Gemini Files API（100MB 上限）本次不採用：本 repo 每月一場活動，為罕見超大檔案維護一套上傳流程不划算，降級路徑（跳過＋提示）與現況行為一致；保留為未來擴充選項，若超大檔案需求增加可重新評估。

### D5: 照片縮圖至長邊 768px 再送入

原圖動輒 3~5MB，十餘張即耗盡預算；768px 對模型理解足夠，單張縮至數十 KB。縮圖在 CI 以 ImageMagick 執行；ubuntu-latest（Ubuntu 24.04）官方預裝清單未含 ImageMagick（22.04 曾預裝，24.04 已移除，來源同 D2），workflow SHALL 在偵測到圖片檔時明確執行 `apt-get install imagemagick`，不可假設已預裝。暫存檔不 commit。prompt 明確定位照片角色：補充活動氛圍與參與狀況，**不描述個別與會者外貌**（隱私）。

HEIC/HEIF 輸入已確認由 Gemini 原生支援（見「已確認的前提」），縮圖步驟不需為相容性額外轉 JPEG，但 ImageMagick 轉檔／縮圖仍統一處理所有圖片格式。

### D6: 投影片↔講者對應交由模型推斷，不強加目錄/檔名慣例

多模態輸入後，模型可直接閱讀投影片首頁（通常含標題與講者名），加上 PR 描述的分享者欄位雙重來源，足以完成對應。不定子目錄或檔名慣例，符合既有目錄的扁平習慣、對貢獻者零負擔。PR template 補充提示「多位講者時請註明誰分享哪份投影片」作為兜底。

**替代方案**：每場 talk 一個子目錄的強制慣例——結構清楚但對貢獻者有教育成本，且與既有目錄不一致，否決。

### D7: 掃描支援子目錄遞迴一層

素材變多後子資料夾整理（`photos/` 等）是自然需求，且現況「子目錄被無視」對貢獻者是隱形陷阱。遞迴一層（不無限深）足以覆蓋實際使用，檔名以相對路徑呈現給模型。

### D8: prompt 輸出格式改為多場次友善

基本資訊區：`- 分享者：`可多位；`- [投影片](...)`可多條，每條標註對應講者或主題（如 `- [投影片：OpenCore 入門（Brook）](slides-a.pdf)`）。主題內容依講者/場次分段。單講者活動輸出與現行格式相容。

### D9: SDK 由 `@google/generative-ai` 遷移至 `@google/genai`

`@google/generative-ai` 已於 2025-11-30 被 Google 官方標示為棄用：npm 上未加 deprecated 旗標、仍可安裝執行，但官方不再積極維護；官方建議遷移至 `@google/genai`（現為 2.x），且官方 document-processing 文件的 JS 範例已改以 `@google/genai` 送 inline base64 PDF（來源：[libraries](https://ai.google.dev/gemini-api/docs/libraries)、[migrate](https://ai.google.dev/gemini-api/docs/migrate)、[js-genai](https://github.com/googleapis/js-genai)）。

本次改動一併完成遷移：`package.json` 換依賴；`scripts/generate_summary.js` 的 client 初始化與生成呼叫改寫為新 SDK 介面，具體改寫方式於實作階段依官方遷移指南確認。此為本次改動範圍內的必要前置工作，而非「不需新增依賴」的原假設。

**替代方案**：暫不遷移、沿用已棄用的 `@google/generative-ai`——短期仍可運作，但官方不再維護意味著未來新增多模態能力（如本次 PDF/圖片 inline）時得不到官方支援保證，且與官方最新文件範例脫節，否決。

## Risks / Trade-offs

- [LibreOffice 轉 PPTX 偶有跑版] → 用途是給模型摘要而非人閱讀，輕微跑版無實質影響；嚴重失敗走 D2 的跳過路徑。
- [官方文件 20MB／100MB 兩種上限數字不一致] → 保守以 20MB（inline）為準，見 D4；若未來改走 Files API 需重新評估。
- [apt-get install imagemagick libreoffice-impress 安裝耗時無官方數據] → tasks.md 新增實測任務，先跑一次獨立 CI job 量測秒數與可行性，再定案是否需要快取（如 actions/cache）。
- [多模態後 token 用量上升] → flash-lite 單價低、月一場活動，成本可忽略；預算制已限制上限。
- [模型對應錯講者與投影片] → PR 描述欄位為權威來源，prompt 明示以 PR 描述優先；生成後仍有 PR review 人工把關（既有流程）。
- [轉檔/縮圖暫存檔誤入 auto-commit] → 暫存檔寫到 repo 外目錄（如 `$RUNNER_TEMP`）；auto-commit 的 `file_pattern` 本就只含 README.md。
- [CI 對 PR 提交的二進位檔執行原生轉檔工具（LibreOffice/ImageMagick），且同 job 持有 `GEMINI_API_KEY` 與寫入權杖——惡意構造的檔案理論上可利用解析漏洞在 runner 上執行程式碼]（2026-07-05 程式審查發現，High）→ 維護者裁決**接受風險**：本 repo 僅受信任的貢獻者可參與，且首次貢獻者的 workflow run 需 maintainer 手動核准。低成本緩解已實作：縮圖 step 以 ImageMagick policy 停用高風險 coder/delegate（EPHEMERAL/URL/MVG/MSL/PS/EPS/PDF/XPS 等，只保留點陣格式）。若未來開放不受信任的貢獻來源，應改為「轉檔拆到無 secrets 的獨立 job」再評估。
- [掃描跟隨 symlink 可能讀入 repo 外檔案送往 Gemini]（同次審查發現）→ 已實作緩解：`generate_summary.js` 掃描改用 `lstat`，symlink 一律跳過並 log；workflow 的 `find -type f` 本就不含 symlink。

## Migration Plan

無資料遷移。部署即合併 workflow 與 script 變更；舊活動目錄不受影響。回滾＝revert commit。合併後可刪除 `202602/README.md` 觸發重生成，作為真實案例驗證（維護者手動決定）。

## 已確認的前提（原 Open Questions，已查證）

提案定案前已查證下列三項，結論已回饋進上方 Decisions，不再是待辦：

- **`gemini-2.5-flash-lite` 對 PDF／圖片輸入的支援**：官方模型頁列輸入類型含 Text／image／video／audio／PDF；image-understanding 頁列支援 MIME 含 `image/heic`、`image/heif`。頁數上限與精確計費，官方頁面未逐項列出，D4 的預算數字已改採保守回推（見 D4 計算式），不依賴未公開的官方精確數字。來源：[gemini-2.5-flash-lite 模型頁](https://ai.google.dev/gemini-api/docs/models)、[image-understanding](https://ai.google.dev/gemini-api/docs/image-understanding)。
- **ubuntu-latest runner 的預裝狀態**：Ubuntu 24.04 官方預裝清單未含 ImageMagick 與 LibreOffice（22.04 曾預裝 ImageMagick，24.04 已移除）。D2、D5 已改為明確 `apt-get install`，不假設預裝。來源：[actions/runner-images](https://github.com/actions/runner-images) 的 `Ubuntu2404-Readme.md`。
- **SDK 現況**：`@google/generative-ai` 已於 2025-11-30 遭官方棄用，官方建議遷移至 `@google/genai`（見 D9）。「不需新增依賴」的原假設不成立，已改為「替換依賴」並列入本次改動範圍。
