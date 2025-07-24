import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadMuted() {
  try {
    const filePath = path.join(__dirname, '..', 'config', 'muted.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    return json.muted || [];
  } catch {
    console.warn('⚠️ muted.json の読み込み失敗');
    return [];
  }
}
