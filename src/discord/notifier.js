import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 通知先チャンネルID:', process.env.CHANNEL_ID);

function truncate(text, maxLength = 150) {
  if (!text) return null;
  const trimmed = text.trim();
  if (trimmed === '') return null;    // 空文字は非表示
  return trimmed.length > maxLength
    ? trimmed.slice(0, maxLength - 3) + '...'
    : trimmed;
}

export async function sendNotification(client, content, nip05, keyword, pictureUrl = null, displayName = null, about = null) {
  const embed = new EmbedBuilder()
    .setTitle('🔔 キーワード検出')
    .setDescription(content)
    .addFields(
      { name: '検出キーワード', value: keyword },
      { name: '投稿者', value: nip05 }
    )
    .setColor(0xffcc00)
    .setTimestamp();

  if (displayName) {
    embed.addFields({ name: '表示名', value: displayName });
  }

  const truncatedAbout = truncate(about, 150);
  if (truncatedAbout) {
    embed.addFields({ name: '自己紹介', value: truncatedAbout });
  }

  const thumbnailUrl = pictureUrl && pictureUrl.trim() !== ''
    ? pictureUrl
    : process.env.DEFAULT_ICON_URL;

  if (thumbnailUrl) {
    embed.setThumbnail(thumbnailUrl);
  }

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  if (channel) {
    await channel.send({ embeds: [embed] });
  } else if (!channel) {
    console.error('❌ チャンネルが取得できませんでした');
    return;
  }
}

