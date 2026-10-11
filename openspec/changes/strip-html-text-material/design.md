## Context

`scripts/generate_summary.js` 的型態分流器把 `.html` 歸為 `text`，以 `fs.readFileSync` 原樣讀入後套用單檔 20000 字、總量 100000 字上限。HTML 投影片（reveal.js 等）的標記比例很高：ZeroSpec 範例原始 24694 字，以原型抽取後只剩 4689 字（標記約佔 81%），22 張投影片全部保留。

## Goals / Non-Goals

**Goals:**
- `.html` 素材以可讀文字進入請求，字數上限以抽取後的文字計算。
- 保留對生成 README 有用的資訊：投影片分隔、連結網址、圖片 alt。
- 零新增依賴，維持 script 只依賴 `@google/genai`。

**Non-Goals:**
- 不抓取 HTML 引用的外部 CSS／JS／圖片。
- 不執行 JavaScript：由 JS 動態產生內容的投影片，抽取不到的部分不處理。
- 不調整字數上限數值，也不改 `.md` 等其他文字檔行為。

## Decisions

**D1. 用 regex 抽取，不引入 HTML parser（如 cheerio、jsdom）。**
抽取結果只給 LLM 閱讀，不需要完美 DOM 結構；regex 對投影片 HTML 已足夠，且不增加 CI 安裝時間與供應鏈面。替代方案 cheerio 較穩健，但要新增依賴，收益不足以抵銷。

**D2. 抽取步驟（依序）：**
1. 移除註解 `<!-- -->`。
2. 整段移除 `<head>`、`<script>`、`<style>`、`<noscript>`、`<svg>`、`<template>`（含內容）。
3. `<a href="URL">文字</a>` → `文字 (URL)`，讓 README 能引用講者的連結。
4. `<img alt="X">` → `[圖：X]`（alt 為空則移除）。
5. `<section>` → 分隔線 `---`，保留投影片邊界。
6. 區塊元素（`p div br li h1-h6 tr pre blockquote ul ol table`）→ 換行，其餘標籤移除。
7. 解碼常見 entity（`&nbsp; &lt; &gt; &quot; &#39; &amp;`，以及數字型 `&#NNN;` / `&#xHH;`），`&amp;` 最後解碼避免二次解碼。
8. 壓縮空白：行內多空白合一、3 行以上空行合為 1 行空行。

**D3. 抽取放在讀檔後、截斷前。**
`text = extractHtmlText(text)` 只在副檔名為 `.html` 時執行，之後沿用既有截斷邏輯與 log。log 額外輸出 `HTML 抽取 <檔名>：原始 N 字 → M 字`，方便在 CI 檢查。

**D4. 抽取結果為空時跳過並 log。**
例如整份內容由 JS 動態產生；空字串進入請求沒有意義，跳過時 log 提示講者改附 PDF 或 `Slides.md`。

**D5. HTML 投影片連結規則寫進 prompt，不在程式端改寫 README。**
在 prompt 的投影片連結規則加一句：素材為 `.html` 且 PR 說明提供可瀏覽網址時，連結指向該網址並附註 `（原始檔：<路徑>）`；否則連 repo 檔，嚴禁編造網址。替代方案是生成後由程式改寫連結，但要解析 README 並對應講者與檔案，複雜度高，且既有投影片連結規則本來就由 prompt 掌控。HTML 文字 part 的檔案標籤標成 `（HTML 投影片，已去除標籤）`，讓模型知道哪些檔案適用此規則。

**D6. PR 模板新增「投影片網址」欄位。**
在「活動連結」下方加 `- 投影片網址：`，註解說明 HTML 投影片請填可直接瀏覽的網址、其他格式可留空、多份時每行一個並標註講者。網址出現在 PR 描述即符合 prompt「只能用 PR 說明明確提供的網址」的既有限制。

## Risks / Trade-offs

- [模型未遵守 HTML 連結規則，仍連到 `index.html`] → 驗證時以實際 PR 描述跑一次生成確認；萬一出錯，README 可手動修改且不會被覆蓋。

- [regex 遇到屬性內含 `>` 或不合法 HTML 可能殘留片段] → 只影響閱讀品質，不影響安全或流程；LLM 對少量殘渣容忍度高。
- [JS 動態渲染的投影片抽不到內容] → D4 跳過並 log 引導，PR 描述仍可作為來源。
- [`<pre><code>` 中的程式碼縮排被壓縮] → 只壓縮行內連續空白，換行保留；對摘要影響小。
