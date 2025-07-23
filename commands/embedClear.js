export default {
  data: {
    name: 'embed-clear',
    description: 'このチャンネル内のEmbedメッセージを一括で削除します'
  },
  async execute(interaction) {
    const channel = interaction.channel;
    await interaction.deferReply({ ephemeral: true });

    try {
      let deletedCount = 0;

      // メッセージ履歴を取得（最大100件）
      const messages = await channel.messages.fetch({ limit: 100 });

      // Embedメッセージのみ抽出
      const embedMessages = messages.filter(msg => msg.embeds.length > 0 && msg.author?.bot);

      for (const [id, msg] of embedMessages) {
        await msg.delete().catch(() => {});
        deletedCount++;
      }

      await interaction.editReply(`🧹 Embedメッセージを ${deletedCount} 件削除しました`);
    } catch (error) {
      console.error('❌ Embed削除エラー:', error.message);
      await interaction.editReply('⚠️ 削除中にエラーが発生しました');
    }
  }
}
