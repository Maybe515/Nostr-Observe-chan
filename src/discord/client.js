// Discord Bot のインスタンス生成とログイン処理
import { Client, GatewayIntentBits } from 'discord.js';
import { logError } from '../utils/logger.js';

import dotenv from 'dotenv';
dotenv.config();

const TOKEN=process.env.DISCORD_TOKEN

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

export async function startClient() {
  await discordClient.login(process.env.TOKEN);
  console.log(`🤖 Logged in as ${discordClient.user.tag}`);

  try {
    await discordClient.login(TOKEN);
  } catch (err) {
    logError('Discordログイン失敗', err);   // エラーログ出力
  }
}