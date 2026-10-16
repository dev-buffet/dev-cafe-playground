## Why

repo 內的投影片素材不一定是讀者該看的版本：HTML 投影片在 GitHub 上只顯示原始碼、缺少樣式與腳本；講者也可能只提供節錄或缺頁的檔案供生成使用。目前 README 只在 HTML 時連到外部網址並附註「原始檔：index.html」，讀者仍可能點進 repo 檔案，誤以為投影片內容不完整或被錯誤引用（202605 ZeroSpec 一場已需手動補上說明）。

## What Changes

- 投影片連結改為「原作者提供的網址優先」：PR 描述的「投影片網址」有提供時，不論素材格式，該投影片連結一律指向該網址。
- repo 內素材**不供閱讀**（`.html`）或**不完整**（PR 描述註明為節錄、缺頁、僅供生成用）時，README 在投影片連結下方加入固定格式的告知區塊，說明該檔案是為生成管線而放入、請以原始網址觀看；沒有原始網址時說明此為唯一可得版本、內容可能不完整。
- repo 內素材完整且可閱讀（PDF、PPTX、Markdown）又有原始網址時，連結指向原始網址，同一行附註 repo 備份檔路徑。
- 取代先前「HTML 投影片同一行附註原始檔」的規則（202605 已改為告知區塊）。
- PR 模板的「投影片網址」註解補充：放進 repo 的檔案若不完整，請註明。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `multi-talk-records`：「多份投影片連結與對應標註」需求改為原始網址優先，並新增不供閱讀／不完整素材的告知區塊規則。

## Impact

- `scripts/generate_summary.js`：prompt 的投影片連結規則改寫，新增告知區塊範本。
- `.github/pull_request_template.md`：「投影片網址」註解補充不完整素材的註明方式。
- `AGENTS.md`：HTML 投影片說明同步更新。
- 既有活動 README 不受影響（不會被覆蓋）；202605 已手動加上同格式告知。
