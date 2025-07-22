import { removeKeyword, getKeywordList } from '../../nostr/keyword.js';

export function handleRemoveKeyword(interaction) {
  const keyword = interaction.options.getString('keyword').trim();
  const existing = getKeywordList();

  if (!existing.includes(keyword)) {
    return interaction.reply(`⚠️ 登録されていないキーワード: "${keyword}"`);
  }

  removeKeyword(keyword);
  interaction.reply(`🗑️ キーワードを削除しました: "${keyword}"`);
}
