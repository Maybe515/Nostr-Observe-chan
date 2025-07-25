// nostrClient.js
import { SimplePool } from 'nostr-tools';
import { sendNotification } from '../discord/notifier.js';
import { createProfileEmbed } from '../nostr/profileEmbed.js';
import { isDuplicate, markProcessed } from '../utils/dedup.js';
import loadRelaysWithReconnect from '../utils/relayLoader.js';
import { getMuted } from '../utils/configCache.js';
import { isNotificationPaused } from '../commands/snooze.js';
import dotenv from 'dotenv';
dotenv.config();

const RELAY_URLS = loadRelaysWithReconnect();
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
  const mutedList = getMuted();
  const sub = pool.sub(RELAY_URLS, filters);
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

    const profile = await createProfileEmbed(event.pubkey);
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (channel) {
      sendNotification(channel, matched, profile, event.pubkey, avatarUrl, event.content);
    }
  });
}
