
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync(new URL('../../../package.json', import.meta.url)));

export function handleVersion(interaction) {
  interaction.reply(`📦 Botのバージョン: v${pkg.version}`);
}
