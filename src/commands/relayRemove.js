import { getRelays, updateRelays } from '../config/configCache.js';

export default {
  data: {
    name: 'relay-remove',
    description: 'リレーURLを削除します',
    options: [{
      name: 'url',
      type: 3,
      description: '削除するリレーのURL（例: wss://example.com）',
      required: true
    }]
  },
  async execute(interaction) {
    const url = interaction.options.getString('url').trim();
    const relays = getRelays();

    if (!relays.includes(url)) {
      return interaction.reply(`⚠️ 指定されたリレーは登録されていません: \`${url}\``);
    }

    const updated = relays.filter(r => r !== url);
    updateRelays(updated);

    await interaction.reply(`🗑️ リレーを削除しました: \`${url}\``);
  }
}
