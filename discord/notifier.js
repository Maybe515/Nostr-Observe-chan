// notifier.js
import { EmbedBuilder } from 'discord.js';
import { nip19 } from 'nostr-tools';

const MAX_DESCRIPTION_LENGTH = 2000;    // Embedの文字数制限

/**
 * Discord Embed通知を送信
 * @param {Channel} channel
 * @param {string} keyword
 * @param {object} profile
 * @param {string} pubkey
 * @param {string|null} avatarUrl
 * @param {string} content
 */

/**
 * 文字列をEmbedの長さ制限に収めつつ、末尾に "..." を付けて省略表示
 * @param {string} text
 * @returns {string}
 */
function formatContent(text) {
  if (!text) return '（本文なし）';
  if (text.length <= MAX_DESCRIPTION_LENGTH) return text;

  const truncated = text.substring(0, MAX_DESCRIPTION_LENGTH - 3);
  return truncated + '...';
}

export function sendNotification(channel, keyword, profile, pubkey, avatarUrl, content) {
  const thumbnailUrl = profile.picture || avatarUrl || 'https://via.placeholder.com/100';
  
  // ✅ pubkey を npub 形式に変換
  let npub = pubkey;
  try {
    npub = nip19.npubEncode(pubkey);
  } catch {
    npub = pubkey;    // 変換失敗時は元のHex表示
  }
  
  const embed = new EmbedBuilder()
    .setTitle(`🔔 キーワード検出「${keyword}」`)
    .setDescription(formatContent(content))
    .addFields(
      { name: 'User Name', value: profile.displayName || 'None', inline: true },
      { name: 'nip05', value: profile.nip05 || 'None', inline: true },
      { name: 'npub', value: npub || 'None' }
    )
    .setThumbnail(thumbnailUrl)
    .setFooter({ text: 'Nostr Event Notification' })
    .setColor(0xffcc00)
    .setTimestamp();

  channel.send({ embeds: [embed] });
}
