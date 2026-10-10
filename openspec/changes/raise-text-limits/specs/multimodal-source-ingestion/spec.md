## MODIFIED Requirements

### Requirement: 型態分流器決定檔案進入 prompt 的方式
生成管線 SHALL 依檔案型態分流處理活動目錄內的每個檔案（`README.md` 除外）：純文字副檔名（`.md .txt .py .js .ts .html .css .json`）作為文字 part；`.pdf` 作為 `inlineData`（`application/pdf`）；圖片（`.jpg .jpeg .png .webp .heic`）縮圖後作為 `inlineData`（`image/*`）；影音與其他不支援的二進位格式 SHALL 跳過並輸出 log 說明原因。

文字 part SHALL 套用單檔 20000 字、總量 100000 字的截斷規則：單檔超過 20000 字時截斷至 20000 字並附上截斷標記；文字總量 MUST NOT 超過 100000 字，剩餘額度不足以容納整份檔案時 SHALL 將該檔截斷至剩餘額度，剩餘額度為 0 時 SHALL 跳過該檔。每次截斷或跳過 SHALL 輸出包含檔名的 log。

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
