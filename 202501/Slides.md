---
title: 抽屜裡的舊硬碟復活了！用 Unraid 輕鬆駕馭 NAS

---


## 抽屜裡的舊硬碟復活了！

## 用 Unraid 輕鬆駕馭 NAS

#### 章魚燒

---

### 🌐 雲端硬碟？
vs
### 🗄️ NAS？

---

### NAS 簡介

- NAS 全名 Network Attached Storage（網路附接儲存）
- 一種連接到網路的儲存設備
- 提供**檔案級別的資料存取服務**給網路上的使用者和設備

----

![ChatGPT Image 2026年1月9日 下午05_34_57](https://hackmd.io/_uploads/S1cehBAV-x.png)

----

| Pros                 | Cons       |
| -------------------- | ---------- |
| 資料不依附單一主機，存取彈性高 | 初期建置成本較高   |
| 有備份機制，提升資料安全性 | 需自行維護與管理   |
| 隱私性高            | 資安風險    |
| 內網傳輸快            | 硬體故障需自行處理  |
| 容量可依需求彈性擴充           | 學習門檻較高     |
| 可整合多種服務 (相簿 etc.)   | 異地備援需額外規劃  |

Note:
    * 多種服務包含相簿、影音串流、私有雲、Docker 等
    

---

### NAS 成本考量

<span> 簡單來說 <!-- .element: class="fragment" data-fragment-index="1" --></span> 
<span> 🤑🤑🤑 <!-- .element: class="fragment" data-fragment-index="2" --></span>

----

1. NAS 主機 (品牌 NAS) / 自組 / PC / Mac mini
2. 硬碟
3. 不斷電系統
4. 存放空間
5. 耗電量

Note:

4. 存放空間 
    - 隔音機殼 : 降低磁碟頭運轉時噪音、減少灰塵進入 
    - 隔震墊 : HDD 運轉時會有些許振動，避免硬碟開趴太大力，損壞率🆙
5. 耗電量估算 : 主機 cpu ram 本身功耗 + 硬碟功耗

cpu : x86(效能好，較耗電), arm (省電，但在 Docker 有些 image 不支援)

----

##### 2026/01/09 原價屋報價

![SCR-20260109-qpdc](https://hackmd.io/_uploads/Sy5feDREZg.jpg)

---

### 上述都考慮完還是很想要組 NAS

<span>來考慮 NAS 系統唄<!-- .element: class="fragment" data-fragment-index="1" --></span>

---

### 常見自組 OS 

- DSM
- TrueNAS
- OpenMediaVault
- <span><!-- .element: class="fragment highlight-red" -->Unraid</span>
- 飛牛 fnOS
- etc.

Note:

- DSM aka Xpenology 內建軟體(Photos) 會不能用
- TrueNAS (前身 FreeNAS) (若使用 docker 的話，他是使用 k3s，操作方式對 docker 小白會非常難操作；若有很大的 RAM，可以透過 ZFS Cache 可達到高速讀取)
- Unraid 付費

----

Take a look at 
DSM 

{%preview https://demo.synology.com/zh-tw/dsm %}

----

TrueNAS -> For more technical users

{%preview https://www.truenas.com/ %}

HexOS -> For typical users

{%preview https://hexos.com/ %}

----

Unraid

{%preview https://unraid.net/ %}


![SCR-20260127-lfno](https://hackmd.io/_uploads/B1fXkpBLbg.jpg)


---

## Why 付費買 Unraid?

* <span>1. 方便使用套件<!-- .element: class="fragment" data-fragment-index="1" --></span> 
<span>2. OS 維護性好<!-- .element: class="fragment" data-fragment-index="1" --></span> 
<span>3. 論壇資源多<!-- .element: class="fragment" data-fragment-index="1" --></span>
<span>4. 介面好看直觀<!-- .element: class="fragment" data-fragment-index="1" --></span>
<span>5. 個人對 Docker 依賴性高<!-- .element: class="fragment" data-fragment-index="1" --></span>

Note:

隱藏條件

當時 Lime Technology, Inc. 準備要將 Unraid OS 調整收費方式

https://www.ptt.cc/bbs/Storage_Zone/M.1708512786.A.B2C.html

趕在調整收費前購買

---

### 使用 Unraid

1. 準備 USB
2. 寫入 USB -> BIOS 開機選單調整 (虛擬化技術記得要開)
3. 準備磁碟分區
    - Array
        - Parity 校驗碟
        - Data 資料碟
    - Pool
        - Cache 快取

----

##### 官方給的建議

- [color=#08a6e0] Parity 要是最大容量的碟
- [color=#009e59] Data Disk 容量 ≤ Parity Disk
- [color=#8ab7c7] SSD、NVMe 放 Cache
- [color=#faf4d1] Cache 最好有多個磁碟，有備份機制

---

### 目前 NAS Spec

- 二手 MSI ZH77A-G43 + i5 3570 + 32 GiB DDR3
- WD Red Plus NAS 硬碟 (3.5 吋) - 8 TB ＊ 2
- 二手 WD Red™ SA500 NAS SATA SSD - 500GB ＊ 3
- ~~舊零件 Seagate 500GB HDD~~ 掛ㄌ 
- 舊零件 Kingston V300系列 120G
- LEADEX III Platinum 750W (白金轉換效率)
- Fractal Design Define 7 (超級重但硬碟槽超多)![image](https://hackmd.io/_uploads/S19onpHIZx.png)

Note: 

SA500 NAS SATA SSD 組 Cache Pool
Define 7 (超級重但硬碟槽超多)，整體做工很好，但缺點是不像是 NAS 主機可以很方便進行硬碟抽換

----

![SCR-20260127-mdbh](https://hackmd.io/_uploads/SJF_R6B8Zl.png)


---

### 🤯 遇到問題

1. syslog 關機後找不到
2. WebUI 有時會 Crash 連不到
3. Docker Volume 沒管理好，docker.img 容量大
    - 不能用在 Cache Pool
4. (Plugin) Docker Compose 介面很奇怪
5. (Plugin) Nvidia 顯示卡在預設情況下會在 P0 State，耗電量較高，需設定切換成 P8

[Nvidia State Docs](https://docs.nvidia.com/gameworks/content/gameworkslibrary/coresdk/nvapi/group__gpupstate.html)

Note:

Unraid 相較 raid 寫入較慢

----

<div style="background-color: #8a8251; width: 300px;margin: 0 auto; border-radius: 40px;">
<h3>Before</h3>
    
</div>

<!-- .slide: data-background="https://hackmd.io/_uploads/rkkW3KAVbl.png" -->


----

<div style="background-color: #8a8251; width: 300px;margin: 0 auto; border-radius: 40px;">
<h3>After</h3>
    
</div>

<!-- .slide: data-background="https://hackmd.io/_uploads/SJCz3YRNZx.png" -->

---

### 使用的服務

1. [Nextcloud](https://nextcloud.com/)
2. [Immich](https://immich.app/)
3. [Plex](https://www.plex.tv/)
4. [Calibre](https://github.com/kovidgoyal/calibre)
5. [Nginx](https://nginxproxymanager.com/)
6. [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) (Tailscale)
7. 電商歷史價格 DB
8. [Home Assistant](https://www.home-assistant.io/) (調整中)

----

若有服務對外，網路防火牆要設定好，會被一直踹

![SCR-20260127-metq](https://hackmd.io/_uploads/SkLFJASLWe.png)

----

### Immich 

特別喜歡 可以自動根據 Wifi 調整 URL 連線

| 自動 URL 切換 | LAN | WAN |
| -------- | -------- | -------- | 
| ![Screenshot_20260127-134811](https://hackmd.io/_uploads/r11OMCSLZx.jpg)     | ![Screenshot_20260127-134743](https://hackmd.io/_uploads/ryluGCS8be.jpg)     | ![Screenshot_20260127-135947](https://hackmd.io/_uploads/S1p1HAH8Zl.jpg)
 |


----

### 網路架構改進

若使用的軟體沒有自動根據 Wifi 調整連線方式

可以透過 Split DNS or Hairpin NAT(需有固定 IP)



---

### Resource

- {%preview https://www.youtube.com/c/SpaceinvaderOne %}
- {%preview https://www.youtube.com/@SpotoTsui %}
- {%preview https://ivonblog.com/ %}

