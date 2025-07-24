import fs from 'fs';
import path from 'path';

export default {
  data: {
    name: 'mute-add',
    description: '指定したpubkeyを通知ミュートに追加します',
    options: [{
      name: 'pubkey',
      type: 3,
      description: 'ミュートするユーザーのpubkey',
      required: true
    }]
  },
  async execute(interaction) {
    const pubkey = interaction.options.getString('pubkey').trim();
    const filePath = path.join('config', 'muted.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    const muted = json.muted || [];

    if (muted.includes(pubkey)) {
      return interaction.reply(`⚠️ すでにミュートされています: ${pubkey}`);
    }

    muted.push(pubkey);
    fs.writeFileSync(filePath, JSON.stringify({ muted }, null, 2));
    await interaction.reply(`🔇 ミュート追加完了: ${pubkey}`);
  }
}
