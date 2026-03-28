const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 從環境變數取得 API Key
if (!process.env.GEMINI_API_KEY) {
  console.error('錯誤: 缺少 GEMINI_API_KEY 環境變數');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getDirectoryContent(directoryPath, maxChars = 30000) {
  /**
   * 讀取目錄中符合條件的檔案內容，並限制總字數以避免超過 Token 限制。
   */
  let contentBuffer = [];
  let totalChars = 0;

  const ignoreFiles = ['README.md', '.DS_Store', 'node_modules', 'package.json', 'package-lock.json'];
  const validExtensions = ['.md', '.txt', '.py', '.js', '.ts', '.html', '.css', '.json'];

  if (!fs.existsSync(directoryPath)) return "";

  console.log(`正在掃描目錄: ${directoryPath}`);

  const files = fs.readdirSync(directoryPath);

  for (const fileName of files) {
    const filePath = path.join(directoryPath, fileName);
    const stats = fs.statSync(filePath);

    if (ignoreFiles.includes(fileName)) continue;
    if (stats.isDirectory()) continue;
    if (!validExtensions.includes(path.extname(fileName))) continue;

    try {
      let text = fs.readFileSync(filePath, 'utf8');

      // 單一檔案過大時進行截斷 (例如超過 5000 字)
      if (text.length > 5000) {
        text = text.substring(0, 5000) + "\n...[內容過長已截斷]...";
      }

      const fileContent = `--- 檔案名稱: ${fileName} ---\n${text}\n`;
      contentBuffer.push(fileContent);
      totalChars += fileContent.length;

      if (totalChars >= maxChars) {
        contentBuffer.push("\n...[總內容已達上限已截斷]...");
        break;
      }
    } catch (e) {
      console.error(`讀取檔案 ${fileName} 失敗: ${e.message}`);
    }
  }

  // 若有 PR 描述（由 CI 傳入），附加在最前面作為補充資訊
  const prDescription = process.env.PR_DESCRIPTION;
  if (prDescription && prDescription.trim()) {
    contentBuffer.unshift(`--- PR 說明（活動基本資訊）---\n${prDescription.trim()}\n`);
  }

  return contentBuffer.join('\n');
}

async function generateReadme(directoryPath) {
  const readmePath = path.join(directoryPath, 'README.md');
  const forceRegenerate = process.argv.includes('--force');

  if (fs.existsSync(readmePath) && !forceRegenerate) {
    console.log(`跳過 ${directoryPath}：README.md 已存在（使用 --force 強制重新生成）`);
    return;
  }

  const content = await getDirectoryContent(directoryPath);
  if (!content.trim()) {
    console.log(`${directoryPath} 中沒有可分析的內容，跳過。`);
    return;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `
    你是一位開發者社群的活動紀錄員。
    請分析以下來自某個活動資料夾的內容，並產生一份結構化的 \`README.md\` (使用繁體中文)。

    **README 格式要求（請嚴格遵守）：**
    1. **第一行**：使用 \`# \` 開頭寫入活動名稱（例如：\`# 那些年用過的 Git 分支管理策略\`）。
    2. **基本資訊清單**（緊接在標題後）：
        - \`- 分享者：[名稱]\`（若有多位請列出）
        - \`- [活動連結](URL)\`（如果資料中沒提到則「整行略過」）
        - \`- [投影片](URL)\`（如果資料中沒提到連結，或資料夾內已有 Slides.md 等投影片檔案，則「整行略過」）
    3. **活動簡介**：用一到兩段文字說明這次分享的背景與目的，使用 \`## 活動簡介\` 作為標題。
    4. **主題內容**：依照分享的主題或章節，各自使用 \`## \` 展開為獨立段落，每個段落內要有詳細說明文字，必要時使用 \`### \` 建立子段落。段落之間用 \`---\` 分隔。
    5. 如有 Q&A、延伸資源、行動清單等補充內容，也各自用 \`## \` 獨立呈現。

    **注意事項：**
    - 輸出必須以 \`# 活動名稱\` 開頭。
    - 主題內容段落要有實質說明，不能只列條列式清單，要讓沒有參加活動的人也能看懂。
    - 最後一行加上註記，說明本文由 AI 協助整理，並註明使用的模型名稱（例如：\`本文由 AI + Gemini 2.5 Flash 協助整理\`）。
    - 請只回傳 Markdown 內容，不要包含任何開頭或結尾的解釋文字。

    **待分析內容與檔案列表：**
    ${content}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const readmeContent = response.text();

    const readmePath = path.join(directoryPath, 'README.md');
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log(`成功為 ${directoryPath} 產生 README.md`);
  } catch (e) {
    console.error(`為 ${directoryPath} 產生內容失敗: ${e.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const uniqueDirs = new Set();

  if (args.length > 0) {
    // 處理透過 git diff 傳進來的路徑
    for (const p of args) {
      // 取路徑的第一層目錄（例如 "202602-test-case/sub/file.md" → "202602-test-case"）
      const topDir = p.split('/')[0];
      // 支援以 20 開頭的目錄，例如 202412 或 202602-test-case
      if (topDir.match(/^20\d{2}/) && fs.existsSync(topDir)) {
        uniqueDirs.add(topDir);
      }
    }
  } else {
    // 若無參數，掃描根目錄下的 immediate subdirectories (排除隱藏與特定資料夾)
    console.log("未提供路徑參數，正在掃描根目錄下的子目錄...");
    const items = fs.readdirSync('.');
    for (const item of items) {
      const stats = fs.statSync(item);
      if (stats.isDirectory() && !item.startsWith('.') && !['scripts', '.github', 'node_modules'].includes(item)) {
        uniqueDirs.add(item);
      }
    }
  }

  if (uniqueDirs.size === 0) {
    console.log("查無需要處理的目錄。");
    return;
  }

  for (const dir of uniqueDirs) {
    await generateReadme(dir);
  }
}

main().catch(err => {
  console.error('執行失敗:', err);
  process.exit(1);
});
