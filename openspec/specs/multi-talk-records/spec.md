# multi-talk-records

## Purpose

規範生成的活動紀錄對多講者、多份投影片活動的呈現要求——講者列名、多條投影片連結、投影片與講者/主題的對應方式，以及主題內容的分段。

## Requirements

### Requirement: 多講者列名
生成的活動 README SHALL 在基本資訊區列出所有講者；有多位講者時 SHALL 全數列出，MUST NOT 只保留其中一位。

#### Scenario: 兩位講者皆列名
- **WHEN** PR 描述或素材中出現兩位分享者（例：Brook 與 Alice 各分享一個主題）
- **THEN** 生成 README 的「分享者」行同時包含兩位名稱

#### Scenario: 單講者格式維持相容
- **WHEN** 活動只有一位講者、一份投影片
- **THEN** 生成格式與現行單講者 README 結構一致（`- 分享者：[名稱]`、單條投影片連結）

### Requirement: 多份投影片連結與對應標註
生成的活動 README SHALL 為目錄內每份投影片（含由 PPTX 轉出者，連結指向原始 `.pptx` 檔）各列一條連結；有多份時每條 SHALL 標註對應的講者或主題。

#### Scenario: 兩份投影片各自成行
- **WHEN** 活動目錄內含兩份投影片檔，分屬不同講者
- **THEN** 基本資訊區出現兩條投影片連結，各自標註講者或主題名稱

#### Scenario: PPTX 連結指向原始檔
- **WHEN** 投影片素材為 `talk.pptx`（CI 轉為 PDF 僅供生成用）
- **THEN** README 中的投影片連結指向 `talk.pptx`，而非暫存 PDF

### Requirement: 投影片與講者的對應推斷
生成流程 SHALL 依下列優先序推斷投影片與講者的對應：PR 描述中的明確指派為權威來源；未指明時 SHALL 依投影片內容（如首頁的標題與作者）推斷；無法確定時 SHALL 僅列投影片標題、不標註講者，MUST NOT 虛構對應。

#### Scenario: PR 描述優先於推斷
- **WHEN** PR 描述寫明「deck-a.pdf 由 Alice 分享」而投影片首頁未標作者
- **THEN** README 將 deck-a.pdf 標註為 Alice

#### Scenario: 無法確定時不虛構
- **WHEN** PR 描述未指派且投影片內容無講者線索
- **THEN** 該條投影片連結僅含標題，不標註講者名稱

### Requirement: 主題內容依場次分段
一場活動含多個分享主題時，生成 README 的主題內容 SHALL 依講者或場次拆分為獨立段落（`## ` 標題），每段有實質說明文字。

#### Scenario: 雙主題活動分段呈現
- **WHEN** 活動含兩個不同主題的分享
- **THEN** README 主題內容區出現至少兩個 `## ` 段落，各自對應一個主題，內容不混雜
