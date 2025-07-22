import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { getDisplayName, getProfile } from '../../nostr/profileCache.js';

import path from 'path';
import fs from 'fs';

export async function handleProfile(interaction) {
  const pubkey = interaction.options.getString('pubkey');
  const profile = getProfile(pubkey);
  const displayName = getDisplayName(pubkey);

  const embed = new EmbedBuilder()
    .setTitle(`📄 プロフィール: ${displayName}`)
    .addFields(
      { name: '表示名', value: displayName },
      { name: '自己紹介', value: profile.about?.slice(0, 150) || '（未設定）' }
    )
    .setThumbnail(profile.picture?.trim() || 'attachment://default-avatar.jpg')
    .setColor(0x00ccff)
    .setTimestamp();

  const files = [];
  const defaultPath = path.resolve(process.env.DEFAULT_ICON_PATH || 'assets/default-avatar.jpg');
  if (!profile.picture || profile.picture.trim() === '') {
    if (fs.existsSync(defaultPath)) {
      files.push(new AttachmentBuilder(defaultPath));
    }
  }

  await interaction.reply({ embeds: [embed], files });
}
