# ZeroSpec：輔助 SDD 的 Layer 0 方法庫
- 分享者：Corey（種子）
- [投影片：ZeroSpec：輔助 SDD 的 Layer 0 方法庫（Corey）](https://coreynote.life/Slide-Html/Zerospec-Talk/index.html)

> **關於本目錄的 `index.html`**：這份檔案是為了讓 AI 自動生成活動紀錄的管線讀取內容而放入 repo，並非供閱讀的版本——在 GitHub 上只會顯示原始碼，也缺少投影片所需的樣式與腳本，無法正確呈現。請以上方的原始投影片網址觀看完整內容。

## 活動簡介
本次分享由 Corey（種子）帶來關於 ZeroSpec 方法庫的介紹。ZeroSpec 是一套專為生成式 AI 協作開發設計的 Layer 0 方法庫，核心目標是幫助開發者在 AI Agent 動手實作前，有系統地將專案的架構規則、模組導覽與核心事實來源（Source of Truth）整理到位，確保 AI 能夠正確理解專案上下文，從而提升協作效率與程式碼品質。有別於其他 Layer 1 框架，ZeroSpec 著重於建立基礎的「上下文就緒度」（Context Readiness），解決團隊在面對既有程式碼負擔、多人開發習慣不一及技術文件漂移等常見痛點。

## 前言：AI 協作開發的基石
Corey 指出，ZeroSpec 並非一個 AI 工具本身，而是將多年來在 GenAI 協作開發中，如何有效整理專案以讓 Agent 看懂的習慣，歸納成一套可重複使用的方法庫。這套方法旨在解決 AI 實作前，專案上下文不清導致的問題。

### SDD 與 Plan Model 複習
分享中首先回顧了「規格驅動開發」（Spec-Driven Development, SDD）的核心精神。SDD 並非單純將需求丟給 AI 處理，而是先將需求、規則與設計判斷規格化，形成可討論與追蹤的依據，再進入實作階段。這其中，最小操作單位是「Plan Model」，包含三個步驟：**Plan**（釐清目標與限制）、**Execute**（AI 或工程師實作）、**Review**（測試、檢閱與文件同步），確保實作符合計畫。

### ZeroSpec 與 Layer 1 框架的定位
Corey 澄清 ZeroSpec 並非如 OpenSpec 或 Spec Kit 等 Layer 1 框架的簡化版。Layer 1 框架假設 AI 已讀懂專案，專注於從需求到實作的完整流程；而 ZeroSpec 則位於這些框架之前，作為提供穩固上下文基線的 Layer 0 方法庫。
他簡要比較了 OpenSpec 與 Spec Kit 的差異：
*   **OpenSpec**：由 Fission-AI 開源，Node.js CLI，強調流動式迭代風格，適合在既有專案上漸進式加功能。
*   **Spec Kit**：由 GitHub 開源，Python CLI，強調階段門控，以範本和治理模式約束 AI 輸出，適合從零開始或需嚴格治理的專案。
ZeroSpec 的角色，是在這些 Layer 1 工具能夠高效運作前，就先把專案的「地圖」準備好。

---

## 真實開發團隊面臨的挑戰
在導入 AI 協作開發時，團隊常會遇到以下痛點，導致 AI 效能不彰：
*   **既有程式碼的歷史包袱**：舊程式碼可能存在著與現行規則不符的寫法，AI 在學習時很容易將這些「壞習慣」一併模仿。研究顯示，AI 學習充滿安全漏洞的程式碼後，甚至可能在其他情境中產生「黑化」的建議，證明程式碼品質對 AI 行為的深遠影響。
*   **多人開發習慣不同步**：命名、分層、測試策略等不一致，以及「不能踩的線」只存在於少數人心中，讓新人與 AI 難以適從。
*   **技術文件難以維護**：文件內容過長、規則分散在各處（Issue、PR、聊天紀錄），導致 API 與文件逐漸不同步，失去參考價值。

這些問題導致開發者在使用 AI 工具時，常感到 AI 答案「幾乎對，但不完全對」，甚至有資深開發者指出在特定情境下使用 AI 工具反而拖慢了開發速度。這些都再再強調了「上下文品質」在 AI 協作中的關鍵地位。

---

## ZeroSpec 方法庫核心概念
ZeroSpec 是一套輕量級、無平台綁定、零依賴的 Layer 0 方法庫，以純 Markdown 檔案形式運作。其核心是將個人在 GenAI 協作開發中反覆驗證有效的習慣整理成標準流程。

### ZeroSpec 的運作模式
1.  **先看地圖**：在動手前，先確認專案的架構、模組與文件依據。
2.  **先講邊界**：明確指出哪些地方可以修改，哪些不能動，以及需要同步更新的範圍。
3.  **反覆驗證**：透過更換模型、執行測試與程式碼審查，確保 AI 產出的結果符合預期。

### ZeroSpec 關鍵內容與檔案結構
ZeroSpec 包含以下核心檔案與流程：
*   **核心檔案（Core files）**：`AGENTS.md`（為 AI 與協作者設計的專案地圖與提示入口）與 `docs/README.md`（為人類開發者設計的 SDD 文件導覽目錄，內建決策矩陣）。這兩份文件劃定專案邊界，明確指出哪些可動、哪些不可動。
*   **引導包（Bootstrap）**：用於首次建置專案地圖，包含 `INIT-SCAN`（讓 AI 掃描專案目錄並輸出草案）和 `INIT-BUILD`（人工確認後，讓 AI 正式產生地圖檔案）。
*   **持續 SDD（Continuous SDD）**：支援長期維護與疊代，包含 `SPEC / ADR / SA / IMPL`（新功能開發流程）與 `UPDATE / AUDIT / DRIFT`（長期維護校正機制）。

---

## ZeroSpec 的導入與應用

### 首次使用流程
ZeroSpec 的首次導入分為三個步驟，強調先讓人確認 AI 的理解能力：
1.  **執行引導包 INIT-SCAN**：使用特定 Prompt 指導 AI 掃描專案目錄，產出架構與邊界的草案。
2.  **人工 Review 填補認知落差**：開發者快速調整 AI 產出的草案，修正錯誤判斷並回答技術問題。
3.  **生成地圖 INIT-BUILD**：在人工確認草案無誤後，讓 AI 正式產生 `AGENTS.md` 與 `docs/README.md`。

### 進階自動化：Agent-Skill 整合（選用）
ZeroSpec 支援透過附掛 Skill 來整合 Agent，實現對話觸發的自動化功能：
*   **專案級同步（Local）**：透過 `.agents/skills/` 目錄，VS Code Copilot 等工具可直接讀取專案內的技能。
*   **個人全域（Global）**：支援 Claude Code、Codex CLI 等工具，透過腳本快速掛載至 `~/.claude/skills/` 或 `$HOME/.agents/skills/`。

### 新功能開發流程
每次開發新功能時，應從閱讀 `AGENTS.md` 開始，確認規格（SPEC）後再進行 Agent 實作，接著透過測試與 Review 驗證成果。

### 長期維護：UPDATE / AUDIT / DRIFT
ZeroSpec 提倡事件驅動的持續校正機制，透過 AI 自動觸發訊號或手動執行 Prompt，確保專案地圖與實際專案狀態同步，避免文件過期。

---

## 總結與適用情境
Corey 強調，SDD 的第一步是確保上下文可被理解；AI 寫程式不穩定，往往是專案地圖不完整所致，而非單純模型效能問題。
ZeroSpec 作為最小起點，可獨立運作，也能漸進銜接 OpenSpec / Spec Kit 等 Layer 1 框架。
建議在以下情境導入 ZeroSpec：
*   團隊人數 ≥ 2 人。
*   專案需長期維護。
*   專案架構與規則已開始分散。
一次性概念驗證（POC）或短期腳本專案則較不適用。

最後，分享中也展示了 `INIT-SCAN` 的完整輸出結構，其包含專案現狀摘要、技術棧萃取、核心模組與邊界、文件草稿、最需規格化的優先項、最小 SDD 文件集及開放問題等。並列舉了 ZeroSpec 與 GitHub Copilot、Claude Code 等主流 AI Coding Agent 的互動方式。他特別提醒，`AGENTS.md` 不宜過長，建議維持在 150-300 行（約 2K-4K tokens），以避免擠壓 AI 任務上下文，並將細節移至 `docs/` 子檔案。

---

## 延伸資源
*   [ZeroSpec GitHub Repository](https://github.com/corey924/ZeroSpec)
*   [Corey's Blog Post on ZeroSpec](https://coreynote.life/posts/2026/04/zerospec)

本文由 AI + Claude Code 協助整理