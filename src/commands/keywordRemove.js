import fs from 'fs';
import path from 'path';

export default {
  data: {
    name: 'keyword-remove',
    description: '監視リストからキーワードを削除します',
    options: [{
      name: 'word',
      type: 3, // STRING
      description: '削除するキーワード',
      required: true
    }]
  },
  async execute(interaction) {
    const keyword = interaction.options.getString('word').trim().toLowerCase();

    const filePath = path.join('config', 'keywords.json');
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let keywords = json.keywords || [];

    if (!keywords.includes(keyword)) {
      return interaction.reply(`⚠️ キーワード「${keyword}」は登録されていません`);
    }

    keywords = keywords.filter(k => k !== keyword);
    fs.writeFileSync(filePath, JSON.stringify({ keywords }, null, 2));
    await interaction.reply(`🗑️ キーワード「${keyword}」を削除しました`);
  }
}
