import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

discordClient.once('ready', () => {
  console.log(`🤖 Logged in as ${discordClient.user.tag}`);
});

await discordClient.login(process.env.DISCORD_TOKEN);
