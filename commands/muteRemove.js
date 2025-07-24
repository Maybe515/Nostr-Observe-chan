import fs from 'fs';
import path from 'path';
import { nip19 } from 'nostr-tools';

export default {
  data: {
    name: 'mute-remove',
    description: '指定したpubkeyのミュートを解除します',
    options: [{
      name: 'pubkey',
      type: 3,
      description: '解除するユーザーのpubkey（hex or npub）',
      required: true
    }]
  },
  async execute(interaction) {
    let input = interaction.options.getString('pubkey').trim();
    let hex = input;

    // npub形式なら変換
    if (input.startsWith('npub')) {
      try {
        const decoded = nip19.decode(input);
        if (decoded.type === 'npub') hex = decoded.data;
      } catch {
        return interaction.reply(`⚠️ npub形式の変換に失敗しました: \`${input}\``);
      }
    }

    const filePath = path.join('config', 'muted.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    let muted = json.muted || [];

    if (!muted.includes(hex)) {
      return interaction.reply(`⚠️ ミュートされていません: ${hex}`);
    }

    muted = muted.filter(p => p !== hex);
    fs.writeFileSync(filePath, JSON.stringify({ muted }, null, 2));
    await interaction.reply(`🔔 ミュート解除完了: ${hex}`);
  }
}
