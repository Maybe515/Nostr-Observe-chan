import { addKeyword, getKeywordList } from '../../nostr/keyword.js';

export function handleAddKeyword(interaction) {
  const keyword = interaction.options.getString('keyword').trim();
  if (!keyword) return interaction.reply('❌ キーワードが空です');

  const existing = getKeywordList();
  if (existing.includes(keyword)) {
    return interaction.reply(`⚠️ すでに登録済み: "${keyword}"`);
  }

  addKeyword(keyword);
  interaction.reply(`✅ キーワードを追加しました: "${keyword}"`);
}
