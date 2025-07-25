import { createProfileEmbed } from '../nostr/profileEmbed.js';

export default {
  data: {
    name: 'profile-show',
    description: '指定したpubkeyのプロフィールを表示します',
    options: [{
      name: 'pubkey',
      type: 3,
      description: 'pubkey（hex or npub）',
      required: true
    }]
  },
  async execute(interaction) {
    const input = interaction.options.getString('pubkey').trim();
    await interaction.deferReply();

    try {
      const embed = await createProfileEmbed(input, interaction.user);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ プロフィール取得エラー:', error.message);
      await interaction.editReply(`⚠️ プロフィール取得に失敗しました: \`${input}\``);
    }
  }
}
