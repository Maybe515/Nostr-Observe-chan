import { nip19 } from 'nostr-tools';
import { getMuted, updateMuted } from '../utils/configCache.js';

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

    // ✅ npub形式ならHexへ変換
    if (input.startsWith('npub')) {
      try {
        const decoded = nip19.decode(input);
        if (decoded.type === 'npub') {
          hex = decoded.data;
        } else {
          return interaction.reply(`⚠️ 入力形式は npub または hex を指定してください`);
        }
      } catch {
        return interaction.reply(`⚠️ npub の変換に失敗しました: \`${input}\``);
      }
    }

    const muted = getMuted();
    if (!muted.includes(hex)) {
      return interaction.reply(`⚠️ ミュートされていません: ${hex}`);
    }
    const updated = muted.filter(p => p !== hex);
    updateMuted(updated);
    await interaction.reply(`🔔 ミュート解除完了: ${hex}`);
  }
}
