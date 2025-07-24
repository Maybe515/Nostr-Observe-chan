import loadKeywords from '../utils/keywordLoader.js';

export default {
  data: {
    name: 'keyword-list',
    description: '監視キーワード一覧を表示します'
  },
  async execute(interaction) {
    const keywords = loadKeywords();
    const list = keywords.length ? keywords.join(', ') : '（登録なし）';
    await interaction.reply(`📋 現在のキーワード: ${list}`);
  }
}
