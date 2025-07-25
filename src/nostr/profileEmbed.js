import { nip19, SimplePool } from 'nostr-tools';
import { EmbedBuilder } from 'discord.js';
import { getRelays } from '../utils/configCache.js';

const pool = new SimplePool();

/**
 * タイムアウト付きPromiseラッパー
 * @param {Promise} promise
 * @param {number} ms - ミリ秒
 * @returns {Promise}
 */
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`⏱️ ${ms / 1000}秒以内に応答がありませんでした`));
    }, ms);

    promise
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function fetchProfile(pubkey) {
  return withTimeout(
    new Promise((resolve, reject) => {
      let resolved = false;
      const RELAY_URLS = getRelays();
      const sub = pool.sub(RELAY_URLS, [{kinds: [0], authors: [pubkey]}]);

      sub.on('event', event => {
        if (resolved) return;
        resolved = true;
        sub.unsub();
        try {
          const metadata = JSON.parse(event.content);
          resolve(metadata);
        } catch {
          resolve({ name: '取得失敗', display_name: '取得失敗', picture: '', nip05: '' });
        }
      });

      sub.on('eose', () => {
        if (resolved) return;
        resolved = true;
        console.warn(`📭 ${pubkey} に関連するイベントが見つかりませんでした`);
        sub.unsub();
        reject(new Error('プロフィールが見つかりませんでした'));
      });

      sub.on('error', err => {
        if (resolved) return;
        resolved = true;
        sub.unsub();
        reject(new Error('リレー接続エラー: ' + err.message));
      });
    }),
    5000 // ← 5秒タイムアウト
  );
}

export async function createProfileEmbed(inputPubkey) {
  let hex = inputPubkey;
  let npub = inputPubkey;

  if (inputPubkey.startsWith('npub')) {
    const decoded = nip19.decode(inputPubkey);
    if (decoded.type === 'npub') {
      hex = decoded.data;
    }
  } else {
    try {
      npub = nip19.npubEncode(hex);
    } catch {
      npub = hex;
    }
  }

  try{
    const profile = await fetchProfile(hex);
    const UserName = profile.display_name || '不明';
    const profileURL = `https://nostter.app/${npub}`;
    return new EmbedBuilder()
      .setTitle('👤 Nostr プロフィール')
      .addFields(
        { name: '表示名 (display_name)' , value: `[${UserName}](${profileURL})`, inline: true },
        { name: '名前 (name)', value: profile.name || '未登録', inline: true },
        { name: 'nip05', value: profile.nip05 || '未登録', inline: true },
        { name: 'pubkey (npub)', value: `\`${npub}\`` },
        { name: 'pubkey (hex)', value: `\`${hex}\`` }
      )
      .setThumbnail(profile.picture || 'https://via.placeholder.com/100')
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