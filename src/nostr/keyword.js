// キーワードの読込・追加・削除・一致処理＋JSON保存
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data/keywords.json');
let keywords = [];

export function loadKeywords() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    keywords = JSON.parse(data);
    console.log('✅ キーワード読み込み:', keywords);
  } catch (err) {
    console.warn('⚠️ キーワード読み込み失敗、空で初期化');
    keywords = [];
  }
}

function saveKeywords() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(keywords, null, 2), 'utf8');
    console.log('💾 キーワード保存完了');
  } catch (err) {
    console.error('❌ キーワード保存失敗:', err);
  }
}

export function getKeywordList() {
  return [...keywords];
}

export function matchKeyword(content) {
  return keywords.find(k => content.includes(k));
}

export function addKeyword(newKeyword) {
  if (!keywords.includes(newKeyword)) {
    keywords.push(newKeyword);
    saveKeywords();
  }
}

export function removeKeyword(target) {
  keywords = keywords.filter(k => k !== target);
  saveKeywords();
}
