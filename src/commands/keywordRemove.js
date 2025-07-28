import { getKeywords, updateKeywords } from '../config/configCache.js';

export default {
  data: {
    name: 'keyword-remove',
    description: 'キーワードを削除します',
    options: [{
      name: 'word',
      type: 3,
      description: '削除するキーワード',
      required: true
    }]
  },
  async execute(interaction) {
    const word = interaction.options.getString('word').trim();
    const keywords = getKeywords();
    if (!keywords.includes(word)) {
      return interaction.reply(`⚠️ 指定されたキーワードは存在しません: \`${word}\``);
    }

    const updated = keywords.filter(k => k !== word);
    updateKeywords(updated);

    await interaction.reply(`🗑️ キーワードを削除しました: \`${word}\``);
  }
}
