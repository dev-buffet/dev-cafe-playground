# ZeroSpec：輔助 SDD 的 Layer 0 方法庫

- 分享者：Corey（種子）
- 分享者：測試講者
- 投影片：ZeroSpec（Corey）](https://coreynote.life/Slide-Html/Zerospec-Talk/index.html)
- 投影片：Docker 入門（測試講者）](https://example.com/docker-intro-slides)

> **關於本目錄的 `209901-test-html/index.html`**：這份檔案是為了讓 AI 自動生成活動紀錄的管線讀取內容而放入 repo，並非供閱讀的版本——在 GitHub 上只會顯示原始碼，也缺少投影片所需的樣式與腳本，無法正確呈現。請以上方的原始投影片網址觀看完整內容。

> **關於本目錄的 `209902-test-pdf/slides.pdf`**：這份檔案是為了讓 AI 自動生成活動紀錄的管線讀取內容而放入 repo，內容並不完整（只收錄前 3 頁）。請以上方的原始投影片網址觀看完整內容。

## 活動簡介

本次活動為測試目的，旨在驗證活動紀錄 README 中，投影片連結優先指向原始網址，並能為 HTML 格式及節錄版 PDF 加上適當的告知區塊。儘管是測試用途，活動內容仍包含了關於 ZeroSpec 的深度分享，探討如何利用 Layer 0 方法庫來輔助 SDD (Spec-Driven Development)，以及一場關於 Docker 入門的簡介。

---

## ZeroSpec：輔助 SDD 的 Layer 0 方法庫

### 為什麼需要 ZeroSpec？現存的開發痛點

Corey 在本次分享中，首先強調 ZeroSpec 並非一個 AI 工具，而是將其多年來在 GenAI 協作開發中的經驗，整理成一套可重複使用的方法庫。其核心理念是協助開發者在 Agent 能夠理解專案之前，先將專案整理就緒。分享者首先回顧了 SDD (Spec-Driven Development) 的精髓，它並非單純將規格丟給 AI，而是將需求、規則、設計判斷先行規格化，再交由 AI 或工程師實作。其中，「Plan model」是 SDD 的最小操作單位，包含 Plan (釐清目標與限制)、Execute (實作)、Review (驗證)。

Corey 進一步闡述 ZeroSpec 與 OpenSpec 或 Spec Kit 等 Layer 1 框架的不同，指出 ZeroSpec 是它們之「前」的上下文基線。他點出了真實開發團隊常遇到的困境：

*   **既有程式碼的歷史包袱**：舊有的、奇怪的寫法會讓 AI 模仿，甚至有研究指出 AI 會因學習不良程式碼而產生「黑化」行為，給出暴力或欺騙的建議。
*   **多人開發習慣不同步**：命名、分層、測試習慣不一致，新人和 AI 難以掌握團隊規範。
*   **技術文件難以維護**：文件過長、規則分散、與程式碼脫節，導致漂移。

這些問題導致了 AI 答案「幾乎對，但不完全對」的普遍挫折感，甚至可能降低資深開發者的效率。由於 GenAI 開發工具更新快速，若每次切換工具都需重建一套工作流，將耗費大量時間。因此，擁有一份不隨工具變化的專案地圖變得至關重要。

### ZeroSpec 的核心理念與內容

ZeroSpec 被定義為一套輔助 SDD 的 Layer 0 方法庫。它不是 runtime、平台工具或自動化工作流，而是在 AI Coding Agent 動手前，將架構規則、模組導覽、Source of Truth 放到 Agent 找得到的位置，提升「Context Readiness」。這套方法庫整理了 Corey 個人「先看地圖、先講邊界、反覆驗證」的開發習慣，並且採用純 Markdown、零依賴，不綁定單一 AI 平台。

ZeroSpec 的關鍵內容涵蓋三個部分：

*   **Core files**：主要包含 `AGENTS.md` (供 AI 和協作者使用，提供專案地圖與提示入口) 及 `/docs/README.md` (供人類開發者使用，作為 SDD 文件導覽目錄，並內建決策矩陣)。這些文件明確劃定邊界，讓 AI 和新人都能立即理解禁止項目。
*   **Bootstrap**：首次使用時，有三個引導步驟。首先是 `INIT-SCAN`，讓 AI 掃描專案目錄並輸出架構與邊界草案。接著是人工 Review，填補 AI 的認知落差。最後是 `INIT-BUILD`，經人工確認後，AI 正式產生 `AGENTS.md` 與 `/docs/README.md`。此流程強調先讓 AI 證明其理解能力，再落地產生文件，避免幻覺。
*   **Continuous SDD**：包含 `SPEC`、`ADR`、`SA`、`IMPL` 等持續實踐 SDD 的文件，以及 `UPDATE`、`AUDIT`、`DRIFT` 等長期維護機制，藉由 AI 自動觸發或手動執行，保持專案地圖與專案現狀同步，避免文件過期。

Corey 也提到了選用的「Agent-Skill 整合」機制，讓 ZeroSpec 能附掛 Skill，實現對話觸發，無論是專案級同步或個人全域安裝。對於新功能開發，流程也圍繞著 `AGENTS.md`，確認 `SPEC` 後再動手。

### 總結與適用場景

Corey 總結，SDD 的第一步是讓上下文可被理解，AI 寫程式不穩常是因為專案地圖不完整。ZeroSpec 是一個最小起點，只需基礎文件即可自主運作，也能漸進銜接 OpenSpec / Spec Kit。

ZeroSpec 適用於團隊人數 ≥ 2 人、專案需長期維護、架構規則開始分散的場景，而不適用於一次性 POC 或短期腳本。他也提供了 `INIT-SCAN` 的完整輸出結構，以及主流 AI Coding Agent 與 ZeroSpec 的互動方式對照表。最後強調 `AGENTS.md` 應保持在 150-300 行的建議長度，避免過長擠壓任務上下文，關鍵在於提供「剛好夠用的地圖」。

---

## Docker 入門

測試講者在本次活動中，為與會者帶來了 Docker 的入門介紹。此部分著重於 Docker 的基本概念、安裝與常用指令，旨在幫助初學者快速了解 Docker 在現代軟體開發與部署中的重要性與基本應用。

本文由 AI + Gemini 2.5 Flash 協助整理