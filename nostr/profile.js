import { SimplePool } from 'nostr-tools';
import loadRelays from '../utils/relayLoader.js';

const pool = new SimplePool();
const RELAY_URLS = loadRelays();

export default async function getProfile(pubkey) {
  return new Promise((resolve) => {
    const sub = pool.sub(RELAY_URLS, [{ kinds: [0], authors: [pubkey] }]);
    sub.on('event', (event) => {
      try {
        const json = JSON.parse(event.content);
        resolve({
          displayName: json.display_name || json.name || '名無し',
          nip05: json.nip05 || '未登録',
          picture: json.picture || null
        });
      } catch {
        resolve({ displayName: '不明', nip05: '不明', picture: null });
      }
      sub.unsub();
    });
    setTimeout(() => resolve({ displayName: '不明', nip05: '不明', picture: null }), 2000);
  });
}
