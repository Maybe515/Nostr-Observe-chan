import getProfile from '../nostr/profile.js';
import { EmbedBuilder } from 'discord.js';
import { nip19 } from 'nostr-tools';

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
    const input = interaction.options.getString('pubkey').trim();
    await interaction.deferReply();

    try {
      let hex = input;
      let npub = input;

      // ✅ npub形式ならHexにデコード
      if (input.startsWith('npub')) {
        const decoded = nip19.decode(input);
        if (decoded.type === 'npub') {
          hex = decoded.data;
        } else {
          throw new Error('npub以外の形式が指定されています');
        }
      }

      // ✅ Hexが渡された場合はnpubに変換
      if (!input.startsWith('npub')) {
        try {
          npub = nip19.npubEncode(hex);
        } catch {
          npub = hex; // エンコード失敗時はそのまま
        }
      }

      const profile = await getProfile(hex);
      const embed = new EmbedBuilder()
        .setTitle('👤 Nostrプロフィール情報')
        .addFields(
          { name: 'displayName', value: profile.displayName || '不明', inline: true },
          { name: 'name', value: profile.name || '不明', inline: true },
          { name: 'nip05', value: profile.nip05 || '未登録', inline: true },
          { name: 'pubkey (npub)', value: npub },
          { name: 'pubkey (hex)', value: hex }
        )
        .setThumbnail(profile.picture || 'https://via.placeholder.com/100')
        .setColor(0x3366CC)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await logError(client, 'fatal', 'プロフィール取得エラー', err.message);
      await interaction.editReply(`⚠️ プロフィール取得に失敗しました: \`${input}\``);
    }
  }
}
