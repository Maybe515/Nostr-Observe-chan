import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { subscribeEvents } from './nostr/nostrClient.js';
import uploadImage from './utils/imageUploader.js';
import { loadConfig, getKeywords } from './utils/configCache.js';
import { logError } from './utils/errorNotifier.js';

dotenv.config();

// コンフィグファイル読み込み
try{
  loadConfig();
  console.log(`🔧 コンフィグファイル読み込み完了`);
} catch (error) {
  console.error(error);
  await logError(client, 'fatal', 'コンフィグファイル読み込みエラー', error.stack);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

// 🔽 コマンドを読み込む
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const commandsJson = [];

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
  commandsJson.push(command.default.data);
}

client.once('ready', async () => {
  console.log(`✅ Discord logged in as ${client.user.tag}`);

  // 🔽 スラッシュコマンド登録
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),   
      { body: commandsJson }
    );
    console.log('📦 スラッシュコマンド登録完了');
  } catch (error) {
    console.error(error);
    await logError(client, 'fatal', 'スラッシュコマンド登録エラー', error.stack);
  }

  const avatarUrl = await uploadImage(client, process.env.CHANNEL_ID, 'default-avatar.jpg');
  const keywords = getKeywords();
  subscribeEvents(client, keywords, avatarUrl);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await logError(client, 'fatal', 'コマンド実行エラー', error.stack);
    await interaction.reply({ content: '⚠️ コマンド実行中にエラーが発生しました', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
