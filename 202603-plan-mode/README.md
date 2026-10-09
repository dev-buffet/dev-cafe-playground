# 饅頭我不寫程式了：Plan Mode 是在 Plan 什麼？
- 分享者：Ray Yuan Liu
- [投影片：饅頭我不寫程式了：Plan Mode 是在 Plan 什麼？(Ray Yuan Liu)](Slides.pdf)

## 活動簡介
本次分享由 Ray Yuan Liu 帶來，深入探討了「Plan 模式」在 AI 應用中的核心概念與實踐。活動旨在超越對 AI 運作原理或大型語言模型（LLM）的基礎理解，聚焦於分享者如何實際應用 AI，並著重於 AI Agents 的規劃與設計策略，引導聽眾思考如何有效地與 AI 協同工作。

## The Basic
---
Ray Yuan Liu 首先從基礎概念切入，介紹了與 AI 互動相關的核心術語，如 Rules、Workflow、Skill 和 Subagent 等。他強調，無論 AI 技術如何演進，「Prompting」仍然是與模型溝通的最基本方式，將 AI 視為一個「Text Transformer Text」的過程。

講者進一步區分了 AI 互動中的「Context」概念，將其分為「靜態上下文 (Static Context)」與「動態上下文 (Dynamic Context)」。靜態上下文包含預設的規則、指令或工作流程，而動態上下文則涉及 AI 自行蒐集到的資訊以及「函數呼叫 (Function Calling)」等機制，這些都可以由 LLM 本身觸發。此外，分享中也提及 AI 的「Skills」本質上仍是一種提示（prompt），但其獨特之處在於可以被 AI Agent 所觸發，展現了 AI 應用的彈性與可能性。

---

## The News
---
接著，Ray Yuan Liu 將討論推進到 AI 互動的未來趨勢，特別是預測到 2026 年，我們將如何進行提示工程，並引入了「Harness Engineering」的概念。他引用了蘇黎世聯邦理工學院（ETH Zurich）關於 `AGENTS.md` 的研究，指出未來可能不再需要 `/init` 文件，轉而使用 `Lean Agent.md` 這類專案層級的上下文文件來優化程式編寫 Agent。

分享中也提到了南加州大學（University of Southern California）關於「專家角色 (Expert Personas)」的研究，指出雖然使用角色可以改善 LLM 的對齊性，但若非用於表達，則可能降低準確度，強調了角色設定的精確性。講者將 Harness Engineering 與 Martin Fowler 的《重構》思想相連結，暗示 AI 系統也需要像傳統軟體一樣，進行精心的架構設計與維護。

Harness Engineering 的核心要素包括「上下文工程 (Context Engineering)」、「架構約束 (Architectural Constraints)」和「垃圾回收 (Garbage Collection)」，這些都是為了有效管理 AI Agent 行為所必需的。最終，Ray Yuan Liu 闡明「Plan 模式」的本質即是為 AI Agent 建立一個完善的「Harness」框架，目標是讓 AI 的運作能處於「On the loop」的最佳狀態，而非僅是「Outside the loop」或「In the loop」，實現更智能、更高效的協作。

---

## The Spell
---
在最後一個環節，Ray Yuan Liu 以「Learning how to talk. Again.」作為總結，強調了在 AI 快速發展的時代，我們需要不斷學習如何有效地與 AI 溝通。這包括掌握不斷演進的提示技巧、Agent 互動策略，以及對 AI 系統設計的深刻理解，這是一個持續學習與探索的過程。

本文由 AI + Gemini 2.5 Flash 協助整理