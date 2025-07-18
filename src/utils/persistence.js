import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data/notified.json');

export function loadNotifiedEvents() {
  try {
    if (!fs.existsSync(filePath)) return new Set();
    const raw = fs.readFileSync(filePath, 'utf-8');
    const ids = JSON.parse(raw);
    return new Set(ids);
  } catch (err) {
    console.error('❌ 通知済みイベントの読み込み失敗:', err);
    return new Set();
  }
}

export function saveNotifiedEvents(set) {
  try {
    const ids = Array.from(set);
    fs.writeFileSync(filePath, JSON.stringify(ids, null, 2));
  } catch (err) {
    console.error('❌ 通知済みイベントの保存失敗:', err);
  }
}
