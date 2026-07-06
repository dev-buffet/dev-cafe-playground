# Tasks: add-multimodal-sources

## 1. 已確認的前提（原「前置查證」，已於提案定案前完成）

- [x] 1.1 已查證：`gemini-2.5-flash-lite` 官方模型頁列輸入類型含 Text/image/video/audio/PDF，支援 PDF 輸入；頁數上限與精確計費官方頁面未逐項列出，design D4 的預算數字已改採保守回推，不依賴此細節
- [x] 1.2 已查證：Gemini 圖片輸入原生支援 HEIC（image-understanding 頁列支援 MIME 含 `image/heic`、`image/heif`），縮圖步驟不需額外轉 JPEG（design D5 已同步簡化）
- [x] 1.3 已查證：ubuntu-latest（Ubuntu 24.04）官方預裝清單未含 ImageMagick 與 LibreOffice（來源：actions/runner-images 的 `Ubuntu2404-Readme.md`），workflow 需明確安裝，見任務 5.2/5.3

## 2. SDK 遷移：`@google/generative-ai` → `@google/genai`

- [x] 2.1 `package.json`：移除 `@google/generative-ai`，改用 `@google/genai`（現為 2.x），更新 lockfile
- [x] 2.2 `scripts/generate_summary.js`：改寫 client 初始化與生成呼叫為 `@google/genai` 對應介面，依官方遷移指南（https://ai.google.dev/gemini-api/docs/migrate）調整既有純文字生成路徑
- [x] 2.3 本機以既有純文字案例跑一次 `generate_summary.js`，確認新 SDK 呼叫成功、輸出與遷移前一致（2026-07-05 以 202601 拷貝驗證通過）

## 3. generate_summary.js — 型態分流與 parts 組裝

- [x] 3.1 掃描邏輯改為涵蓋一層子目錄（跳過 `.` 開頭與 `node_modules`），檔案以相對路徑識別
- [x] 3.2 以型態分流器取代 `validExtensions` 白名單：文字/PDF/圖片/跳過四類，跳過時 log 檔名與原因
- [x] 3.3 prompt 組裝從單一字串改為 parts 陣列：文字 part 沿用現有截斷邏輯，PDF 與圖片以 base64 `inlineData` 附加（改用任務 2 遷移後的 `@google/genai` part 型別）
- [x] 3.4 實作請求預算制：inline 原始檔案（未編碼前）總量上限 **14MB**、單檔 PDF 上限 **9MB**（計算式見 design D4：X × 1.34 ＋ 文字預留 0.5MB ≤ 20MB），優先序投影片 > 文字 > 照片，整檔捨棄並 log

## 4. generate_summary.js — prompt 輸出格式（multi-talk-records）

- [x] 4.1 更新 prompt 格式要求：分享者可多位、投影片可多條且標註對應講者/主題、PPTX 素材連結指向原始 `.pptx`
- [x] 4.2 prompt 加入對應推斷規則：PR 描述指派優先、其次投影片內容推斷、無法確定不虛構
- [x] 4.3 prompt 加入照片角色定位與隱私指示（補充氛圍、不描述個別與會者外貌）

## 5. CI workflow（ai-readme.yml）

- [ ] 5.1 實測：先跑一次獨立 CI job（或 `workflow_dispatch` 手動觸發），量測 `apt-get install imagemagick libreoffice-impress` 的安裝秒數，並驗證 PPTX→PDF headless 轉檔可行性；依結果決定是否需要快取（如 `actions/cache`）或改變安裝方案，再定案下列步驟的實作細節
- [x] 5.2 新增條件式 PPTX 轉檔步驟：偵測變動目錄含 `.pptx` 才執行 `apt-get install libreoffice-impress` 並轉檔至 `$RUNNER_TEMP`；失敗時 log 提示、不 fail CI
- [x] 5.3 新增圖片縮圖步驟：偵測到圖片檔時執行 `apt-get install imagemagick`（Ubuntu 24.04 未預裝，不可假設已存在），縮圖長邊 768px 輸出至 `$RUNNER_TEMP`，並把暫存目錄路徑以環境變數傳給 script
- [x] 5.4 確認 auto-commit 的 `file_pattern` 不會撈進任何暫存產物

## 6. 本機驗證

- [x] 6.1 以 `202602/` 的真實 PPTX 手動轉 PDF 後本機跑 `generate_summary.js --force`（另拷貝到暫存目錄測試，不動 repo 內既有 README），驗證新 SDK 下 PDF inlineData 流程與生成品質（2026-07-05 部分驗證：本機無 LibreOffice，改以自製含實質內容的 PDF 驗證 inlineData 流程通過——生成內容含 PDF 專有詞、非幻覺；PPTX→PDF 轉檔路徑待 5.1/8.1 於 CI 驗證）
- [x] 6.2 建立多講者測試目錄（兩份投影片＋照片子資料夾）本機生成，驗證多講者列名、投影片對應、照片納入與預算捨棄 log（2026-07-05 驗證通過：兩位講者皆列名、主題段落不混雜、照片描述符合隱私守則、本機無縮圖目錄時 fallback log 正確）
- [x] 6.3 邊界測試：含 `.mp4` 與超過 9MB 的 PDF 的目錄，驗證跳過與 log 行為（2026-07-05 驗證通過：兩檔皆跳過且 log 含檔名與原因；無 PR 描述時降級跳過、有 PR 描述時仍生成。過程中發現模型會虛構不存在的投影片檔名，已在 prompt 加入「嚴禁編造檔名或網址」約束並重測確認不再出現）

## 7. 文件同步

逐條列出需更新的既有敘述（實作階段動手，本次規劃不直接修改這些檔案）：

- [x] 7.1 `AGENTS.md:7`「`package.json` 的唯一依賴 `@google/generative-ai`」→ 隨 SDK 遷移（任務 2）過時，改為 `@google/genai`
- [x] 7.2 `AGENTS.md:14`「生成腳本只讀 `.md`/`.txt`/.../；**`.pptx`、`.pdf` 不會被讀取**」→ 升級後為事實錯誤，改寫為型態分流器支援 PDF/PPTX/圖片的說明
- [x] 7.3 `AGENTS.md:20`「讀取變動目錄內的檔案（單檔截斷 5000 字、總量上限 30000 字）」→ 截斷邏輯只適用文字 part，對 PDF/圖片不適用，需改寫為區分文字截斷與 inline 預算（14MB/9MB）
- [x] 7.4 `AGENTS.md:39`「優先把資訊寫成 `.md` 放進活動目錄，其次補進 PR 描述——這兩處是生成管線唯二的資料來源」→ 前提消失（PDF/PPTX/圖片皆為直接來源），需改寫
- [x] 7.5 `README.md:29`「投影片建議使用 Markdown 格式；若為 PDF 或其他格式，請在 PR 描述中補充說明」→ 過時，改為說明 PDF/PPTX/圖片可直接放入目錄
- [x] 7.6 `.github/pull_request_template.md:11`「AI 會讀取目錄中所有 `.md` 檔案來產生活動紀錄」→ 事實錯誤，改為涵蓋 PDF/PPTX/圖片的說明

## 8. 端到端驗證

- [ ] 8.1 開測試 PR（含 PPTX＋照片的測試活動目錄）走完整 CI 流程，確認生成 README 符合兩份 spec 的 scenarios、無暫存檔被 commit
- [ ] 8.2 驗證通過後移除測試目錄或轉為正式活動紀錄，並向維護者確認是否刪除 `202602/README.md` 觸發真實案例重生成
