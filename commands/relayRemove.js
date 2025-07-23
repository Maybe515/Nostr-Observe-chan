import fs from 'fs';
import path from 'path';

export default {
  data: {
    name: 'relay-remove',
    description: '登録済みのリレーURLを削除します',
    options: [{
      name: 'url',
      type: 3, // STRING
      description: '削除するリレーURL（wss://〜）',
      required: true
    }]
  },
  async execute(interaction) {
    const url = interaction.options.getString('url').trim();

    const filePath = path.join('config', 'relays.json');
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let relays = json.relays || [];

    if (!relays.includes(url)) {
      return interaction.reply(`⚠️ 登録されていないURLです: ${url}`);
    }

    relays = relays.filter(r => r !== url);
    fs.writeFileSync(filePath, JSON.stringify({ relays }, null, 2));
    await interaction.reply(`🗑️ リレー削除完了: ${url}`);
  }
}
