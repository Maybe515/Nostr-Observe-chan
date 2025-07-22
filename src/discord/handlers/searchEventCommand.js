import { getRecentEvents } from '../../nostr/eventCache.js';

export function handleSearchEvent(interaction) {
  const keyword = interaction.options.getString('keyword');
  const events = getRecentEvents().filter(e => e.content.includes(keyword));

  if (events.length === 0) {
    return interaction.reply(`🔍 「${keyword}」に一致するイベントは見つかりませんでした`);
  }

  const summary = events.slice(0, 5).map((e, i) => `#${i + 1} ${e.content.slice(0, 100)}...`).join('\n');
  interaction.reply(`📄 検索結果（最大5件）:\n${summary}`);
}
