## 1. Prompt 規則

- [x] 1.1 改寫 `scripts/generate_summary.js` prompt 的投影片連結規則：原始網址優先、三類素材附註方式（design D1、D2）
- [x] 1.2 在 prompt 加入告知區塊 A／B 範本與位置（design D3），文字與 202605 README 一致
- [x] 1.3 確認 PPTX 的檔案標籤說明與新規則不衝突（有原始網址時連網址，否則連 `.pptx`）

## 2. 模板與文件

- [x] 2.1 `.github/pull_request_template.md`「投影片網址」註解補充：放進 repo 的檔案若為節錄、缺頁或僅供生成用，請註明
- [x] 2.2 `AGENTS.md` HTML 投影片說明改為新規則（原始網址優先、不供閱讀／不完整素材加告知區塊）

## 3. 驗證

- [x] 3.1 本機確認 script 語法與既有測試仍通過（`buildRequestParts` 對 HTML、`.md` 行為不變）
- [ ] 3.2 開測試用 draft PR（測試活動目錄，驗證後關閉不合併），以 CI 實跑：HTML＋網址、PDF 註明節錄＋網址兩種情境，確認 README 連結與告知區塊符合 spec
