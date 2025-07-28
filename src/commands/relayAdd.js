import { getRelays, updateRelays } from '../config/configCache.js';

export default {
  data: {
    name: 'relay-add',
    description: 'リレーURLを追加します',
    options: [{
      name: 'url',
      type: 3,
      description: '追加するリレーのURL（例: wss://example.com）',
      required: true
    }]
  },
  async execute(interaction) {
    const url = interaction.options.getString('url').trim();
    if (!url.startsWith('wss://')) {
      return interaction.reply('⚠️ 有効なリレーURL（wss://〜）を指定してください');
    }

    const relays = getRelays();
    if (relays.includes(url)) {
      return interaction.reply(`⚠️ すでに登録されています: \`${url}\``);
    }

    const updated = [...relays, url];
    updateRelays(updated);

    await interaction.reply(`✅ リレーを追加しました: \`${url}\``);
  }
}
