const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// 從環境變數取得 API Key
if (!process.env.GEMINI_API_KEY) {
  console.error('錯誤: 缺少 GEMINI_API_KEY 環境變數');
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ---- 型態分流器（modality router）----
// 每個檔案依副檔名分類，決定「怎麼進 prompt」而非「進不進」。
const TEXT_EXTENSIONS = ['.md', '.txt', '.py', '.js', '.ts', '.html', '.css', '.json'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
const AV_EXTENSIONS = ['.mp4', '.mov', '.mp3', '.wav', '.avi', '.mkv', '.m4a', '.m4v'];
const IGNORE_NAMES = ['README.md', '.DS_Store', 'node_modules', 'package.json', 'package-lock.json'];

// 請求預算（design D4）：inline 原始檔案（未 base64 編碼前）總量上限與單檔 PDF 上限。
const INLINE_BUDGET_BYTES = 14 * 1024 * 1024; // 14MB
const SINGLE_PDF_LIMIT_BYTES = 9 * 1024 * 1024; // 9MB

// CI workflow（.github/workflows/ai-readme.yml）在偵測到 .pptx / 圖片時，
// 分別以 LibreOffice / ImageMagick 轉檔・縮圖到 repo 外的暫存目錄，並透過下列
// 環境變數把「鏡射活動目錄結構」的暫存目錄路徑傳給本 script：
//   PPTX_PDF_DIR/<活動目錄>/<相對路徑>.pdf   ← 對應原始 <相對路徑>.pptx 轉出的 PDF
//   IMAGE_THUMB_DIR/<活動目錄>/<相對路徑>    ← 對應原始圖片縮圖後的檔案
// 本機執行（未設定這兩個環境變數，或找不到對應暫存檔）時：
//   - PPTX 因為沒有轉檔結果，直接跳過並 log。
//   - 圖片則退回讀取原始檔案（僅供本機測試方便，體積仍受請求預算把關）。

function classifyFile(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  if (TEXT_EXTENSIONS.includes(ext)) return { type: 'text' };
  if (ext === '.pdf') return { type: 'pdf' };
  if (ext === '.pptx') return { type: 'pptx' };
  if (IMAGE_EXTENSIONS.includes(ext)) return { type: 'image' };
  if (AV_EXTENSIONS.includes(ext)) return { type: 'skip', reason: '不支援的影音格式' };
  return { type: 'skip', reason: '不支援的格式' };
}

function getImageMimeType(ext) {
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.heic':
      return 'image/heic';
    default:
      return 'application/octet-stream';
  }
}

/**
 * 掃描活動目錄，涵蓋一層子目錄（跳過 `.` 開頭與 node_modules），
 * 回傳以相對路徑識別的檔案清單。
 */
function listFiles(directoryPath) {
  const results = [];

  function scanLevel(subRelPath, depth) {
    const absDir = path.join(directoryPath, subRelPath);
    if (!fs.existsSync(absDir)) return;

    const entries = fs.readdirSync(absDir);
    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules') continue;
      if (IGNORE_NAMES.includes(entry)) continue;

      const entryRelPath = subRelPath ? path.join(subRelPath, entry) : entry;
      const entryAbsPath = path.join(directoryPath, entryRelPath);
      const stats = fs.lstatSync(entryAbsPath);

      // 不跟隨 symbolic link（避免連結到 repo 外或非預期路徑的內容）
      if (stats.isSymbolicLink()) {
        console.log(`略過 ${entryRelPath}：symbolic link 不納入掃描`);
        continue;
      }

      if (stats.isDirectory()) {
        if (depth < 1) scanLevel(entryRelPath, depth + 1);
        continue;
      }

      results.push({ relPath: entryRelPath, absPath: entryAbsPath, size: stats.size });
    }
  }

  scanLevel('', 0);
  return results;
}

function resolveConvertedPdfPath(directoryPath, relPath) {
  const baseDir = process.env.PPTX_PDF_DIR;
  if (!baseDir) return null;
  const pdfRelPath = relPath.replace(/\.pptx$/i, '.pdf');
  const candidate = path.join(baseDir, directoryPath, pdfRelPath);
  return fs.existsSync(candidate) ? candidate : null;
}

function resolveThumbnailPath(directoryPath, relPath) {
  const baseDir = process.env.IMAGE_THUMB_DIR;
  if (!baseDir) return null;
  const candidate = path.join(baseDir, directoryPath, relPath);
  return fs.existsSync(candidate) ? candidate : null;
}

/**
 * 依優先序（投影片 PDF > 筆記文字 > 照片）反向捨棄整檔，直到總量在預算內。
 * 每次捨棄都輸出 log（design D4 / spec「請求預算與優先序裁決」）。
 */
function enforceBudget(pdfItems, textItems, photoItems) {
  const totalBytes = () =>
    pdfItems.reduce((sum, i) => sum + i.size, 0) +
    textItems.reduce((sum, i) => sum + i.size, 0) +
    photoItems.reduce((sum, i) => sum + i.size, 0);

  while (totalBytes() > INLINE_BUDGET_BYTES && photoItems.length > 0) {
    const dropped = photoItems.pop();
    console.log(`[預算] 請求總量超過 14MB 上限，捨棄照片: ${dropped.relPath}`);
  }
  while (totalBytes() > INLINE_BUDGET_BYTES && textItems.length > 0) {
    const dropped = textItems.pop();
    console.log(`[預算] 請求總量超過 14MB 上限，捨棄文字檔案: ${dropped.relPath}`);
  }
  while (totalBytes() > INLINE_BUDGET_BYTES && pdfItems.length > 0) {
    const dropped = pdfItems.pop();
    console.log(`[預算] 請求總量超過 14MB 上限，捨棄投影片: ${dropped.relPath}`);
  }
}

/**
 * 掃描活動目錄，依型態分流器組成 Gemini 請求用的 parts 陣列。
 * 回傳 null 代表沒有任何可用內容。
 */
function buildRequestParts(directoryPath) {
  if (!fs.existsSync(directoryPath)) return null;

  console.log(`正在掃描目錄: ${directoryPath}`);
  const files = listFiles(directoryPath);

  const pdfItems = []; // 投影片（含 PPTX 轉出者），優先序最高
  const textItems = []; // 文字筆記，優先序次之
  const photoItems = []; // 照片，優先序最低

  let textTotalChars = 0;

  for (const file of files) {
    const classification = classifyFile(file.relPath);

    if (classification.type === 'skip') {
      console.log(`略過檔案 ${file.relPath}：${classification.reason}`);
      continue;
    }

    if (classification.type === 'text') {
      if (textTotalChars >= 30000) {
        console.log(`略過檔案 ${file.relPath}：文字總量已達上限（30000 字）`);
        continue;
      }
      try {
        let text = fs.readFileSync(file.absPath, 'utf8');
        if (text.length > 5000) {
          text = text.substring(0, 5000) + '\n...[內容過長已截斷]...';
        }
        textTotalChars += text.length;
        const label = `--- 檔案名稱: ${file.relPath} ---\n${text}\n`;
        textItems.push({ relPath: file.relPath, size: Buffer.byteLength(label, 'utf8'), text: label });
      } catch (e) {
        console.error(`讀取檔案 ${file.relPath} 失敗: ${e.message}`);
      }
      continue;
    }

    if (classification.type === 'pdf') {
      if (file.size > SINGLE_PDF_LIMIT_BYTES) {
        console.log(`略過檔案 ${file.relPath}：PDF 超過單檔 9MB 上限，請將重點寫入 PR 描述`);
        continue;
      }
      pdfItems.push({
        relPath: file.relPath,
        size: file.size,
        label: `檔案：${file.relPath}（投影片 PDF）`,
        absPath: file.absPath,
      });
      continue;
    }

    if (classification.type === 'pptx') {
      const convertedPath = resolveConvertedPdfPath(directoryPath, file.relPath);
      if (!convertedPath) {
        console.log(`略過檔案 ${file.relPath}：找不到轉檔後的 PDF（PPTX_PDF_DIR 未設定或轉檔失敗），請將重點寫入 PR 描述`);
        continue;
      }
      const convertedSize = fs.statSync(convertedPath).size;
      if (convertedSize > SINGLE_PDF_LIMIT_BYTES) {
        console.log(`略過檔案 ${file.relPath}：轉檔後的 PDF 超過單檔 9MB 上限，請將重點寫入 PR 描述`);
        continue;
      }
      pdfItems.push({
        relPath: file.relPath,
        size: convertedSize,
        label: `檔案：${file.relPath}（PPTX 投影片，已轉為 PDF 供內容預覽；README 中的投影片連結請指向原始 ${file.relPath}）`,
        absPath: convertedPath,
      });
      continue;
    }

    if (classification.type === 'image') {
      let sourcePath;
      if (process.env.IMAGE_THUMB_DIR) {
        // CI 環境：spec 要求縮圖後才可附加；縮圖不存在視同縮圖失敗，跳過該檔。
        sourcePath = resolveThumbnailPath(directoryPath, file.relPath);
        if (!sourcePath) {
          console.log(`略過檔案 ${file.relPath}：IMAGE_THUMB_DIR 中找不到對應縮圖（縮圖步驟可能失敗）`);
          continue;
        }
      } else {
        // 本機測試（未設定 IMAGE_THUMB_DIR）：退回原始圖片，體積仍受請求預算把關。
        console.log(`IMAGE_THUMB_DIR 未設定，改用原始圖片（僅限本機測試）: ${file.relPath}`);
        sourcePath = file.absPath;
      }
      const size = fs.statSync(sourcePath).size;
      photoItems.push({
        relPath: file.relPath,
        size,
        label: `檔案：${file.relPath}（活動照片）`,
        absPath: sourcePath,
        mimeType: getImageMimeType(path.extname(file.relPath).toLowerCase()),
      });
      continue;
    }
  }

  enforceBudget(pdfItems, textItems, photoItems);

  // PR 描述（由 CI 傳入）作為補充資訊，優先於檔案內容；只有空白字元視同沒有描述
  const prDescription = (process.env.PR_DESCRIPTION || '').trim();

  if (pdfItems.length === 0 && textItems.length === 0 && photoItems.length === 0 && !prDescription) {
    return null;
  }

  const parts = [];

  if (prDescription) {
    parts.push({ text: `--- PR 說明（活動基本資訊）---\n${prDescription}\n` });
  }

  if (textItems.length > 0) {
    parts.push({ text: textItems.map((i) => i.text).join('\n') });
  }

  for (const item of pdfItems) {
    parts.push({ text: item.label });
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: fs.readFileSync(item.absPath).toString('base64'),
      },
    });
  }

  for (const item of photoItems) {
    parts.push({ text: item.label });
    parts.push({
      inlineData: {
        mimeType: item.mimeType,
        data: fs.readFileSync(item.absPath).toString('base64'),
      },
    });
  }

  return parts;
}

async function generateReadme(directoryPath) {
  const readmePath = path.join(directoryPath, 'README.md');
  const forceRegenerate = process.argv.includes('--force');

  if (fs.existsSync(readmePath) && !forceRegenerate) {
    console.log(`跳過 ${directoryPath}：README.md 已存在（使用 --force 強制重新生成）`);
    return;
  }

  const contentParts = buildRequestParts(directoryPath);
  if (!contentParts) {
    console.log(`${directoryPath} 中沒有可分析的內容，跳過。`);
    return;
  }

  const promptText = `
    你是一位開發者社群的活動紀錄員。
    請分析以下來自某個活動資料夾的內容（可能包含文字筆記、投影片 PDF/PPTX、活動照片），並產生一份結構化的 \`README.md\` (使用繁體中文)。

    **README 格式要求（請嚴格遵守）：**
    1. **第一行**：使用 \`# \` 開頭寫入活動名稱（例如：\`# 那些年用過的 Git 分支管理策略\`）。
    2. **基本資訊清單**（緊接在標題後）：
        - \`- 分享者：[名稱]\`（若有多位講者，每位皆須列出，不可只保留其中一位）
        - \`- [活動連結](URL)\`（如果資料中沒提到則「整行略過」）
        - \`- [投影片](URL)\`：每份投影片各自成行。若同一場活動有多份投影片，每條連結請標註對應的講者或主題（例如 \`- [投影片：OpenCore 入門（Brook）](slides-a.pdf)\`）。投影片素材若為 PPTX（可能以已轉檔的 PDF 內容呈現給你），連結請指向原始的 \`.pptx\` 檔案路徑，而非任何暫存 PDF。找不到對應投影片檔案、只有外部連結時則用該外部連結；兩者都沒有才「整行略過」。連結的 URL 只能是上面素材中實際標示的檔案路徑，或 PR 說明中明確提供的網址——嚴禁自行編造任何檔名或網址。

    **投影片與講者的對應規則：**
    - 若 PR 說明中已明確指派（例如「deck-a.pdf 由 Alice 分享」），以此為權威來源。
    - 未指明時，依投影片內容（如首頁標題與作者）推斷對應講者或主題。
    - 兩者皆無法確定時，該條投影片僅列標題，不要虛構或猜測講者名稱。

    3. **活動簡介**：用一到兩段文字說明這次分享的背景與目的，使用 \`## 活動簡介\` 作為標題。
    4. **主題內容**：一場活動可能包含多位講者、多個主題。請依講者或場次將主題內容拆分為各自獨立的 \`## \` 段落，每個段落要有詳細說明文字，不可混雜不同講者/場次的內容，必要時使用 \`### \` 建立子段落。段落之間用 \`---\` 分隔。
    5. 如有 Q&A、延伸資源、行動清單等補充內容，也各自用 \`## \` 獨立呈現。

    **關於照片素材：**
    - 附加的照片僅作為補充活動氛圍與參與狀況的參考，不是主要資訊來源。
    - 撰寫內容時「不得描述個別與會者的外貌特徵」（隱私考量），僅可概略描述活動氛圍（例如：現場座無虛席、討論熱絡）。

    **注意事項：**
    - 輸出必須以 \`# 活動名稱\` 開頭。
    - 主題內容段落要有實質說明，不能只列條列式清單，要讓沒有參加活動的人也能看懂。
    - 最後一行加上註記，說明本文由 AI 協助整理，並註明使用的模型名稱（例如：\`本文由 AI + Gemini 2.5 Flash 協助整理\`）。
    - 請只回傳 Markdown 內容，不要用 \`\`\`markdown 或任何 code fence 包裝，也不要包含任何開頭或結尾的解釋文字。

    **待分析內容如下（含檔案標籤與附加的 PDF/圖片）：**
  `;

  const contents = [{ text: promptText }, ...contentParts];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents,
    });
    // AI 有時會用 ```markdown ... ``` 包住輸出，去除 code fence
    const readmeContent = response.text
      .replace(/^```(?:markdown)?\n/, '')
      .replace(/\n```\s*$/, '');

    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log(`成功為 ${directoryPath} 產生 README.md`);

    updateActivityList(directoryPath, readmeContent);
  } catch (e) {
    console.error(`為 ${directoryPath} 產生內容失敗: ${e.message}`);
  }
}

function updateActivityList(directoryPath, readmeContent) {
  const rootReadmePath = 'README.md';
  if (!fs.existsSync(rootReadmePath)) return;

  const dirName = path.basename(directoryPath);

  const rootReadme = fs.readFileSync(rootReadmePath, 'utf8');

  // 若已有此目錄的連結，略過
  if (rootReadme.includes(`(./${dirName}/)`)) {
    console.log(`活動列表已有 ${dirName} 的項目，略過更新。`);
    return;
  }

  // 從生成的 README 第一行取得活動標題（去掉 `# `）
  const title = readmeContent.split('\n')[0].replace(/^#\s+/, '').trim();

  // 將目錄名轉成日期格式（例如 202603 → 2026-03，202603-topic → 2026-03）
  const match = dirName.match(/^(\d{4})(\d{2})/);
  const dateStr = match ? `${match[1]}-${match[2]}` : dirName;

  const newEntry = `- [${dateStr} ${title}](./${dirName}/)`;

  // 插入到 `## 活動列表` 區塊的最後一筆項目之後（下一個 `##` 之前）
  const updated = rootReadme.replace(
    /(## 活動列表[\s\S]*?)(^## )/m,
    (_, listSection, nextSection) =>
      listSection.trimEnd() + '\n' + newEntry + '\n\n' + nextSection
  );

  fs.writeFileSync(rootReadmePath, updated, 'utf8');
  console.log(`已將 ${dirName} 加入活動列表。`);
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
