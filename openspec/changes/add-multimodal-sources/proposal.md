# Proposal: add-multimodal-sources

## Why

活動素材最常見的形式是 PDF 與 PPTX 投影片，以及現場照片，但目前 README 自動生成管線（`scripts/generate_summary.js`）只讀純文字副檔名白名單，這些檔案完全進不了生成流程——投影片內容必須靠講者手動改寫成 `.md` 或補進 PR 描述，實務上經常缺漏，導致生成的活動紀錄品質不穩定（實例：`202602/` 內的 `.pptx` 完全沒有進入該場紀錄）。同時，一場活動可能有多位講者、多份投影片，現行生成格式假設單一投影片連結，無法完整呈現多場次分享。

## What Changes

- 生成管線的檔案處理從「副檔名白名單」改為「型態分流器（modality router）」：每個檔案依型態決定進入 prompt 的方式，而非只決定收或不收。
- PDF 檔案以 Gemini 多模態原生能力直接送入（`inlineData: application/pdf`），模型可看到每頁的圖文版面。
- SDK 由 `@google/generative-ai` 遷移至 `@google/genai`：前者已於 2025-11-30 遭 Google 官方棄用（npm 上未加 deprecated 旗標、仍可安裝執行，但不再積極維護），官方 document-processing 文件的 JS 範例改以 `@google/genai` 送 inline base64 PDF，本次一併完成遷移（`package.json` 換依賴、`scripts/generate_summary.js` 的 API 呼叫改寫）。來源：https://ai.google.dev/gemini-api/docs/libraries 、https://ai.google.dev/gemini-api/docs/migrate 、https://github.com/googleapis/js-genai
- PPTX 檔案在 CI 中先以 LibreOffice headless 轉為 PDF，再走 PDF 路徑。
- 圖片檔（.jpg/.png/.webp/.heic）縮圖後以 `inlineData` 送入，prompt 中明確定位其角色（補充活動氛圍，不描述個別與會者外貌）。
- 影音檔（.mp4/.mov/.mp3 等）與其他不支援的二進位格式（.zip/.key/.xlsx 等）明確跳過並輸出 log 提示。
- 新增「請求預算制」：文字截斷維持現行邏輯，另加請求體積上限（inline ~20MB）與素材優先序（投影片 > 筆記文字 > 照片），超出預算依優先序捨棄並 log 提示。不採用 Gemini Files API。
- CI workflow（`.github/workflows/ai-readme.yml`）新增條件式 LibreOffice 安裝與 PPTX 轉檔步驟（僅在變動目錄含 `.pptx` 時執行）。
- 生成紀錄支援多講者、多份投影片：基本資訊區可列多條投影片連結並標註對應講者/主題；投影片與講者的對應交由模型從投影片首頁（多模態可直接閱讀）與 PR 描述推斷，不強加目錄或檔名慣例。
- 檔案掃描支援子目錄（遞迴一層），素材可用子資料夾整理（如 `photos/`、各講者一資料夾）。
- PR template 補充提示：多位講者時請在描述中註明誰分享哪份投影片。

## Capabilities

### New Capabilities

- `multimodal-source-ingestion`: 生成管線如何辨識、轉換、分流活動目錄內的各型態檔案（文字、PDF、PPTX、圖片、影音、其他），含子目錄掃描，以及請求預算與優先序的裁決規則。
- `multi-talk-records`: 生成的活動紀錄對多講者、多份投影片活動的呈現要求——講者列名、多條投影片連結、投影片與講者/主題的對應方式。

### Modified Capabilities

（無——本專案尚無既有 spec；現行純文字讀取行為一併納入上述新 capability 規格化。）

## Impact

- **程式碼**：`scripts/generate_summary.js`（檔案掃描、prompt 組裝從單一字串改為 parts 陣列）、`.github/workflows/ai-readme.yml`（轉檔與縮圖步驟）。
- **依賴**：CI 環境需要 LibreOffice 與 ImageMagick（ubuntu-latest／Ubuntu 24.04 官方預裝清單皆未含，需 workflow 明確 `apt-get install`，詳見 design）；npm 依賴由 `@google/generative-ai`（已遭官方棄用）遷移至 `@google/genai`（2.x），非「不新增依賴」而是「替換依賴」。
- **成本**：Gemini 請求 token 數上升（PDF 每頁約當一張圖），`gemini-2.5-flash-lite` 單價低、每月一場活動，影響可忽略。
- **行為相容性**：既有活動目錄的 README 不受影響（管線本就不覆蓋已存在的 README）；純文字素材的處理行為不變。
- **文件**：`AGENTS.md`、根 `README.md`、`.github/pull_request_template.md` 中多處關於「檔案格式不支援」「唯一依賴」「截斷邏輯」「.md 為唯二資料來源」的敘述已隨本次改動過時，逐條清單見 `tasks.md` 文件同步段落；`.github/pull_request_template.md` 另補充多講者對應提示。
- **已查證前提**（原「待查證項」，已於提案定案前完成查證，結果與來源見 `design.md`）：`gemini-2.5-flash-lite` 支援 PDF 與圖片（含 HEIC/HEIF）輸入；ubuntu-latest（Ubuntu 24.04）未預裝 ImageMagick 與 LibreOffice，需 CI 明確安裝；`@google/generative-ai` 已遭官方棄用，改用 `@google/genai`。
