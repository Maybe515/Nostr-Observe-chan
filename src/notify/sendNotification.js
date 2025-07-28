// notifier.js
import { EmbedBuilder } from 'discord.js';
import { nip19 } from 'nostr-tools';
import { trimContent } from '../utils/textFormat.js';
import { fetchProfile } from '../utils/nostrUtils.js';

/**
 * Discord Embed通知を送信
 * @param {Channel} channel
 * @param {string} keyword
 * @param {object} profile
 * @param {string} pubkey
 * @param {string|null} avatarUrl
 * @param {string} content
 */
export async function sendNotification(channel, keyword, event, avatarUrl, relayURL) {
  let npub = nip19.npubEncode(event.pubkey);
  let profile = {};
  try {
    profile = await fetchProfile(event.pubkey);
  } catch {}

  const profileURL = `https://nostter.app/${npub}`;
  const display = profile.display_name || profile.name || 'None';
  const thumbnailUrl = profile.picture || avatarUrl;
  const embed = new EmbedBuilder()
    .setTitle(`🔔 キーワード検出「${keyword}」`)
    .setDescription(trimContent(event.content) || '（本文なし）')
    .addFields(
      { name: 'Sender', value: `[${display}](${profileURL})`, inline: true },
      { name: 'nip05', value: profile.nip05 || 'None', inline: true },
      { name: 'pubkey', value: `\`${npub}\`` || 'None' }
    )
    .setThumbnail(thumbnailUrl)
    .setFooter({ text: `form ${relayURL}` })
    .setColor(0xffcc00)
    .setTimestamp(new Date(event.created_at * 1000));

  channel.send({ embeds: [embed] });
}
