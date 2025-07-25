import fs from 'fs';
import path from 'path';

let keywords = [];
let muted = [];
let relays = [];

export function loadConfig() {
  keywords = readJson('keywords.json').keywords || [];
  muted = readJson('muted.json').muted || [];
  relays = readJson('relays.json').relays || [];
}

export function getKeywords() {
  return keywords;
}

export function getMuted() {
  return muted;
}

export function getRelays() {
  return relays;
}

export function updateKeywords(newList) {
  keywords = newList;
  writeJson('keywords.json', { keywords });
}

export function updateMuted(newList) {
  muted = newList;
  writeJson('muted.json', { muted });
}

export function updateRelays(newList) {
  relays = newList;
  writeJson('relays.json', { relays });
}

function readJson(filename) {
  try {
    const filePath = path.join('src', 'config', filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeJson(filename, data) {
  try {
    const filePath = path.join('src', 'config', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn(`⚠️ ${filename} 書き込み失敗`);
  }
}
