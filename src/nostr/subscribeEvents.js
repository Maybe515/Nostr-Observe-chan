// nostrClient.js
import { SimplePool } from 'nostr-tools';
import { sendNotification } from '../notify/sendNotification.js';
import { isDuplicate, markProcessed } from '../utils/dedup.js';
import loadRelaysWithReconnect from '../utils/relayLoader.js';
import { getMuted } from '../config/configCache.js';
import { isNotificationPaused } from '../commands/snooze.js';
import dotenv from 'dotenv';
dotenv.config();

const RELAY_URLS = loadRelaysWithReconnect();
const mutedList = getMuted();
const CHANNEL_ID = process.env.CHANNEL_ID;
const pool = new SimplePool();
const now = Math.floor(Date.now() / 1000); // 現在時刻（秒）
const filters = [
  {
    kinds: [1],           // 通常イベント
    since: now            // 現在時刻以降のイベントのみ
  }
];

console.log('🔍 通知先チャンネルID:', CHANNEL_ID);

export function subscribeEvents(client, keywords, avatarUrl) {
  for (const relayURL of RELAY_URLS) {
    const sub = pool.sub([relayURL], filters);
    sub.on('event', async (event) => {
      if (isNotificationPaused()) {
      console.log(`🔕 通知停止中 → スキップ`);
      return;
      }
      if (isDuplicate(event.id)) return;
      if (mutedList.includes(event.pubkey)) {
        console.log(`🔕 ミュート対象のイベントをスキップ: ${event.pubkey}`);
        return;
      }
      markProcessed(event.id);

      const content = event.content?.toLowerCase() || '';
      const matched = keywords.find(k => content.includes(k.toLowerCase()));
      if (!matched) return;

      const channel = await client.channels.fetch(CHANNEL_ID);
      if (channel) {
        sendNotification(channel, matched, event, avatarUrl, relayURL);
      }
    });
  }
}
