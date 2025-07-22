import { muteUser, isMuted } from '../../nostr/muteManager.js';

export function handleMute(interaction) {
  const pubkey = interaction.options.getString('pubkey').trim();
  if (!pubkey) return interaction.reply('❌ 公開鍵が空です');

  if (isMuted(pubkey)) {
    return interaction.reply(`🔕 すでにミュートされています: ${pubkey}`);
  }

  muteUser(pubkey);
  interaction.reply(`🔇 ユーザーをミュートしました: ${pubkey}`);
}
