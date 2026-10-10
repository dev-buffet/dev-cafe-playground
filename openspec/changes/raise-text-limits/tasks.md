## 1. 實作

- [x] 1.1 備份 `scripts/generate_summary.js`（依全域規則存到 `~/.claude/backups/docs/`）
- [x] 1.2 在 `INLINE_BUDGET_BYTES` 旁新增常數 `TEXT_FILE_CHAR_LIMIT = 20000`、`TEXT_TOTAL_CHAR_LIMIT = 100000`（design D2）
- [x] 1.3 改寫 `buildRequestParts` 的文字處理段：可讀長度 = min(單檔上限, 剩餘額度)；剩餘額度為 0 時跳過並 log；長度被縮短時附截斷標記並 log 檔名（design D3）
- [x] 1.4 log 訊息改用常數，移除寫死的 5000／30000

## 2. 驗證（本機，不呼叫真正的 Gemini）

- [x] 2.1 在 scratchpad 建假活動目錄，對應 spec 四個文字情境：6739 字單檔、25000 字單檔、6 份各 20000 字、95000 字＋12000 字
- [x] 2.2 以假的 `GEMINI_API_KEY` 對每個假目錄執行腳本，確認 API 呼叫前的 log 符合各情境預期（截斷／跳過訊息、檔名正確）
- [x] 2.3 對真實的 `202601/` 執行，確認 `Slides.md` 不再出現截斷 log
- [x] 2.4 `node --check scripts/generate_summary.js` 通過

## 3. 文件

- [x] 3.1 更新 `AGENTS.md`「README 自動生成管線」一節的上限數字（5000／30000 → 20000／100000）
- [x] 3.2 交由 fresh-context subagent 對照 spec 做最終驗收
