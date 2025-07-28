// utils/errorNotifier.js
import { EmbedBuilder } from 'discord.js';

/**
 * エラーログEmbed通知
 * @param {Client} client - Discordクライアント
 * @param {'fatal' | 'warn' | 'info'} level - エラー種別（色分け）
 * @param {string} title - エラーの概要タイトル
 * @param {string} message - 詳細メッセージ
 */
export async function logError(client, level, title, message) {
  try {
    const channelId = process.env.ERROR_CHANNEL_ID;
    const channel = await client.channels.fetch(channelId);
    if (!channel) throw new Error('エラーログチャンネルが取得できません');

    const colorMap = {
      fatal: 0xFF0000,
      warn: 0xFFFF00,
      info: 0xCCCCCC
    };

    const embed = new EmbedBuilder()
      .setTitle(`❌ ${title}`)
      .setDescription(message?.substring(0, 2000) || '詳細不明')
      .setColor(colorMap[level] ?? 0xCCCCCC)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.warn(`⚠️ エラー通知失敗: ${err.message}`);
  }
}
