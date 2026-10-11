## Why

講者開始用單頁 HTML 投影片（如 reveal.js）分享，但生成管線把 `.html` 當純文字原樣讀入，字數幾乎都花在標籤、class 與 inline script 上。實例：ZeroSpec 分享的 `index.html` 只有 22 張投影片，原始 24694 字超過單檔 20000 字上限，最後幾張被截斷；去除標籤後可讀文字只有約 4700 字。照現況，稍長一點的 HTML 投影片幾乎必然被截斷。

## What Changes

- 生成管線讀取 `.html` 素材時，先抽取可讀文字（移除 `<head>`、`<script>`、`<style>`、註解與標籤，保留連結網址、圖片 alt、投影片分隔），再套用既有的單檔與總量字數上限。
- 字數上限以「抽取後的文字」計算，上限數值本身不變（單檔 20000、總量 100000）。
- 其他文字副檔名（`.md .txt .js .ts .css .json` 等）行為不變。
- 不新增 npm 依賴。
- `.html` 投影片在 GitHub 上只會顯示原始碼，人無法閱讀：README 的投影片連結改為優先指向 PR 描述提供的可瀏覽網址，repo 內原始檔附註在同一行；沒有網址時才連 repo 檔。
- PR 模板新增「投影片網址」欄位，提示 HTML 投影片填可直接瀏覽的網址。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `multimodal-source-ingestion`：「型態分流器決定檔案進入 prompt 的方式」需求新增 `.html` 先抽取可讀文字、字數上限以抽取後文字計算的規則。
- `multi-talk-records`：「多份投影片連結與對應標註」需求新增 HTML 投影片優先連 PR 描述網址的規則。

## Impact

- `scripts/generate_summary.js`：文字分支新增 HTML 抽取步驟；prompt 的投影片連結規則加入 HTML 例外。
- `.github/pull_request_template.md`：新增「投影片網址」欄位。
- `AGENTS.md`：素材說明補一句 HTML 投影片會先去標籤。
- CI workflow 不需改動。
