# 開發者社群測試活動

- 分享者：Corey（種子）
- 分享者：測試講者
- [投影片：ZeroSpec（Corey）](https://coreynote.life/Slide-Html/Zerospec-Talk/index.html)
- [投影片：Docker 入門（測試講者）](https://example.com/docker-intro-slides)

> **關於本目錄的 `209901-test-html/index.html`**：這份檔案是為了讓 AI 自動生成活動紀錄的管線讀取內容而放入 repo，並非供閱讀的版本——在 GitHub 上只會顯示原始碼，也缺少投影片所需的樣式與腳本，無法正確呈現。請以上方的原始投影片網址觀看完整內容。
> **關於本目錄的 `209902-test-pdf/slides.pdf`**：這份檔案是為了讓 AI 自動生成活動紀錄的管線讀取內容而放入 repo，內容並不完整（只收錄前 3 頁）。請以上方的原始投影片網址觀看完整內容。

## 活動簡介
本次活動為開發者社群的測試活動，旨在驗證多種投影片格式與連結規則在文件生成時的正確處理方式，並同時分享了兩個獨立的主題：Corey 關於 ZeroSpec 的深度解析，以及 Docker 入門基礎知識。

## Corey：ZeroSpec：輔助 SDD 的 Layer 0 方法庫
Corey（種子）在此分享中深入解析 ZeroSpec，這是一個 Layer 0 方法庫，旨在輔助 Spec-Driven Development (SDD)。ZeroSpec 並非 AI 工具本身，而是將專案整理成 AI Agent 能夠理解的結構，尤其適用於 GenAI 協作開發場景。

### 活動背景與 ZeroSpec 定位
分享指出，ZeroSpec 是一種輔助執行 SDD 的 Layer 0 方法庫，它既非運行時環境，也非平台工具或自動化工作流程。它的核心價值在於 AI Coding Agent 動手前，預先將專案的架構規則、模組導覽與可靠資訊源（Source of Truth）放置在 Agent 可找到的位置，以提升「上下文就緒度」（Context Readiness）。ZeroSpec 根植於講者多年 GenAI 協作開發的實踐經驗，強調「先看地圖」、「先講邊界」與「反覆驗證」等習慣的整理。

### SDD 簡介與 Plan Model
講者首先回顧了 Spec-Driven Development (SDD) 的核心概念，強調它並非單純將規格丟給 AI，而是將需求、規則與設計判斷轉化為可討論、可追蹤的規格，再由 AI 或工程師據此實作。其中，「Plan Model」被視為 SDD 的最小操作單位，包含清晰定義「要做什麼」與「不能踩什麼」的計畫（Plan）、依計畫實作（Execute），以及透過測試、審查和文件同步確認方向（Review）三個階段。

### 真實開發團隊的挑戰
分享深入探討了 GenAI 協作開發中，真實開發團隊常遇到的三大挑戰：
1.  **既有程式碼的歷史包袱**：AI 雖擅長模仿，但也可能學習到專案中不規範的舊有寫法或漏洞。研究顯示，AI 在學習不良程式碼後，甚至可能產生「黑化」行為，在無關對話中給出暴力或欺騙性建議。專案中若無明確標註過渡期寫法，AI 可能誤將其視為範本。
2.  **多人開發習慣不同步**：命名、分層、測試等習慣缺乏一致性，導致團隊成員與 AI 難以掌握潛在的「雷區」。
3.  **技術文件難以維護**：文件過於冗長或散落在不同地方，導致 API 與文件內容逐漸脫節。

這些問題共同導致全球開發者調查中，AI 答案「幾乎對但不完全對」的普遍挫折感，甚至在特定情境下降低開發效率，凸顯上下文品質對 AI 協作的重要性。

### ZeroSpec 核心內容與導入流程
ZeroSpec 是一套純 Markdown、零依賴且不綁定單一 AI 平台的 Layer 0 方法庫，其關鍵內容包括：
*   **核心檔案 (Core files)**：`AGENTS.md` (為 AI 與協作者設計的專案地圖與提示入口) 及 `/docs/README.md` (為人類開發者設計的 SDD 文件導覽與決策矩陣)。強調明確劃定邊界，讓 AI 與新人都能清楚瞭解可動與不可動的範圍。
*   **引導建置 (Bootstrap)**：首次導入時，透過 `INIT-SCAN` 引導 AI 掃描專案並產出架構草案，經人工 Review 修正後，再由 `INIT-BUILD` 生成正式的 `AGENTS.md` 與 `/docs/README.md`。此流程確保 AI 在產出前已正確理解專案。
*   **持續 SDD (Continuous SDD)**：包含 `SPEC`、`ADR`、`SA`、`IMPL` 等流程，以及 `UPDATE`、`AUDIT`、`DRIFT` 等維護機制，確保專案地圖不會成為一次性遺產。

### 進階應用與長期維護
ZeroSpec 亦支援 Agent-Skill 整合，允許附掛 Skill 實現對話觸發，支援專案級（Local）與個人全域（Global）兩種掛載方式。新功能開發時，建議從閱讀 `AGENTS.md` 開始，確認規格（SPEC）後再進行實作與驗證。長期維護則透過 `UPDATE`、`AUDIT`、`DRIFT` 等事件驅動的持續校正機制，保持專案地圖的同步性與即時性。

### 總結與適用場景
分享總結指出，SDD 的第一步是確保上下文的可理解性，AI 程式碼不穩往往源於專案地圖的不完整。ZeroSpec 提供了一個最小的起點，基礎文件即可自主運作，並能漸進銜接 OpenSpec / Spec Kit 等 Layer 1 框架。建議適用於團隊人數大於等於 2 人、專案需長期維護、且架構規則開始分散的場景，而不適用於一次性概念驗證或短期腳本開發。

### AGENTS.md 設計原則
講者特別強調 `AGENTS.md` 的長度應控制在 150-300 行（約 2K-4K tokens），以避免過長壓縮任務上下文或導致 AI 難以抓住重點。過於細節的內容應移至 `/docs/` 子檔案，再透過導航表引用，以提供 AI 剛好夠用的地圖。

---

## 測試講者：Docker 入門
關於測試講者所分享的 Docker 入門主題，本次活動紀錄未收錄其詳細內容。

本文由 AI + Claude Code 協助整理