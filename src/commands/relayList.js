import loadRelaysWithReconnect from '../utils/relayLoader.js';

export default {
  data: {
    name: 'relay-list',
    description: '接続中のリレー一覧を表示します'
  },
  async execute(interaction) {
    const relays = loadRelaysWithReconnect();
    const list = relays.length ? relays.join('\n') : '（未接続）';
    await interaction.reply(`📡 使用中のリレー:\n${list}`);
  }
}
