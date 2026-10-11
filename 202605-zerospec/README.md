# 我為什麼做 ZeroSpec：先把專案整理到 AI 看得懂

- 分享者：Corey（種子）
- 活動連結：https://www.facebook.com/events/984125604261071/
- 投影片：[ZeroSpec：輔助 SDD 的 Layer 0 方法庫（Corey）](https://coreynote.life/Slide-Html/Zerospec-Talk/index.html)

> **關於本目錄的 `index.html`**：這份檔案是為了讓 AI 自動生成活動紀錄的管線讀取內容而放入 repo，並非供閱讀的版本——在 GitHub 上只會顯示原始碼，也缺少投影片所需的樣式與腳本，無法正確呈現。請以上方的原始投影片網址觀看完整內容。

## 活動簡介

本次開發者 Café 的主題為「我為什麼做 ZeroSpec：先把專案整理到 AI 看得懂」。分享者 Corey 深入探討了他在這幾年運用生成式 AI 協作開發的經驗，特別是如何將專案內容整理成 AI Agent 能夠理解的模式。這些實踐經驗被系統化地整理成一套可重複使用的方法庫 ZeroSpec，旨在作為 SDD（Spec-Driven Development）的 Layer 0 輔助工具。

Corey 的分享旨在引導開發者思考，在導入 AI 協作之前，如何為專案建立清晰的上下文，確保 AI 能夠有效且正確地參與開發流程。

## Corey：我為什麼做 ZeroSpec：先把專案整理到 AI 看得懂

Corey 強調 ZeroSpec 並非一個 AI 工具，而是一套方法庫，其核心目的是幫助開發者在 GenAI 協作開發時，能有效地將專案整理成 AI Agent 易於理解的狀態。

### 回顧 Spec-Driven Development (SDD)

分享首先回顧了 SDD 的概念。SDD 並非簡單地將規格丟給 AI 就結束，而是更精確地描述了將需求、規則與設計判斷整理成可討論、可追蹤的規格後，再由 AI 或工程師進入實作的過程。其流程涵蓋需求與規則的規格化、實作與驗證。

### Plan Model：SDD 的最小操作單位

Plan Model 被視為 SDD 的最小操作單位，包含 Plan、Execute、Review 三個階段。首先明確規劃要做什麼與不能做什麼（Plan），接著讓 AI 或工程師依計畫實作（Execute），最後透過測試、審查與文件同步確認結果（Review）。這個模型是許多 SDD 實作的基礎。

### ZeroSpec 與 OpenSpec / Spec Kit 的差異

Corey 進一步比較了 ZeroSpec 與 OpenSpec/Spec Kit 這兩個 Layer 1 框架。OpenSpec 和 Spec Kit 假設 AI 已讀懂專案，並協助完成從規格到實作的流程。OpenSpec 採用彈性迭代（Fluid）風格，適合既有專案漸進加功能；Spec Kit 則採階段門控（Phase-gated）風格，適合從零建置或需嚴格治理的專案。ZeroSpec 則不同，它不是 OpenSpec/Spec Kit 的簡化版，而是它們前面的「上下文基線」（context baseline），扮演 Layer 0 的角色，確保 AI 在動手前已具備足夠的專案理解。

---

### 真實開發團隊的挑戰

在實際開發中，團隊常遇到以下問題：

*   **既有程式碼的歷史包袱**：AI 雖然善於模仿，但也容易學到不良習慣。當舊程式碼中存在繞過規則或帶有安全漏洞的寫法時，AI 可能會將其視為範本，甚至導致「黑化」行為，產生不佳的建議或邏輯。
*   **多人開發習慣不同步**：命名、分層、測試習慣不一致，或不同開發者對「不能踩的線」認知不同，導致新人與 AI 難以適應。
*   **技術文件難以維護**：README 過於冗長、規則散落在各種紀錄中、API 與文件不同步等問題，使得文件難以作為可靠的指南。

全球開發者調查也指出，AI 答案「幾乎對但不完全對」是主要挫折，且在特定情境下，資深開發者使用 AI 工具反而可能導致效率降低，這都突顯了上下文品質對 AI 協作的重要性。

---

### GenAI 開發的現況與挑戰

AI 開發工具更新迭代快速，如果每次更換工具都需重建一套工作流習慣，時間將耗費在追趕工具上，而非累積穩定的協作方式。因此，關鍵問題轉變為：是否存在一份不太會隨工具變化的「專案地圖」？

### 何謂 ZeroSpec？

ZeroSpec 是一套輔助執行 SDD 的 Layer 0 方法庫。它不是執行環境、平台工具或自動化工作流程。ZeroSpec 的目標是在 AI Coding Agent 動手前，將專案的架構規則、模組導覽與可靠資訊源（Source of Truth）放置在 Agent 能夠輕易找到的位置，達到「上下文就緒」（Context Readiness）。

### Corey 的個人習慣整理

ZeroSpec 並非憑空設計的框架，而是將 Corey 個人在 GenAI 協作開發中反覆驗證有效的習慣整理而成，這些習慣包括：
*   **先看地圖**：動手前確認架構、模組與文件依據。
*   **先講邊界**：明確區分可修改、不可修改與需同步之處。
*   **反覆驗證**：透過換模型、跑測試與審查，確保結果正確無偏。

### ZeroSpec 關鍵內容

ZeroSpec 的核心內容包括：
*   **Core files**：`AGENTS.md` (為 AI 與協作者設計的專案地圖與提示入口)、`docs/README.md` (為人類開發者設計的 SDD 文件導覽)。
*   **Bootstrap**：`INIT-SCAN` (使用 Prompt 引導 AI 掃描專案目錄，輸出架構與邊界草案)、`INIT-BUILD` (人工確認後，讓 AI 正式生成文件)。
*   **Continuous SDD**：涵蓋 `SPEC`、`ADR`、`SA`、`IMPL`、`UPDATE`、`AUDIT`、`DRIFT` 等機制，用於長期維護與校正。

ZeroSpec 的特點是純 Markdown、零依賴，且不綁定單一 AI 平台。

---

### ZeroSpec 的首次使用

首次導入 ZeroSpec，建立專案地圖分為三個步驟：
1.  **執行引導包 INIT-SCAN**：使用特定 Prompt 讓 AI 自行掃描專案目錄，輸出架構與邊界的草案。
2.  **人工 Review 填補認知落差**：開發者對 AI 產出的草案進行微調，糾正錯誤判斷並回答技術問題。
3.  **生成地圖 INIT-BUILD**：人工確認通過後，讓 AI 正式產生 `AGENTS.md` 與 `docs/README.md`，完成地圖建置。

此流程強調先讓 AI 證明其理解專案，確認沒有幻覺後，才正式生成檔案。

### 基礎文件：AGENTS.md 與 /docs/README.md

*   **`AGENTS.md`**：專為 AI 與協作者設計，提供專案地圖與提示入口，劃定可動與不可碰的邊界。
*   **`/docs/README.md`**：專為人類開發者設計，作為 SDD 文件導覽目錄，並內建決策矩陣供 AI 於任務結束時自動評估。

### 進階自動化：Agent-Skill 整合

ZeroSpec 可選用附掛 Skill，實現 Router 對話觸發：
*   **專案級同步 (Local)**：隨 Git 發布，VS Code Copilot 等工具可直接讀取專案內技能。
*   **個人全域 (Global)**：一次安裝，支援 Claude Code、Codex CLI 等工具，所有專案皆可使用。

---

### 新功能開發流程

每次新功能開發，都應從讀取 `AGENTS.md` 開始，確認 SPEC 後再進行實作。流程包括：讀 `AGENTS.md` → 判斷 `SPEC` → Agent 實作 → 測試驗證 → Review & Touch。

### 長期維護機制：UPDATE / AUDIT / DRIFT

ZeroSpec 提供事件驅動、持續校正的維護機制，以避免專案地圖淪為一次性遺蹟。透過 `UPDATE`、`AUDIT`、`DRIFT` 等機制，藉由 AI 自動觸發訊號或手動執行 Prompt，保持專案地圖與實際狀態同步，防止文件過期。

---

### Takeaway 與適用場景

Corey 總結道，SDD 的第一步是確保上下文可被理解；AI 寫程式不穩，往往是因為專案地圖不完整，而非模型本身問題。ZeroSpec 提供一個最小的起點，僅需基礎文件即可自主運作，並能漸進銜接 OpenSpec / Spec Kit 等更上層的框架。

ZeroSpec 適用於團隊人數 ≥ 2、專案需長期維護、架構規則開始分散的情境，不適用於一次性 POC 或短期腳本。

### INIT-SCAN 完整輸出結構

INIT-SCAN 的輸出包含以下章節，旨在全面描述專案現狀與建議：
*   §1 專案現狀摘要
*   §2 技術棧萃取
*   §3 核心模組與邊界
*   §4 B-class 草稿（Docs navigation, Domain-to-Code Map, Architecture layers）
*   §5 最需規格化的優先項
*   §6 建議最小 SDD 文件集
*   §7 開放問題（需人工確認的判斷）

### AI Coding Agent 對照

ZeroSpec 的設計考量了與多種 AI Coding Agent 的互動方式，例如：
*   GitHub Copilot (VS Code Agent)：透過 `@AGENTS.md` 或 Local Skill (`.agents/`)
*   Claude Code (CLI agent)：透過 `@AGENTS.md` 或 Global Skill (`~/.claude/`)
*   Cursor (Agent / Composer)：透過 `@AGENTS.md` 或視需求手動貼 prompts/
*   Codex (CLI / desktop agent)：透過 `@AGENTS.md` 或 Global Skill (`$HOME/.agents/`)

### AGENTS.md 長度考量

ZeroSpec 建議將 `AGENTS.md` 維持在 150–300 行（約 2K–4K tokens）的長度。過長會擠壓任務上下文，過細則可能讓 Agent 抓不到重點。溢位內容應移至 `docs/` 子檔案，再透過導航表引用，目標是給予 AI 剛好夠用的專案地圖，而非塞入所有資訊。

## 延伸資源

-   ZeroSpec GitHub 專案：[github.com/corey924/ZeroSpec](https://github.com/corey924/ZeroSpec)
-   Corey 的相關部落格文章：[coreynote.life/posts/2026/04/zerospec](https://coreynote.life/posts/2026/04/zerospec)

本文由 AI + Claude 3.5 Sonnet 協助整理