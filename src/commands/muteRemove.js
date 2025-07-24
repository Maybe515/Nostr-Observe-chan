import fs from 'fs';
import path from 'path';

export default {
  data: {
    name: 'mute-remove',
    description: '指定したpubkeyのミュートを解除します',
    options: [{
      name: 'pubkey',
      type: 3,
      description: '解除するユーザーのpubkey',
      required: true
    }]
  },
  async execute(interaction) {
    const pubkey = interaction.options.getString('pubkey').trim();
    const filePath = path.join('config', 'muted.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    let muted = json.muted || [];

    if (!muted.includes(pubkey)) {
      return interaction.reply(`⚠️ ミュートされていません: ${pubkey}`);
    }

    muted = muted.filter(p => p !== pubkey);
    fs.writeFileSync(filePath, JSON.stringify({ muted }, null, 2));
    await interaction.reply(`🔔 ミュート解除完了: ${pubkey}`);
  }
}
