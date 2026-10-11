## MODIFIED Requirements

### Requirement: 多份投影片連結與對應標註
生成的活動 README SHALL 為目錄內每份投影片（含由 PPTX 轉出者，連結指向原始 `.pptx` 檔）各列一條連結；有多份時每條 SHALL 標註對應的講者或主題。

投影片素材為 `.html` 時，若 PR 描述提供了該投影片可直接瀏覽的網址，該條連結 SHALL 指向此網址，並 SHALL 在同一行附註 repo 內的原始檔路徑；PR 描述未提供網址時 SHALL 退回指向 repo 內的 `.html` 檔，MUST NOT 自行編造網址。

#### Scenario: 兩份投影片各自成行
- **WHEN** 活動目錄內含兩份投影片檔，分屬不同講者
- **THEN** 基本資訊區出現兩條投影片連結，各自標註講者或主題名稱

#### Scenario: PPTX 連結指向原始檔
- **WHEN** 投影片素材為 `talk.pptx`（CI 轉為 PDF 僅供生成用）
- **THEN** README 中的投影片連結指向 `talk.pptx`，而非暫存 PDF

#### Scenario: HTML 投影片優先連到 PR 描述提供的網址
- **WHEN** 活動目錄內含 `index.html`，PR 描述的投影片網址欄位為 `https://coreynote.life/Slide-Html/Zerospec-Talk/index.html`
- **THEN** README 的投影片連結指向該網址，同一行附註原始檔 `index.html`

#### Scenario: HTML 投影片無外部網址時連到 repo 檔案
- **WHEN** 活動目錄內含 `index.html`，PR 描述沒有提供任何投影片網址
- **THEN** README 的投影片連結指向 `index.html`，不出現 PR 描述與素材中都沒有的網址
