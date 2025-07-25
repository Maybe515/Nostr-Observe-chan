import { getKeywords, updateKeywords } from '../utils/configCache.js';

export default {
  data: {
    name: 'keyword-add',
    description: 'キーワードを追加します',
    options: [{
      name: 'word',
      type: 3,
      description: '追加するキーワード',
      required: true
    }]
  },
  async execute(interaction) {
    const word = interaction.options.getString('word').trim();
    if (!word) {
      return interaction.reply('⚠️ 有効なキーワードを入力してください');
    }

    const keywords = getKeywords();
    if (keywords.includes(word)) {
      return interaction.reply(`⚠️ すでに登録されています: \`${word}\``);
    }

    const updated = [...keywords, word];
    updateKeywords(updated);

    await interaction.reply(`✅ キーワードを追加しました: \`${word}\``);
  }
}
