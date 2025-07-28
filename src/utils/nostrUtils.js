import { SimplePool } from 'nostr-tools';
import { getRelays } from '../config/configCache.js';
import { getProfile, setProfile, hasProfile } from './profileCache.js';

const pool = new SimplePool();

/**
 * タイムアウト付きPromiseラッパー
 * @param {Promise} promise
 * @param {number} ms - ミリ秒
 * @returns {Promise}
 */
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`⏱️ ${ms / 1000}秒以内に応答がありませんでした`)), ms);
    promise.then(r => (clearTimeout(timer), resolve(r))).catch(e => (clearTimeout(timer), reject(e)));
  });
}

export async function fetchProfile(pubkey) {
  if (hasProfile(pubkey)) return getProfile(pubkey);

  const RELAY_URLS = getRelays();
  return withTimeout(
    new Promise((resolve, reject) => {
      let resolved = false;
      const sub = pool.sub(RELAY_URLS, [{kinds: [0], authors: [pubkey]}]);

      sub.on('event', event => {
        if (resolved) return;
        resolved = true;
        sub.unsub();
        try {
          const metadata = JSON.parse(event.content);
          setProfile(pubkey, metadata);
          queueMicrotask(() => resolve(metadata));
        } catch {
          reject(new Error('[event] プロフィールの解析に失敗しました'));
        }
      });

      sub.on('eose', () => {
        if (resolved) return;
        resolved = true;
        console.warn(`📭 ${pubkey} に関連するイベントが見つかりませんでした`);
        sub.unsub();
        reject(new Error('[eose] プロフィールが見つかりませんでした'));
      });

      sub.on('error', err => {
        if (resolved) return;
        resolved = true;
        sub.unsub();
        reject(new Error('[error] リレー接続エラー: ' + err.message));
      });
    }),
    5000 // ← 5秒タイムアウト
  );
}