import fs from 'fs';
import path from 'path';
import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const logPath = path.resolve('logs/Error.log');

export function logError(message, error = null, discordClient = null) {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ${message}` + (error ? `\n${error.stack || error}` : '') + '\n';

  // ローカルログ保存
  fs.appendFile(logPath, errorMessage, (err) => {
    if (err) console.error('❌ ログ書き込み失敗:', err);
  });

  // コンソール出力
  console.error('⚠️ エラー:', message);
  if (error) console.error(error);

  // Discord通知（任意）
  if (discordClient) {
    const embed = new EmbedBuilder()
      .setTitle('🚨 Botエラー通知')
      .setDescription(message)
      .addFields(
        { name: '発生時刻', value: timestamp },
        { name: '詳細', value: error?.message || '詳細不明' }
      )
      .setColor(0xff0000)
      .setTimestamp();

    discordClient.channels.fetch(process.env.SYSTEM_LOG_CHANNEL_ID)
      .then(channel => channel.send({ embeds: [embed] }))
      .catch(err => console.error('❌ Discord通知失敗:', err));
  }
}
