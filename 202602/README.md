# 蘋果會拋棄你的舊筆電，但 OpenCore 不會

- 分享者：戴維廷 / Andy
- [投影片](Slides.md)

## 活動簡介

隨著科技的進步，蘋果（Apple）通常會在新款 macOS 發布後，逐漸停止對較舊款 Mac 筆電的官方支援。這意味著即使硬體效能依然足以應付日常任務，但使用者卻無法安裝最新的作業系統，進而限制了軟體使用的便利性及安全性更新。本次分享將深入探討如何利用 OpenCore Legacy Patcher (OCLP) 這款強大的工具，為那些被官方「拋棄」的舊款 Mac 筆電（例如 2012-2017 年的 MacBook Pro / Air）注入新的生命，讓它們能夠成功運行最新的 macOS 系統。

本次分享將涵蓋 OCLP 的基本介紹，包括如何下載所需的作業系統版本、製作可開機的安裝隨身碟，以及在安裝過程中需要特別注意的細節。此外，我們也會分享安裝完成後，如何設定讓 Mac 能夠在本機獨立啟動，並進一步探討如何關閉啟動選擇器，以恢復如同原生 macOS 的流暢開機體驗。

---

## 為什麼會有這心得？

### 背景與痛點

許多使用者仍然擁有效能足夠、外觀尚佳的舊款 Mac 筆電，這些設備對於處理文書、瀏覽網頁、觀看影音等日常應用綽綽有餘。然而，蘋果的產品生命週期策略，往往導致這些設備在硬體尚未完全過時時，就因作業系統版本過舊而無法獲得最新的功能、安全性更新，甚至無法運行新版本的應用程式。這種情況不僅浪費了硬體資源，也可能帶來潛在的安全風險。OpenCore Legacy Patcher (OCLP) 的出現，為了解決這個痛點提供了可能性，它允許使用者繞過官方的硬體限制，為舊款 Mac 安裝和運行最新版本的 macOS。

---

## OpenCore Legacy Patcher 資源與下載

### 官方網站與文件

在開始使用 OCLP 之前，建議所有使用者都應該先深入閱讀官方提供的文件。這些文件詳細說明了 OCLP 的運作原理、支援的硬體列表、已知限制以及詳細的操作指南。瞭解官方文件是成功安裝和排除問題的關鍵。

*   [OpenCore Legacy Patcher 官方文件](https://dortania.github.io/OpenCore-Legacy-Patcher/)

### 最新版本下載

OCLP 是一個開源專案，其最新版本通常會發布在 GitHub 上。使用者應前往 GitHub Releases 頁面下載最新、最穩定的版本，以確保獲得最佳的相容性和功能。

*   [OpenCore Legacy Patcher GitHub 下載連結](https://github.com/dortania/OpenCore-Legacy-Patcher/releases)

---

## 建立安裝隨身碟的第一步：開啟 OCLP

### 操作流程

1.  首先，您需要在您的 Mac 上下載並安裝 OpenCore Legacy Patcher 應用程式。
2.  打開應用程式後，您會看到一個清晰的主畫面，其中提供了多項功能。
3.  點選螢幕上醒目的 **"Create macOS Installer"**（建立 macOS 安裝程式）按鈕，這將引導您進入製作系統安裝隨身碟的流程。

---

## 下載作業系統版本

### 選擇 macOS 版本

在進行安裝隨身碟製作的過程中，系統會詢問您要如何獲取 macOS 安裝程式。最直接且推薦的方式是選擇 **"Download macOS Installer"**。OCLP 會自動從蘋果官方伺服器抓取一份可用的 macOS 版本列表，供您選擇。您可以根據您的需求和硬體支援度，選擇您想要安裝的最新系統版本，例如 macOS 14 Sonoma 或 macOS 15 Sequoia，然後點擊下載。

---

## 開始製作安裝隨身碟

### 製作步驟

1.  請準備一支容量至少為 16GB 的 USB 隨身碟。
2.  待 macOS 安裝檔下載完成後，您需要在 OCLP 中選擇 **"Use Existing macOS Installer"**，並指向您剛剛下載的安裝檔案。
3.  接著，選擇您要用來製作安裝隨身碟的 USB 裝置。系統可能會提示您輸入 Mac 的管理員密碼，以授權進行隨身碟的格式化和資料寫入操作。
4.  請耐心等待，OCLP 會將完整的 macOS 安裝程式複製到您的隨身碟中。

---

## 安裝隨身碟製作完成

### 最後的關鍵步驟

當 macOS 安裝檔成功寫入隨身碟後，OCLP 會跳出一個重要的提示，詢問您是否要將 OpenCore 引導程式（EFI）也一併寫入這個安裝隨身碟。這一步是至關重要的，因為它讓隨身碟具備了引導舊款 Mac 啟動的能力。

1.  請點選 **"Install OpenCore to disk"**。
2.  在裝置列表中，選擇您剛剛製作的 USB 隨身碟。
3.  接下來，系統會要求您選擇要將 EFI 寫入的磁區，通常是隨身碟上的 **EFI 磁區**。
4.  完成以上步驟後，您就成功地製作了一個能夠啟動舊款 Mac 並進行最新版 macOS 安裝的神級隨身碟！

---

## 啟動並安裝作業系統

### 安裝引導與安裝過程

1.  將製作完成的隨身碟插入您要升級的舊款 Mac。
2.  關閉 Mac，然後按住鍵盤上的 **Option (Alt)** 鍵不放，再按下電源鍵開機。
3.  當出現開機選單時，您會看到一個帶有 OpenCore 圖示的選項，請選擇 **"EFI Boot"**。
4.  進入 OpenCore 選單後，再選擇 **"Install macOS"**。
5.  此時，您將進入熟悉的 macOS 恢復模式介面。您需要使用「磁碟工具程式」來格式化您的硬碟（請注意備份重要資料），然後就可以開始安裝最新的 macOS 了。

---

## 安裝完成後的後續動作

### 安裝後重開機使用隨身碟繼續

在 macOS 安裝過程中，Mac 會經歷數次重啟。為了確保每次重啟都能正確地透過隨身碟的 EFI 進行引導，直到系統安裝完全並進入桌面為止，您需要持續保持插入隨身碟並透過 Option (Alt) 鍵選擇「EFI Boot」來啟動。

*   [Booting OpenCore and macOS 說明文件](https://dortania.github.io/OpenCore-Legacy-Patcher/BOOT.html)

### 免 USB 隨身碟獨立啟動

當系統安裝完畢，您已成功進入最新的 macOS 桌面後，就可以著手移除對隨身碟的依賴，實現獨立啟動。

1.  開啟您 Mac 內部的 OpenCore Legacy Patcher 應用程式。
2.  點選 **"Build and Install OpenCore"**。這次，請選擇將 EFI 檔案寫入您 **Mac 本機的內置硬碟**。
3.  **關閉啟動選擇器（可選）**：若您希望每次開機都能像原廠 Mac 一樣直接進入系統，而無需經過 OpenCore 的啟動選擇器，您可以進入 OCLP 的設定（Settings）中，找到並關閉 "Show Boot Picker"（顯示啟動選擇器）的選項。
4.  完成這些後續設定，您的舊 Mac 就能夠順暢地運行最新版本的 macOS 了。

*   [Booting without USB drive 說明文件](https://dortania.github.io/OpenCore-Legacy-Patcher/POST-INSTALL.html)

本文由 AI + Gemini 2.5 Flash 協助整理