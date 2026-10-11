## MODIFIED Requirements

### Requirement: 型態分流器決定檔案進入 prompt 的方式
生成管線 SHALL 依檔案型態分流處理活動目錄內的每個檔案（`README.md` 除外）：純文字副檔名（`.md .txt .py .js .ts .html .css .json`）作為文字 part；`.pdf` 作為 `inlineData`（`application/pdf`）；圖片（`.jpg .jpeg .png .webp .heic`）縮圖後作為 `inlineData`（`image/*`）；影音與其他不支援的二進位格式 SHALL 跳過並輸出 log 說明原因。

`.html` 檔案 SHALL 先抽取可讀文字再進入後續處理：移除註解與 `<head>`、`<script>`、`<style>` 等非內容區塊及所有標籤，保留連結網址、圖片 alt 文字與 `<section>` 投影片分隔。抽取時 SHALL 輸出包含檔名與抽取前後字數的 log；抽取結果為空時 SHALL 跳過該檔並 log。

文字 part SHALL 套用單檔 20000 字、總量 100000 字的截斷規則，`.html` 以抽取後的文字計算字數：單檔超過 20000 字時截斷至 20000 字並附上截斷標記；文字總量 MUST NOT 超過 100000 字，剩餘額度不足以容納整份檔案時 SHALL 將該檔截斷至剩餘額度，剩餘額度為 0 時 SHALL 跳過該檔。每次截斷或跳過 SHALL 輸出包含檔名的 log。

#### Scenario: PDF 投影片進入生成流程
- **WHEN** 活動目錄內含 `slides.pdf`
- **THEN** 該檔以 `inlineData: application/pdf` 附加於 Gemini 請求的 parts 中，生成的 README 反映其內容

#### Scenario: 影音檔被明確跳過
- **WHEN** 活動目錄內含 `recording.mp4`
- **THEN** 該檔不進入請求，且 log 中出現包含檔名與「不支援的格式」原因的訊息，CI 不失敗

#### Scenario: 純文字檔以文字 part 進入請求
- **WHEN** 活動目錄內含 6739 字的 `Slides.md`
- **THEN** 該檔以文字 part 完整進入請求，不被截斷

#### Scenario: 單檔超過上限被截斷
- **WHEN** 活動目錄內含 25000 字的 `notes.md`
- **THEN** 該檔僅前 20000 字進入請求，內容附上截斷標記，log 出現包含檔名的截斷訊息

#### Scenario: 總量為硬上限，剩餘額度不足時截斷而非跳過
- **WHEN** 活動目錄內含 6 份各 20000 字的文字檔
- **THEN** 前 5 份完整進入請求，第 6 份因剩餘額度為 0 被跳過並 log；文字總量不超過 100000 字

#### Scenario: 剩餘額度部分可用
- **WHEN** 已讀入的文字總量為 95000 字，下一份文字檔有 12000 字
- **THEN** 該檔截斷至 5000 字後進入請求，log 出現包含檔名的截斷訊息，文字總量恰為 100000 字

#### Scenario: HTML 投影片抽取後完整進入請求
- **WHEN** 活動目錄內含原始 24694 字、22 個 `<section>` 的 reveal.js `index.html`
- **THEN** 該檔去除標籤後以不到 20000 字的文字 part 完整進入請求，不被截斷，22 張投影片的文字皆在其中，log 出現抽取前後字數

#### Scenario: HTML 中的連結與圖片說明被保留
- **WHEN** `.html` 含 `<a href="https://example.com">官網</a>` 與 `<img alt="架構圖">`
- **THEN** 抽取後的文字含 `官網 (https://example.com)` 與 `[圖：架構圖]`，且不含 `<script>`、`<style>` 的內容

#### Scenario: 抽取結果為空的 HTML 被跳過
- **WHEN** `.html` 的 `<body>` 只有 `<div id="app"></div>` 與 `<script>`
- **THEN** 該檔不進入請求，log 出現包含檔名、說明抽取後無內容的訊息
