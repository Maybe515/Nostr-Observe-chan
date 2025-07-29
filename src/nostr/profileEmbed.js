import { nip19 } from 'nostr-tools';
import { EmbedBuilder } from 'discord.js';
import { isValidImageURL } from '../utils/embedFormat.js';
import { fetchProfile } from '../utils/nostrUtils.js';

export async function createProfileEmbed(inputPubkey) {
  let hex = inputPubkey;
  let npub = inputPubkey;

  if (inputPubkey.startsWith('npub')) {
    const decoded = nip19.decode(inputPubkey);
    if (decoded.type === 'npub') hex = decoded.data;
  } else {
    try {
      npub = nip19.npubEncode(hex);
    } catch {
      npub = hex;
    }
  }

  try{
    const profile = await fetchProfile(hex);
    const profileURL = `https://nostter.app/${npub}`;
    const display = profile.display_name || '不明';
    const thumbnailUrl = isValidImageURL(profile.picture) ? profile.picture : undefined;
    return new EmbedBuilder()
      .setTitle('👤 Nostr プロフィール')
      .addFields(
        { name: '表示 (display_name)' , value: `[${display}](${profileURL})`, inline: true },
        { name: '名前 (name)', value: profile.name || '未登録', inline: true },
        { name: 'nip05', value: profile.nip05 || '未登録', inline: true },
        { name: 'pubkey (npub)', value: `\`${npub}\`` },
        { name: 'pubkey (hex)', value: `\`${hex}\`` }
      )
      .setThumbnail(thumbnailUrl)
      .setColor(0x3366CC)
      .setTimestamp();
  } catch (err) {
    console.warn(`⚠️ プロフィール取得失敗: ${hex}`, err.message);
    return new EmbedBuilder()
      .setTitle('👤 Nostr プロフィール（取得失敗）')
      .setDescription(`指定されたpubkeyからプロフィールを取得できませんでした。\npubkey: \`${hex}\``)
      .setColor(0xFF3333);
  }
}