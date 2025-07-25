// utils/relayLoader.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { relayInit } from 'nostr-tools';
import WebSocket from 'ws';
import { getRelays } from './configCache.js';
global.WebSocket = WebSocket;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map<URL, { relay, retries }>
const relayMap = new Map();
const MAX_RETRIES = 3;

/**
 * 指定されたURLリストに対して、接続を試み、接続状態を表示
 * @param {string[]} relays - 接続対象のリレーURL一覧
 */
function connectRelays(relays) {
  relays.forEach(url => {
    let entry = relayMap.get(url);

    if (!entry) {
      const relay = relayInit(url);
      entry = { relay, retries: 0 };
      relayMap.set(url, entry);

      relay.on('connect', () => {
        console.log(`✅ [接続成功] ${url}`);
        entry.retries = 0;      // 成功時にリセット
      });

      relay.on('error', () => {
        console.warn(`❌ [接続失敗] ${url}`);
      });
    }

    if (entry.retries >= MAX_RETRIES) {
      console.warn(`🚫 [試行停止] ${url} （${MAX_RETRIES}回失敗）`);
      return;
    }

    entry.relay.connect().catch(() => {
      entry.retries++;
      console.warn(`⚠️ [再試行${entry.retries}/${MAX_RETRIES}] ${url}`);
    });
  });
}

/**
 * relays.json を読み込み、リレー接続を初期化し、定期的に再接続を試みる
 * @param {number} intervalMs - 再接続の間隔（ミリ秒）デフォルト: 60000ms
 * @returns {string[]} 読み込まれたリレーURL一覧
 */
export default function loadRelaysWithReconnect(intervalMs = 60000) {
  try {
    const filePath = path.join(__dirname, '..', 'config', 'relays.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    const relays = json.relays || [];

    // 初回接続
    connectRelays(relays);

    // 指定時間ごとに再接続
    setInterval(() => {
      connectRelays(relays);
    }, intervalMs);

    return relays;
  } catch {
    console.warn('⚠️ relays.jsonの読み込みに失敗しました');
    return [];
  }
}
