# AGENTS.md — dev-cafe-playground

給 AI 協作工具（Claude Code、Copilot、Cursor 等）的專案說明。與人溝通、寫內容一律使用繁體中文（台灣用語）。

## 這個 repo 是什麼

高雄「開發者 Buffet」社群的實體聚會「開發者 Café」活動紀錄庫：投影片、照片、筆記與連結。**這不是程式專案**——沒有 build、沒有測試（`npm test` 是空的）；`package.json` 的唯一依賴 `@google/genai` 是給 CI 的 README 生成腳本用的。

## 目錄慣例

- 每場活動一個目錄：`20YYMM/` 或 `20YYMM-主題名稱/`（例：`202412/`、`202602-opencore/`）。
- 目錄內放素材：投影片建議命名 `Slides.md`；照片、筆記、連結檔皆可。
- 每個活動目錄的 `README.md` 是 **AI 自動生成的活動紀錄**，來源見下節。
- 生成腳本依型態分流器處理素材：文字檔（`.md`/`.txt`/`.js`/`.ts`/`.html`/`.css`/`.json`）直接讀取內容，PDF 與圖片（`.jpg`/`.png`/`.webp`/`.heic` 等）以多模態方式送入模型，**`.pptx` 會先由 CI 轉成 PDF 再讀取**；影音檔（`.mp4` 等）與其他不支援的二進位格式仍會被跳過。

## README 自動生成管線（動手前必讀）

PR 觸及 `20**` 開頭路徑時，[.github/workflows/ai-readme.yml](.github/workflows/ai-readme.yml) 會執行 [scripts/generate_summary.js](scripts/generate_summary.js)：

1. 讀取變動目錄內的檔案（含一層子目錄）＋ PR 描述：文字檔沿用截斷邏輯（單檔 5000 字、總量上限 30000 字），PDF／PPTX／圖片改計入另一套請求體積預算，超出預算時依優先序捨棄並 log。
2. 用 Gemini（`gemini-2.5-flash-lite`，需 repo secret `GEMINI_API_KEY`）生成該目錄的 `README.md`。
3. 把新活動插入根 `README.md` 的「## 活動列表」區塊。
4. auto-commit 回 PR branch（commit message 帶 `[skip ci]`）。

**行為規則（會影響你該怎麼做）：**

- 已存在的活動 `README.md` **不會被覆蓋**。要重新生成：刪除該 `README.md` 後推新 commit。要微調內容：直接手動編輯即可，不會被後續推送蓋掉。
- 根 README 活動列表的去重是比對 `(./目錄名/)` 字串。手動加項目請照格式 `- [YYYY-MM 活動標題](./目錄名/)`，格式不對會導致 CI 之後插入重複項目。
- 本機執行：`GEMINI_API_KEY=xxx node scripts/generate_summary.js [目錄路徑...]`；不帶參數會掃描所有活動目錄；加 `--force` 才會覆蓋既有 README。

## 貢獻流程

1. 開分支（慣例：`feat/add-YYYYMM-activity`），新增活動目錄與素材。
2. 開 PR 合回 `main`，描述照 [.github/pull_request_template.md](.github/pull_request_template.md) 填：分享者、活動日期、活動連結、活動簡介——AI 生成會取用這些欄位。
3. 等 CI 生成 `README.md`，確認內容無誤後合併。

## AI 協作守則

- 幫講者整理素材時，PDF、PPTX、圖片都可以直接放進活動目錄作為生成來源；Markdown 仍是對 AI 最省預算、內容最可控的格式，能整理成 `.md` 時建議優先採用，其餘素材與 PR 描述一樣會被生成管線讀取。
- 不要代替生成管線手寫活動 `README.md`（除非使用者明說要手動微調既有內容）。
- 修改 [.github/workflows/ai-readme.yml](.github/workflows/ai-readme.yml) 或 [scripts/generate_summary.js](scripts/generate_summary.js) 屬維運變更，先向維護者確認再動。
- 對外資訊（Facebook 社團、Discord、活動時間地點）以根 [README.md](README.md) 現有內容為準，不要憑印象改寫。
