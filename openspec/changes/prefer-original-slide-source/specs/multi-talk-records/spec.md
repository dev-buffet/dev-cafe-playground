## MODIFIED Requirements

### Requirement: 多份投影片連結與對應標註
生成的活動 README SHALL 為目錄內每份投影片（含由 PPTX 轉出者，連結指向原始 `.pptx` 檔）各列一條連結；有多份時每條 SHALL 標註對應的講者或主題。

PR 描述提供某份投影片的原始網址時，不論素材格式，該條連結 SHALL 指向此網址；PR 描述未提供網址時 SHALL 指向 repo 內的檔案路徑，MUST NOT 自行編造網址。

repo 內素材為不供閱讀（`.html`）或不完整（PR 描述註明為節錄、缺頁或僅供生成用）時，README SHALL 在基本資訊清單之後、`## 活動簡介` 之前，為每份此類檔案加入一個以 `> **關於本目錄的 \`<檔名>\`**：` 開頭的告知區塊，說明該檔案是為生成管線放入 repo 及其原因；有原始網址時 SHALL 請讀者以原始網址觀看，無原始網址時 SHALL 說明內容可能不完整。此類檔案的連結 MUST NOT 在同一行附註 repo 檔路徑。

repo 內素材完整且可閱讀、且有原始網址時，連結 SHALL 指向原始網址，並在同一行附註 `（repo 備份：<路徑>）`。

#### Scenario: 兩份投影片各自成行
- **WHEN** 活動目錄內含兩份投影片檔，分屬不同講者
- **THEN** 基本資訊區出現兩條投影片連結，各自標註講者或主題名稱

#### Scenario: PPTX 連結指向原始檔
- **WHEN** 投影片素材為 `talk.pptx`（CI 轉為 PDF 僅供生成用），PR 描述沒有提供投影片網址
- **THEN** README 中的投影片連結指向 `talk.pptx`，而非暫存 PDF

#### Scenario: HTML 投影片連到原始網址並附告知區塊
- **WHEN** 活動目錄內含 `index.html`，PR 描述的投影片網址欄位為 `https://coreynote.life/Slide-Html/Zerospec-Talk/index.html`
- **THEN** README 的投影片連結指向該網址且同一行沒有原始檔附註，基本資訊清單之後出現 `> **關於本目錄的 \`index.html\`**：` 開頭、請讀者以原始網址觀看的告知區塊

#### Scenario: HTML 投影片無原始網址
- **WHEN** 活動目錄內含 `index.html`，PR 描述沒有提供任何投影片網址
- **THEN** README 的投影片連結指向 `index.html`，告知區塊說明此檔為生成管線素材、無法正確呈現且內容可能不完整，不出現 PR 描述與素材中都沒有的網址

#### Scenario: PR 描述註明 PDF 為節錄版
- **WHEN** 活動目錄內含 `slides.pdf`，PR 描述寫明「slides.pdf 為節錄版」並提供投影片網址
- **THEN** README 的投影片連結指向該網址，告知區塊說明 `slides.pdf` 內容並不完整並請讀者以原始網址觀看

#### Scenario: 多份需告知的檔案各自成區塊
- **WHEN** 活動目錄內含 `index.html` 與註明為節錄版的 `slides.pdf`，PR 描述以含活動目錄名稱的完整路徑提及這兩份檔案
- **THEN** README 出現兩個告知區塊，區塊之間有空行（Markdown 渲染為兩段），區塊內的檔名為相對於活動目錄的路徑（`index.html`、`slides.pdf`），不含活動目錄名稱

#### Scenario: 完整 PDF 有原始網址
- **WHEN** 活動目錄內含完整的 `slides.pdf`，PR 描述提供投影片網址且未註明不完整
- **THEN** README 的投影片連結指向該網址，同一行附註 `（repo 備份：slides.pdf）`，不出現告知區塊
