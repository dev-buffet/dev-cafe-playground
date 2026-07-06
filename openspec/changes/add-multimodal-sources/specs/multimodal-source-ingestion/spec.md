# multimodal-source-ingestion

## ADDED Requirements

### Requirement: 型態分流器決定檔案進入 prompt 的方式
生成管線 SHALL 依檔案型態分流處理活動目錄內的每個檔案（`README.md` 除外）：純文字副檔名（`.md .txt .py .js .ts .html .css .json`）作為文字 part；`.pdf` 作為 `inlineData`（`application/pdf`）；圖片（`.jpg .jpeg .png .webp .heic`）縮圖後作為 `inlineData`（`image/*`）；影音與其他不支援的二進位格式 SHALL 跳過並輸出 log 說明原因。

#### Scenario: PDF 投影片進入生成流程
- **WHEN** 活動目錄內含 `slides.pdf`
- **THEN** 該檔以 `inlineData: application/pdf` 附加於 Gemini 請求的 parts 中，生成的 README 反映其內容

#### Scenario: 影音檔被明確跳過
- **WHEN** 活動目錄內含 `recording.mp4`
- **THEN** 該檔不進入請求，且 log 中出現包含檔名與「不支援的格式」原因的訊息，CI 不失敗

#### Scenario: 純文字檔行為不變
- **WHEN** 活動目錄內含 `Slides.md`
- **THEN** 該檔以文字 part 進入請求，沿用單檔 5000 字、總量 30000 字的截斷規則

### Requirement: PPTX 轉檔為 PDF 後進入生成流程
CI workflow SHALL 在變動目錄含 `.pptx` 檔時，以 LibreOffice headless 將其轉為 PDF 後走 PDF 路徑；轉出的暫存 PDF SHALL 置於 repo 外目錄且 MUST NOT 被 commit。轉檔失敗時 SHALL 跳過該檔並輸出 log 提示（建議將重點寫入 PR 描述），MUST NOT 使 CI 失敗。

#### Scenario: PPTX 成功轉檔並進入生成
- **WHEN** 變動目錄內含 `talk.pptx` 且 LibreOffice 轉檔成功
- **THEN** 轉出的 PDF 以 `inlineData` 進入請求，生成的 README 反映投影片內容，且 repo 內不新增 PDF 檔

#### Scenario: PPTX 轉檔失敗時降級
- **WHEN** LibreOffice 轉檔回傳非零或未產出 PDF
- **THEN** 該檔被跳過，log 出現失敗原因與「請將重點寫入 PR 描述」提示，workflow 其餘步驟照常完成

#### Scenario: 無 PPTX 時不安裝 LibreOffice
- **WHEN** 變動目錄內不含 `.pptx`
- **THEN** workflow 不執行 LibreOffice 安裝與轉檔步驟

### Requirement: 圖片縮圖後進入生成流程
生成流程 SHALL 將圖片檔縮至長邊不超過 768px 後才附加為 `inlineData`；縮圖暫存檔 MUST NOT 被 commit。prompt SHALL 說明照片角色為補充活動氛圍與參與狀況，並 SHALL 指示模型不描述個別與會者的外貌特徵。

#### Scenario: 大尺寸照片被縮圖
- **WHEN** 活動目錄內含一張 4000px 寬、4MB 的 `photo.jpg`
- **THEN** 進入請求的版本長邊不超過 768px，且原檔未被修改

#### Scenario: 照片的隱私守則進入 prompt
- **WHEN** 請求包含任何圖片 part
- **THEN** prompt 文字中含有「不描述個別與會者外貌」意旨的指示

### Requirement: 請求預算與優先序裁決
生成流程 SHALL 限制單次請求的 inline（原始檔案，未 base64 編碼前）總體積不超過 14MB；此數字回推自 Gemini inline 請求（文字＋system instruction＋inline bytes）合計 20MB 的官方上限，計入 base64 編碼約 1.34 倍膨脹與文字預留 0.5MB（計算式見 design D4）。超出時 SHALL 依優先序（投影片 PDF > 筆記文字 > 照片）保留素材、反向捨棄（以整檔為單位），每次捨棄 SHALL 輸出 log。單一 PDF 超過 9MB SHALL 直接跳過並 log 提示將重點寫入 PR 描述。

#### Scenario: 照片過多時先捨照片
- **WHEN** 投影片 PDF 與照片合計超過 14MB
- **THEN** 照片自後序起被捨棄至預算內，投影片 PDF 全數保留，log 列出被捨棄的檔名

#### Scenario: 超大單檔 PDF 被跳過
- **WHEN** 活動目錄內含一份 10MB 的 `slides.pdf`
- **THEN** 該檔不進入請求，log 出現體積超限說明與 PR 描述補救提示，其餘素材照常處理

### Requirement: 掃描涵蓋一層子目錄
生成管線 SHALL 掃描活動目錄下第一層子目錄內的檔案（與頂層檔案同樣走型態分流），檔案識別 SHALL 以相對路徑呈現（如 `photos/img1.jpg`）。更深層的目錄 MAY 忽略。

#### Scenario: 子資料夾內的照片被納入
- **WHEN** 活動目錄結構為 `202607/photos/img1.jpg` 與 `202607/slides.pdf`
- **THEN** 兩者皆進入分流處理，圖片以 `photos/img1.jpg` 識別

#### Scenario: 隱藏與系統目錄不掃描
- **WHEN** 活動目錄內含 `.git/`、`node_modules/` 或以 `.` 開頭的子目錄
- **THEN** 該等目錄內容不進入掃描
