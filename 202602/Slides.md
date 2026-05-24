# 蘋果會拋棄你的舊筆電，但 OpenCore 不會

- **分享者**：戴維廷 / Andy
- **活動日期**：2026-02-24
- **活動場合**：開發者 Cafe

---

## 為什麼會有這心得？

- **背景與痛點**：
  - 蘋果（Apple）通常會在新款 macOS 推出後，逐漸停止支援較舊款的 Mac 筆電（例如 2012 至 2017 年間的 MacBook Pro / Air）。
  - 許多舊款筆電的硬體效能其實依然足夠日常使用，但因為官方作業系統（macOS）不支援，導致無法安裝最新的軟體，甚至面臨安全更新中斷的窘境。
  - **救星出現**：透過 OpenCore Legacy Patcher (OCLP)，我們可以打破蘋果官方的限制，讓舊款 Mac 成功安裝並運行最新版本的 macOS（如 macOS Sonoma 或 Sequoia），讓舊筆電重獲新生！

---

## OpenCore Legacy Patcher 資源與下載

- **官方網站與文件**：
  - 閱讀詳細的官方導引文件，瞭解硬體支援度與限制：
    - [OpenCore Legacy Patcher 官方文件](https://dortania.github.io/OpenCore-Legacy-Patcher/)
- **最新版本下載**：
  - 取得最新的 Release 版本安裝檔：
    - [OpenCore Legacy Patcher GitHub 下載連結](https://github.com/dortania/OpenCore-Legacy-Patcher/releases)

---

## 建立安裝隨身碟的第一步：開啟 OCLP

- **操作流程**：
  1. 在您的 Mac 上下載並安裝 **OpenCore Legacy Patcher**。
  2. 開啟應用程式，您會看到主畫面。
  3. 點選 **"Create macOS Installer"**（建立 macOS 安裝程式）按鈕，準備製作系統安裝隨身碟。

---

## 下載作業系統版本

- **選擇 macOS 版本**：
  - 系統會提示您選擇下載方式，建議直接點選 **"Download macOS Installer"**。
  - OCLP 會從蘋果官方伺服器獲取可用的 macOS 安裝檔清單。
  - 選擇您想安裝的最新系統版本（例如 macOS 14 Sonoma 或 macOS 15 Sequoia）並開始下載。

---

## 開始製作安裝隨身碟

- **製作步驟**：
  1. 準備一支至少 16GB 以上的 USB 隨身碟。
  2. 下載完成後，點選 **"Use Existing macOS Installer"**，並選擇剛剛下載的檔案。
  3. 選擇您要寫入的隨身碟，系統會提示輸入 Mac 密碼以進行格式化與寫入。
  4. 稍等片刻，OCLP 會將 macOS 安裝程式寫入隨身碟中。

---

## 安裝隨身碟製作完成

- **最後的關鍵步驟**：
  - 當 macOS 安裝檔寫入完畢後，OCLP 會詢問您是否要將 OpenCore 引導程式（EFI）寫入該安裝隨身碟中：
    - 點選 **"Install OpenCore to disk"**。
    - 選擇剛才的 USB 隨身碟。
    - 選擇隨身碟上的 **EFI 磁區** 進行寫入。
  - 完成後，您就擁有了一支同時包含「OpenCore 引導程式」與「最新版 macOS 安裝檔」的救磚神級隨身碟！

---

## 啟動並安裝作業系統

- **安裝引導與安裝過程**：
  1. 將製作好的隨身碟插上舊 Mac。
  2. 關機後，按住鍵盤的 **Option (Alt)** 鍵不放，然後開機。
  3. 在開機選單中，選擇帶有 OpenCore 圖示的 **"EFI Boot"**。
  4. 進入 OpenCore 選單後，再選擇 **"Install macOS"**。
  5. 接下來會進入熟悉的 macOS 恢復模式，使用「磁碟工具程式」格式化您的硬碟後，即可開始安裝最新的 macOS。

---

## 安裝完成後的後續動作

- **安裝後重開機使用隨身碟繼續**：
  - 在安裝過程中，Mac 會重開機數次。每次重開機時，若尚未完成設定，需確保是透過隨身碟的 EFI 進行引導。
  - 詳細引導流程可參考：
    - [Booting OpenCore and macOS 說明文件](https://dortania.github.io/OpenCore-Legacy-Patcher/BOOT.html)

- **免 USB 隨身碟獨立啟動**：
  - 當系統安裝完畢並進入桌面後，開啟 Mac 內的 OCLP 應用程式。
  - 點選 **"Build and Install OpenCore"**，這次選擇將 EFI 寫入您 **Mac 本機的內置硬碟**（Internal Hard Drive）。
  - **關閉啟動選擇器（可選）**：為了讓每次開機像平常一樣流暢，您可以到 OCLP 設定（Settings）中關閉 "Show Boot Picker"（顯示啟動選擇器）。
  - 詳細後續設定可參考：
    - [Booting without USB drive 說明文件](https://dortania.github.io/OpenCore-Legacy-Patcher/POST-INSTALL.html)
