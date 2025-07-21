import path from 'path';
import fs from 'fs';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
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

  if (displayName && displayName.trim()) {
    embed.addFields({ name: '表示名', value: displayName });
  }

  if (about && about.trim()) {
    const shortened = about.length > 150 ? `${about.slice(0, 147)}...` : about;
    embed.addFields({ name: '自己紹介', value: shortened });
  }

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  if (!channel) return;
  let files = [];

  if (pictureUrl && pictureUrl.trim()) {
    embed.setThumbnail(pictureUrl);
  } else {
    const defaultPath = path.resolve(process.env.DEFAULT_ICON_PATH || 'assets/default-avatar.png');
    if (fs.existsSync(defaultPath)) {
      const attachment = new AttachmentBuilder(defaultPath);
      embed.setThumbnail('attachment://default-avatar.png');
      files.push(attachment);
    } else {
      console.warn('⚠️ デフォルト画像が見つかりませんでした:', defaultPath);
    }
  }
  await channel.send({ embeds: [embed], files });
}

