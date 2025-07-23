export default {
  data: {
    name: 'ping',
    description: 'Botが応答可能かを確認します'
  },
  async execute(interaction) {
    await interaction.reply('🏓 Pong!');
  }
}
