# 2025 年 1 月月會 - 用 Unraid 輕鬆駕馭 NAS

## 月會主題

**抽屜裡的舊硬碟復活了！用 Unraid 輕鬆駕馭 NAS**

由 章魚燒 主講的一場完整的 NAS 建置與運維分享。

## 月會內容概要

### 🌐 NAS 是什麼？

[Slides.md](Slides.md) 首先介紹了 NAS（Network Attached Storage，網路附接儲存）的基本概念，這是一種連接到網路的儲存設備，能夠提供**檔案級別的資料存取服務**給網路上的使用者和設備。相比於單純的雲端硬碟，NAS 具有以下優勢：

**優點：**
- 資料不依附單一主機，存取彈性高
- 有備份機制，提升資料安全性
- 隱私性高，內網傳輸快
- 容量可依需求彈性擴充
- 可整合多種服務（相簿、影音串流、私有雲、Docker 等）

**缺點：**
- 初期建置成本較高
- 需自行維護與管理
- 存在資安風險
- 硬體故障需自行處理
- 學習門檻較高
- 異地備援需額外規劃

### 💰 成本考量

建置 NAS 需要考慮多個成本要素：
1. NAS 主機（品牌 NAS / 自組 / PC / Mac mini）
2. 硬碟
3. 不斷電系統
4. 存放空間（隔音機殼、隔震墊等）
5. 耗電量估算

### 🖥️ 常見自組 OS 選擇

市場上有多種 NAS 作業系統可選：
- DSM（Xpenology）
- TrueNAS（前身 FreeNAS）
- OpenMediaVault
- **Unraid**
- 飛牛 fnOS

### 為什麼選擇 Unraid？

講者分享了選擇 Unraid 的 5 個主要原因：
1. 方便使用套件
2. OS 維護性好
3. 論壇資源多
4. 介面好看直觀
5. 個人對 Docker 依賴性高

### 🔧 Unraid 設置流程

設置 Unraid 包含以下步驟：
1. 準備 USB 並寫入系統
2. BIOS 開機選單調整（虛擬化技術記得要開）
3. 準備磁碟分區：
   - **Array**：Parity 校驗碟 + Data 資料碟
   - **Pool**：Cache 快取磁碟

**官方建議：**
- Parity 要是最大容量的碟
- Data Disk 容量 ≤ Parity Disk
- SSD、NVMe 放 Cache
- Cache 最好有多個磁碟並具備備份機制

### 📊 實際部署硬體配置

講者分享的 NAS Spec：
- 二手 MSI ZH77A-G43 + i5 3570 + 32 GiB DDR3
- WD Red Plus NAS 硬碟（3.5 吋）- 8 TB × 2
- WD Red SA500 NAS SATA SSD - 500GB × 3
- Kingston V300 系列 - 120G
- LEADEX III Platinum 750W（白金轉換效率）
- Fractal Design Define 7 機殼

### ⚠️ 遇到的問題與解決方案

在使用過程中遭遇的挑戰：
1. syslog 關機後找不到
2. WebUI 有時會 Crash 連不到
3. Docker Volume 管理問題 - docker.img 容量大，不能用在 Cache Pool
4. Docker Compose 介面體驗不佳
5. Nvidia 顯示卡功耗優化 - 需設定從 P0 State 切換至 P8

### 🚀 實際應用服務

在 Unraid 中部署的服務包含：
1. **Nextcloud** - 私有雲檔案服務
2. **Immich** - 相片管理（支援自動根據 Wifi 調整連線 URL）
3. **Plex** - 影音串流服務
4. **Calibre** - 電子書管理
5. **Nginx Proxy Manager** - 反向代理
6. **Cloudflare Tunnel** - 安全外網連接（也可使用 Tailscale）
7. 電商歷史價格 DB - 自建資料庫
8. **Home Assistant** - 家庭自動化（調整中）

**重要提醒：** 若有服務對外公開，需設定好網路防火牆，避免被反覆攻擊。

### 🌍 網路架構最佳實踐

對於沒有自動連線切換功能的服務，可透過以下方式改進：
- **Split DNS** - 根據請求來源返回不同 IP
- **Hairpin NAT** - 需有固定 IP（適用於內網回存）

---

## 推薦資源

- [SpaceInvader One - YouTube](https://www.youtube.com/c/SpaceinvaderOne)
- [Spoto Tsui - YouTube](https://www.youtube.com/@SpotoTsui)
- [IvOn Blog](https://ivonblog.com/)
- [Unraid 官網](https://unraid.net/)
