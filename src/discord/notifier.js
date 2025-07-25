// notifier.js
import { EmbedBuilder } from 'discord.js';
import { trimContent } from '../utils/textFormat.js';

/**
 * Discord Embed通知を送信
 * @param {Channel} channel
 * @param {string} keyword
 * @param {object} profile
 * @param {string} pubkey
 * @param {string|null} avatarUrl
 * @param {string} content
 */

export function sendNotification(channel, keyword, profile, pubkey, avatarUrl, content) {
  const thumbnailUrl = profile.picture || avatarUrl || 'https://via.placeholder.com/100';
  const embed = new EmbedBuilder()
    .setTitle(`🔔 キーワード検出「${keyword}」`)
    .setDescription(trimContent(content) || '（本文なし）')
    .addFields(
      { name: 'User Name', value: profile.displayName || 'None', inline: true },
      { name: 'nip05', value: profile.nip05 || 'None', inline: true },
      { name: 'pubkey', value: pubkey || 'None' }
    )
    .setThumbnail(thumbnailUrl)
    .setFooter({ text: 'Nostr Event Notification' })
    .setColor(0xffcc00)
    .setTimestamp();

  channel.send({ embeds: [embed] });
}
