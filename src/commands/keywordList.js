import { getKeywords } from '../config/configCache.js';

export default {
  data: {
    name: 'keyword-list',
    description: '監視キーワード一覧を表示します'
  },
  async execute(interaction) {
    const keywords = getKeywords();
    if (keywords.length === 0) {
      return interaction.reply('📭 登録されたキーワードはありません');
    }

    const formatted = keywords.map((k, i) => `${i + 1}. \`${k}\``).join('\n');
    await interaction.reply(`📋 現在のキーワード一覧:\n${formatted}`);
  }
}
