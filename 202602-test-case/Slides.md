---
title: Claude Code 推薦使用方式
tags: AI, CLI, Developer Tools
slideOptions:
  theme: moon
---

# Claude Code 推薦使用方式

Dev Cafe 2026/02

---

## 什麼是 Claude Code？

- Anthropic 官方推出的 AI CLI 工具
- 直接在終端機操作，整合進開發流程
- 支援 VS Code、JetBrains 等 IDE 擴充套件
- 可以讀檔、寫檔、執行指令、搜尋程式碼

---

## 適合拿來做什麼？

- 理解陌生 codebase（「這個 function 在幹嘛？」）
- 實作功能、修 bug、寫測試
- Refactor 舊程式碼
- 撰寫 commit message / PR 描述
- 自動化重複性任務（像今天這個 README 生成工具）

---

## 推薦工作流程：Plan Mode

開始前先讓 Claude 規劃，而非直接改 code

```
/plan 幫我把這個 API 從 REST 改成 GraphQL
```

- 先讓 AI 探索 codebase、問清楚需求
- 產出計畫後確認再執行
- 減少「改到一半才發現方向錯了」的情況

---

## CLAUDE.md：給 AI 的說明書

在 repo 根目錄放 `CLAUDE.md`，讓 Claude 了解專案慣例

```markdown
# 專案規範

- 使用 TypeScript，避免 any
- 測試框架：Vitest
- commit 訊息格式：feat/fix/docs: 描述
- 不要自動新增 console.log
```

每次對話都會自動載入，不用重複說明

---

## 善用 Subagents

複雜任務可以拆給多個 agent 並行處理

- Explore agent：快速探索 codebase
- Plan agent：設計實作方案
- 主流程：整合結果、執行修改

適合大型 refactor 或需要跨多個檔案理解的任務

---

## 費用控制技巧

- 用 `/compact` 壓縮對話歷史，省 token
- 任務完成後開新對話（context 不要累積太長）
- 明確告訴 Claude 範圍：「只改這個 function，不要動其他地方」
- 善用 Plan mode 避免多餘的嘗試

---

## 實際踩過的坑

1. **不要讓 AI 一次改太多** → 小步驟、每步驟確認
2. **敏感檔案要加進 .gitignore** → `.env`、credentials
3. **Auto-approve 要小心** → 大動作還是確認比較好
4. **Context 太長會變笨** → 適時開新對話

---

## 總結

Claude Code 最適合作為「有能力但需要你掌舵」的工程師

- 你負責：方向、判斷、確認
- Claude 負責：探索、實作、細節

把它當成 pair programming 的對象，而不是全自動工具

---

# Q&A
