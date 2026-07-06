# 蘋果會拋棄你的舊筆電，但 OpenCore 不會

- 分享者：Andy
- [投影片：蘋果會拋棄你的舊筆電，但 OpenCore 不會](蘋果會拋棄你的舊筆電，但 OpenCore 不會.pptx)

## 活動簡介

本次活動旨在探討如何透過 OpenCore Legacy Patcher 讓較舊的 Mac 機型也能夠安裝與運行較新版本的 macOS。在 Apple 停止對舊款硬體提供軟體支援時，OpenCore 提供了另一種選擇，讓使用者能夠延長設備的使用壽命，並持續享受最新的作業系統功能。

## OpenCore Legacy Patcher 介紹與安裝教學

本次分享由 Andy 主講，主要介紹了 OpenCore Legacy Patcher 的概念、用途以及詳細的安裝步驟。

### 為什麼需要 OpenCore？

許多使用者可能會遇到 Apple 官方不再支援特定舊款 Mac 機型的作業系統更新，導致無法安裝新版 macOS。這意味著使用者可能無法獲得新功能、安全更新，甚至無法安裝支援新版 macOS 的應用程式。OpenCore Legacy Patcher 便是為了解決這個問題而生，它能夠幫助在不被官方支援的 Mac 硬體上安裝較新的 macOS 版本。

### OpenCore Legacy Patcher 的功能與流程

活動中，Andy 逐步演示了 OpenCore Legacy Patcher 的主要功能，包括：

*   **建立 macOS 安裝程式**：
    *   選擇要安裝的 macOS 版本，例如 macOS Monterey, Ventura, Sonoma, Sequoia。
    *   下載選定的 macOS 安裝程式。
    *   將 macOS 安裝程式製作到 USB 隨身碟或目標硬碟。
*   **安裝 OpenCore**：
    *   在目標磁碟上安裝 OpenCore。
    *   此過程包括掛載分割區、移除舊的 OpenCore 或系統資料夾、複製 OpenCore 到 EFI 分割區、新增 SSD 圖標、清理安裝位置以及卸載 EFI 分割區等步驟。
    *   展示了安裝過程中可能遇到的確認步驟，例如格式化 USB 隨身碟。
*   **Post-Install Root Patch**：
    *   在 macOS 安裝完成後，需要透過 Post-Install Root Patch 來安裝硬體驅動程式和修補程式，以確保系統的穩定運行。

### 相關資源

活動中提供了以下重要資源連結，供參與者進一步學習和操作：

*   OpenCore Legacy Patcher 專案主頁：[https://dortania.github.io/OpenCore-Legacy-Patcher/](https://dortania.github.io/OpenCore-Legacy-Patcher/)
*   OpenCore Legacy Patcher 的 Release 頁面：[https://github.com/dortania/OpenCore-Legacy-Patcher/releases](https://github.com/dortania/OpenCore-Legacy-Patcher/releases)
*   關於開機與 macOS 的說明：[https://dortania.github.io/OpenCore-Legacy-Patcher/BOOT.html](https://dortania.github.io/OpenCore-Legacy-Patcher/BOOT.html)
*   關於無 USB 隨身碟開機的說明：[https://dortania.github.io/OpenCore-Legacy-Patcher/POST-INSTALL.html](https://dortania.github.io/OpenCore-Legacy-Patcher/POST-INSTALL.html)

---

這次活動的內容涵蓋了讓舊款 Mac 重新煥發活力的實用技術，相信能幫助許多面臨設備更新瓶頸的開發者。

本文由 AI + Gemini 2.5 Flash 協助整理