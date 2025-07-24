import fs from 'fs';
import path from 'path';

export default {
  data: {
    name: 'keyword-add',
    description: '新しいキーワードを監視リストに追加します',
    options: [{
      name: 'word',
      type: 3, // STRING
      description: '追加するキーワード',
      required: true
    }]
  },
  async execute(interaction) {
    const keyword = interaction.options.getString('word').trim().toLowerCase();

    const filePath = path.join('config', 'keywords.json');
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keywords = json.keywords || [];

    if (keywords.includes(keyword)) {
      return interaction.reply(`⚠️ キーワード「${keyword}」はすでに登録されています`);
    }

    keywords.push(keyword);
    fs.writeFileSync(filePath, JSON.stringify({ keywords }, null, 2));
    await interaction.reply(`✅ キーワード「${keyword}」を追加しました`);
  }
}
