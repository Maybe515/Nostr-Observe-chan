import { getMutedList } from '../../nostr/muteManager.js';

export function handleListMuted(interaction) {
  const list = getMutedList();
  if (list.length === 0) {
    return interaction.reply('🙌 ミュート中のユーザーはいません');
  }

  const display = list.map((pubkey, i) => `#${i + 1}: \`${pubkey}\``).join('\n');
  interaction.reply(`🔕 現在ミュートされているユーザー一覧:\n${display}`);
}
