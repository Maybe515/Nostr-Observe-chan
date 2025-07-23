import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESMで __dirname を扱うための処理
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function loadKeywords() {
  try {
    const filePath = path.join(__dirname, '..', 'config', 'keywords.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    return json.keywords || [];
  } catch {
    console.warn('⚠️ キーワードファイル読み込み失敗');
    return [];
  }
}
