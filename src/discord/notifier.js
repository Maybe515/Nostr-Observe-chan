// notifier.js
import { EmbedBuilder } from 'discord.js';
import { trimContent } from '../utils/textFormat.js';
import { nip19 } from 'nostr-tools';

/**
 * Discord Embed通知を送信
 * @param {Channel} channel
 * @param {string} keyword
 * @param {object} profile
 * @param {string} pubkey
 * @param {string|null} avatarUrl
 * @param {string} content
 */
export function sendNotification(channel, keyword, profile, pubkey, content, avatarUrl, relayURL) {
  let npub;
  if (!pubkey.startsWith('npub')) {
    try{
      npub = nip19.npubEncode(pubkey);
    } catch {
      npub = pubkey;
    }
  } else {
    npub = pubkey;
  }

  const UserName = profile.display_name || profile.name || 'None';
  const profileURL = `https://nostter.app/${npub}`;
  const thumbnailUrl = profile.picture || avatarUrl || 'https://via.placeholder.com/100';
  const embed = new EmbedBuilder()
    .setTitle(`🔔 キーワード検出「${keyword}」`)
    .setDescription(trimContent(content) || '（本文なし）')
    .addFields(
      { name: 'Sender', value: `[${UserName}](${profileURL})`, inline: true },
      { name: 'nip05', value: profile.nip05 || 'None', inline: true },
      { name: 'pubkey', value: `\`${npub}\`` || 'None' }
    )
    .setThumbnail(thumbnailUrl)
    .setFooter({ text: `form ${relayURL}` })
    .setColor(0xffcc00)
    .setTimestamp();

  channel.send({ embeds: [embed] });
}
