import fs from 'fs';
import path from 'path';

export default {
  data: {
    name: 'relay-add',
    description: '新しいリレーURLを接続リストに追加します',
    options: [{
      name: 'url',
      type: 3, // STRING
      description: '追加するリレーURL（wss://〜）',
      required: true
    }]
  },
  async execute(interaction) {
    const url = interaction.options.getString('url').trim();

    if (!url.startsWith('wss://')) {
      return interaction.reply('⚠️ URLは `wss://` で始めてください');
    }

    const filePath = path.join('config', 'relays.json');
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const relays = json.relays || [];

    if (relays.includes(url)) {
      return interaction.reply(`⚠️ すでに登録済みです: ${url}`);
    }

    relays.push(url);
    fs.writeFileSync(filePath, JSON.stringify({ relays }, null, 2));
    await interaction.reply(`✅ リレー追加完了: ${url}`);
  }
}
