import { relayMap } from '../../nostr/relay.js';

export function handleRelays(interaction) {
  const urls = Array.from(relayMap.keys());
  if (urls.length === 0) {
    return interaction.reply('🔌 リレーに接続されていません');
  }

  interaction.reply(`📡 接続中のリレー:\n${urls.map(url => `• ${url}`).join('\n')}`);
}
