import fs from 'fs';
import path from 'path';

const commandsDir = path.resolve('src/discord/handlers');
export const commandMap = {};

// 📄 各コマンドファイルを読み込む
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('Command.js'));

for (const file of commandFiles) {
  const commandPath = path.join(commandsDir, file);
  const module = await import(`file://${commandPath}`);

  // 関数名の推測（例：handlePing → ping）
  const exportKeys = Object.keys(module);
  const handlerKey = exportKeys.find(k => k.startsWith('handle'));
  if (!handlerKey) continue;

  const handler = module[handlerKey];

  // コマンド名を導出（ファイル名または関数名ベース）
  const commandName = file
    .replace('Command.js', '')                              // pingCommand.js → ping
    .replace(/[A-Z]/g, match => '-' + match.toLowerCase())  // searchEvent → search-event
    .replace(/^-/, '');                                     // 先頭のハイフン除去（例: -ping → ping）

  commandMap[commandName] = handler;
}

// 💡 コマンドの振り分け関数
export async function routeCommand(interaction) {
  const name = interaction.commandName;
  const handler = commandMap[name];
  if (!handler) {
    return interaction.reply(`❌ 未対応のコマンドです: ${name}`);
  }

  return handler(interaction);
}
