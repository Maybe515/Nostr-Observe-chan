import { relayInit } from 'nostr-tools';
import fs from 'fs';
import path from 'path';
import { logError } from '../utils/logger.js';
import { updateProfile } from '../nostr/profileCache.js';

const relays = JSON.parse(
  fs.readFileSync(path.resolve('src/config/relays.json'), 'utf-8')
);

const relayMap = new Map();     // リレーURL → { relay, sub }

export async function connectRelays(onEvent) {
  console.log(`-----`);

  for (const url of relays) {
    await connectRelay(url, onEvent);
  }

  // 定期再接続（5分ごと）
  setInterval(() => {
    console.log(`-----`);
    for (const url of relays) {
      reconnectRelay(url, onEvent);
    }
  }, 5 * 60 * 1000);    // 5分
}

async function connectRelay(url, onEvent) {
  try {
    const relay = relayInit(url);
    await relay.connect();

    relay.on('connect', () => console.log(`✅ Connected to ${url}`));
    relay.on('error', (err) => logError(`❌ Relay error: ${url}`, err));

    const sub = relay.sub([
      { kinds: [0, 1], since: Math.floor(Date.now() / 1000) }
    ]);

    sub.on('event', (event) => {
      if (event.kind === 0) {
        updateProfile(event);   // プロフィール更新
      } else {
        onEvent(event);   // 通常イベント処理
      }
    });

    relayMap.set(url, { relay, sub });
  } catch (err) {
    logError(`❌ Failed to connect to relay: ${url}`, err);
  }
}

async function reconnectRelay(url, onEvent) {
  const current = relayMap.get(url);
  if (current) {
    try {
      current.sub.unsub();      // 古い購読を解除
      current.relay.close();    // 接続を閉じる
      console.log(`🔄 Reconnecting to ${url}...`);
    } catch (err) {
      logError(`⚠️ Error during disconnect: ${url}`, err);
    }
  }

  await connectRelay(url, onEvent);   // 再接続
}
