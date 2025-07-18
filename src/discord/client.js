import { Client, GatewayIntentBits } from 'discord.js';
import { logError } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN=process.env.DISCORD_TOKEN

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

discordClient.once('ready', () => {
  console.log(`🤖 Logged in as ${discordClient.user.tag}`);
});

await discordClient.login(TOKEN);

// エラーログ出力
try {
  await discordClient.login(TOKEN);
} catch (err) {
  logError('Discordログイン失敗', err);
}