import getProfile from '../nostr/profile.js';
import { EmbedBuilder } from 'discord.js';

export default {
  data: {
    name: 'profile-show',
    description: '指定したpubkeyのプロフィールを表示します',
    options: [{
      name: 'pubkey',
      type: 3,
      description: '対象ユーザーのpubkey（16進 or npub形式）',
      required: true
    }]
  },
  async execute(interaction) {
    const pubkey = interaction.options.getString('pubkey').trim();

    await interaction.deferReply();

    try {
      const profile = await getProfile(pubkey);

      const embed = new EmbedBuilder()
        .setTitle('👤 プロフィール情報')
        .addFields(
          { name: 'User Name', value: profile.displayName || '不明', inline: true },
          { name: 'nip05', value: profile.nip05 || '未登録', inline: true },
          { name: 'pubkey', value: pubkey }
        )
        .setThumbnail(profile.picture || 'https://via.placeholder.com/100')
        .setColor(0x3366CC)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await logError(client, 'fatal', 'プロフィール取得エラー', err.stack);
      await interaction.editReply(`⚠️ プロフィール取得に失敗しました: \`${pubkey}\``);
    }
  }
}
