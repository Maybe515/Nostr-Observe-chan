import fs from 'fs';
import path from 'path';
import { nip19 } from 'nostr-tools';

export default {
  data: {
    name: 'mute-add',
    description: '指定したpubkeyを通知ミュートに追加します',
    options: [{
      name: 'pubkey',
      type: 3,
      description: 'ミュートするユーザーのpubkey（hex or npub）',
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
    const muted = json.muted || [];

    if (muted.includes(hex)) {
      return interaction.reply(`⚠️ すでにミュートされています: ${hex}`);
    }

    muted.push(hex);
    fs.writeFileSync(filePath, JSON.stringify({ muted }, null, 2));
    await interaction.reply(`🔇 ミュート追加完了: ${hex}`);
  }
}
