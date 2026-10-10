## Context

`scripts/generate_summary.js` 的 `buildRequestParts` 依掃描順序逐一讀取文字檔：單檔超過 5000 字截斷；讀取前若累計已達 30000 字則整份跳過。這個判斷在「加入前」做，所以最後一份檔案可能讓總量超過上限。數字直接寫死在判斷式與 log 字串裡。

文字素材另有 14MB 請求預算（`INLINE_BUDGET_BYTES`），由 `enforceBudget` 依優先序捨棄；本變更不動這段。

## Goals / Non-Goals

**Goals:**
- 單檔上限提高到 20000 字、總量上限提高到 100000 字。
- 總量變成硬上限：任何情況下文字總量都不超過 100000 字。
- 剩餘額度不足時截斷到剩餘額度，避免整份跳過。
- 上限集中成具名常數。

**Non-Goals:**
- 不做多講者之間的平均分配（評估過，見 Decisions）。
- 不改 PDF／PPTX／圖片的處理與 14MB 預算。
- 不改 CI workflow、模型、prompt。

## Decisions

**D1：只提高上限，不做平均分配。**
現有講稿每份約 4000–7000 字，100000 字足以容納十位講者各 10000 字。平均分配要改成兩階段讀取，複雜度較高，在這個量級下效益不明顯。代價是「先到先得」仍存在，只是門檻提高到 100000 字。

**D2：常數命名 `TEXT_FILE_CHAR_LIMIT`、`TEXT_TOTAL_CHAR_LIMIT`，放在現有 `INLINE_BUDGET_BYTES` 旁邊。**
與既有預算常數集中管理，log 訊息改用 template literal 引用常數。

**D3：截斷順序為「先單檔上限，再剩餘額度」。**
單份檔案的可讀長度 = min(單檔上限, 剩餘額度)。剩餘額度為 0 時跳過並 log；長度被縮短時附截斷標記並 log。截斷標記本身不計入字數上限，避免為了幾個字元把邏輯變複雜（標記約 15 字，對總量影響可忽略）。

**D4：字數沿用 JavaScript `string.length`（UTF-16 code unit）。**
與現有行為一致。中文字元多為 1 個 code unit，對這個 repo 的素材誤差可忽略。

## Risks / Trade-offs

- [輸入 token 增加使費用與延遲上升] → 以現有素材量估計影響很小；最新價格未查證，合併前可在 PR 中補一次查證。
- [多講者講稿總量超過 100000 字時，排在後面的講者仍會被截斷或跳過] → 有 log 可追蹤；若實際發生，再評估平均分配方案。
- [單元測試不存在，`buildRequestParts` 沒有匯出] → 用本機假目錄執行腳本、觀察 log 驗證，或為驗證暫時匯出函式（見 tasks）。

## Migration Plan

純腳本變更，合併後下一次 CI 生效。已存在的活動 README 不會被覆蓋；`202601/README.md` 維持現狀，不重新生成。回滾：revert 該 commit。

## Open Questions

（無）已決議：`202601/README.md` 不重新生成（維護者 2026-10-10 確認）。
