## 1. HTML 抽取實作

- [x] 1.1 在 `scripts/generate_summary.js` 新增 `extractHtmlText(html)`，依 design D2 的步驟抽取可讀文字
- [x] 1.2 文字分支讀檔後，副檔名為 `.html` 時呼叫 `extractHtmlText`，並 log 抽取前後字數（design D3）
- [x] 1.3 抽取結果為空時跳過該檔並 log（design D4）

## 2. HTML 投影片連結

- [x] 2.1 HTML 文字 part 的檔案標籤標為 `（HTML 投影片，已去除標籤）`（design D5）
- [x] 2.2 prompt 的投影片連結規則加入 HTML 例外：有 PR 說明網址時連該網址並附註原始檔，否則連 repo 檔（design D5）
- [x] 2.3 `.github/pull_request_template.md` 新增「投影片網址」欄位與註解（design D6）

## 3. 驗證

- [x] 3.1 以 ZeroSpec 範例 `index.html` 驗證：抽取後低於 20000 字、22 張投影片文字都在、不含 script/style 內容
- [x] 3.2 以小型測試 HTML 驗證連結轉 `文字 (URL)`、圖片 alt 轉 `[圖：X]`、entity 正確解碼
- [x] 3.3 驗證空內容 HTML 被跳過並 log
- [x] 3.4 驗證 `.md` 檔行為不變（截斷邏輯與既有 scenario 一致）
- [ ] 3.5 以含投影片網址的 PR 描述實際跑一次生成（需 `GEMINI_API_KEY`），確認 README 投影片連結指向外部網址並附註原始檔

## 4. 文件

- [x] 4.1 更新 `AGENTS.md` 目錄慣例：`.html` 會先去標籤再計算字數，外部 CSS/JS 與 JS 動態內容不會被讀取；HTML 投影片請在 PR 描述填可瀏覽網址
