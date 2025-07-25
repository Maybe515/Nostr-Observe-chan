import { getMuted } from '../utils/configCache.js';

export default {
  data: {
    name: 'mute-list',
    description: '現在ミュート中のpubkey一覧を表示します'
  },
  async execute(interaction) {
    const muted = getMuted();
    if (muted.length === 0) {
      return interaction.reply('📭 ミュート対象はありません');
    }

    const list = muted.map((p, i) => `${i + 1}. \`${p}\``).join('\n');
    await interaction.reply(`🔕 ミュート対象一覧:\n${list}`);
  }
}
