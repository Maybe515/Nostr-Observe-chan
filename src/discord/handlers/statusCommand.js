import { getKeywordList } from '../../nostr/keyword.js';
import { getMutedList, isMuted } from '../../nostr/muteManager.js';
import { getRecentEvents } from '../../nostr/eventCache.js';
import { relayMap } from '../../nostr/relay.js';
import { isProfileCached } from '../../nostr/profileCache.js';

export function handleStatus(interaction) {
  const pubkey = interaction.options.getString('pubkey');

  if (pubkey) {
    const muted = isMuted(pubkey) ? '✅ ミュート中' : '☑️ 通知対象';
    const cached = isProfileCached(pubkey) ? '✅ プロフィール取得済み' : '❌ 未取得';
    return interaction.reply(`🔍 ユーザー状態:\n• ${muted}\n• ${cached}`);
  }

  const summary = [
    `📘 登録キーワード数: ${getKeywordList().length}`,
    `🔇 ミュートユーザー数: ${getMutedList().length}`,
    `📨 通知済みイベント数: ${getRecentEvents().length}`,
    `📡 接続中リレー数: ${relayMap.size}`
  ].join('\n');

  interaction.reply(`✅ Botのステータス:\n${summary}`);
}
