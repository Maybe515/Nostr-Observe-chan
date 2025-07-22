import { unmuteUser, isMuted } from '../../nostr/muteManager.js';

export function handleUnmute(interaction) {
  const pubkey = interaction.options.getString('pubkey').trim();
  if (!isMuted(pubkey)) {
    return interaction.reply(`🔔 ミュートされていません: ${pubkey}`);
  }

  unmuteUser(pubkey);
  interaction.reply(`✅ ミュートを解除しました: ${pubkey}`);
}
