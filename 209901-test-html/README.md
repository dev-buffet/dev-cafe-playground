# ZeroSpec：輔助 SDD 的 Layer 0 方法庫
- 分享者：Corey（種子）
- [投影片：ZeroSpec：輔助 SDD 的 Layer 0 方法庫](https://coreynote.life/Slide-Html/Zerospec-Talk/index.html)

> **關於本目錄的 `index.html`**：這份檔案是為了讓 AI 自動生成活動紀錄的管線讀取內容而放入 repo，並非供閱讀的版本——在 GitHub 上只會顯示原始碼，也缺少投影片所需的樣式與腳本，無法正確呈現。請以上方的原始投影片網址觀看完整內容。

## 活動簡介
本次分享由 Corey（種子）主講，探討在生成式 AI (GenAI) 協作開發的浪潮下，如何有效地整理專案內容，讓 AI Agent 能夠「讀懂」專案。ZeroSpec 正是一套將這些良好習慣整理成可重複使用的方法庫，旨在解決在 AI 動手實作前，專案上下文與架構規則不夠明確的問題。本活動強調 ZeroSpec 並非 AI 工具本身，而是為 AI 協作提供穩固基線的 Layer 0 方法庫。

## 主題內容：ZeroSpec 的核心概念與實踐

### GenAI 協作開發的起點：專案上下文就緒
分享者首先指出，這幾年進行 GenAI 協作開發時，最關鍵的一步是如何確保專案能被 AI Agent 正確理解。ZeroSpec 就是為此而生，它不是一個 AI 工具，而是將個人經驗中能有效幫助 AI 理解專案的方法，整理成一套可重複使用的方法庫。

---

### 簡述 SDD 與 Plan Model
分享者帶大家回顧了「規格驅動開發 (Spec-Driven Development, SDD)」的核心精神：不是簡單地將規格丟給 AI，而是將需求、規則、設計判斷整理成可討論、可追蹤的規格，再由 AI 或工程師進行實作。

「Plan Model」是 SDD 的最小操作單位，包含：
-   **Plan**：明確定義要做什麼、不能觸犯的規則。
-   **Execute**：AI 或工程師依照計畫進行實作。
-   **Review**：透過測試、程式碼審查和文件同步，確保實作不偏離計畫。

---

### ZeroSpec 與 Layer 1 框架的差異
ZeroSpec 並非 OpenSpec 或 Spec Kit 等 Layer 1 框架的簡化版。Layer 1 框架通常假設 AI 已經讀懂專案，並協助完成從規格到實作的流程。

-   **OpenSpec (Fission-AI 開源)**：Node.js CLI 工具，一次性產出 change folder，Artifacts 之間是 DAG 結構，迭代風格較為 Fluid，適合既有專案漸進加功能。
-   **Spec Kit (GitHub 官方開源)**：Python CLI 工具，線性推進 `specify → plan → tasks → implement`，每階段有驗證關卡，迭代風格 Phase-gated，適合從零建置或需要嚴格治理的專案。

ZeroSpec 則定位為 Layer 0 方法庫，提供它們之前的「上下文基線」，確保 AI 動手前，專案的架構規則、模組導覽、Source of Truth 都能被找到並理解。

---

### 真實開發團隊常遇到的痛點
講者點出了在 GenAI 協作開發中，團隊常面臨的三大挑戰：
1.  **既有程式碼的歷史包袱**：老舊或奇怪的寫法會讓 AI 模仿，甚至有研究指出 AI 在接觸大量有安全漏洞的程式碼後，行為會「黑化」，產生不良建議。真實專案中的過渡期寫法若無明確標註，AI 可能將其視為範本。
2.  **多人開發習慣不同步**：命名、分層、測試習慣不一致，導致新人或 AI 難以掌握「不能踩的線」，只能靠猜測。
3.  **技術文件難以維護**：文件過長、規則分散在各處，導致 API 和文件逐漸不同步。

這些問題的共同點是「上下文品質」不佳，即使 AI 工具快速更新，若專案本身沒有一份清晰的地圖，開發者會把時間花在追蹤 workflow，而非累積穩定的協作方式。

---

### ZeroSpec：Layer 0 的上下文就緒方法庫
ZeroSpec 是一套輔助執行 SDD 的 Layer 0 方法庫。它不是執行環境、平台工具或自動化 workflow。其核心目的在於 AI Coding Agent 動手前，將架構規則、模組導覽、Source of Truth 放置在 Agent 容易找到的位置，確保 **Context Readiness (上下文就緒)**。

這套方法庫整理了講者多年 GenAI 協作開發中反覆有效的習慣：
-   **先看地圖**：動手前確認架構、模組、文件依據。
-   **先講邊界**：明確區分能改、不能改、需同步的地方。
-   **反覆驗證**：透過換模型、跑測試、做 review，確認結果不偏離。

---

### ZeroSpec 的關鍵內容與實踐
ZeroSpec 主要包含以下核心文件與流程，純 Markdown、零依賴、不綁定單一 AI 平台：
-   **Core files**：`AGENTS.md` (為 AI 與協作者設計的專案地圖)、`docs/README.md` (為人類開發者設計的 SDD 文件導覽目錄)。這些文件劃定邊界，讓 AI 與新人都能直接看到禁止項目。
-   **Bootstrap (首次使用)**：
    1.  **INIT-SCAN**：使用引導 Prompt 讓 AI 掃描專案目錄，生成架構與邊界草案。
    2.  **人工 Review**：人工微調草案，糾正 AI 判斷錯誤之處。
    3.  **INIT-BUILD**：人工確認後，讓 AI 正式產生 `AGENTS.md` 與 `docs/README.md`。
-   **Continuous SDD (長期維護)**：包含 `SPEC` / `ADR` / `SA` / `IMPL`、以及 `UPDATE` / `AUDIT` / `DRIFT` 等機制，透過 AI 自動觸發或手動執行 Prompt，持續校正地圖，避免文件過期。

ZeroSpec 也支援進階的 Agent-Skill 整合，可將技能掛載至 `.agents/skills/` (專案級) 或 `~/.claude/skills/` (個人全域)，實現對話觸發自動化。

---

### Takeaway 與適用場景
講者強調，SDD 的第一步是確保上下文可被理解。AI 寫程式不穩，往往是專案地圖不完整所致，而不僅僅是模型本身的問題。

ZeroSpec 提供了一個最小的起點：基礎文件即可自主運作，並能漸進銜接 OpenSpec / Spec Kit 等更上層的框架。

建議導入時機：團隊成員 ≥ 2 人、專案需長期維護、架構規則開始分散時。一次性 POC 或短期腳本則不適用。

講者最後也分享了 `INIT-SCAN` 的完整輸出結構，以及針對不同 AI Coding Agent (如 GitHub Copilot, Claude Code, Cursor, Codex) 與 `AGENTS.md` 及 Skill 的互動方式。同時提醒，`AGENTS.md` 應維持在 150-300 行，避免過長擠壓任務上下文或讓 Agent 抓不到重點。

## 延伸資源
-   GitHub: [github.com/corey924/ZeroSpec](https://github.com/corey924/ZeroSpec)
-   Blog: [coreynote.life/posts/2026/04/zerospec](https://coreynote.life/posts/2026/04/zerospec)

本文由 AI + Gemini 2.5 Flash 協助整理