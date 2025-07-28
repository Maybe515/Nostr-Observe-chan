import { getRelays } from '../config/configCache.js';

export default {
  data: {
    name: 'relay-list',
    description: '現在の接続リレー一覧を表示します'
  },
  async execute(interaction) {
    const relays = getRelays();
    if (!Array.isArray(relays) || relays.length === 0) {
      return interaction.reply('📭 登録されたリレーはありません');
    }

    const formatted = relays.map((r, i) => `${i + 1}. \`${r}\``).join('\n');
    await interaction.reply(`📡 現在のリレー一覧:\n${formatted}`);
  }
}
