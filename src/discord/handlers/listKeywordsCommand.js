import { getKeywordList } from '../../nostr/keyword.js';

export function handleListKeywords(interaction) {
  const keywords = getKeywordList();
  if (keywords.length === 0) {
    return interaction.reply('🔍 検出対象のキーワードは登録されていません');
  }

  interaction.reply(`📘 検出キーワード一覧:\n${keywords.map(k => `• ${k}`).join('\n')}`);
}
