const profileCache = new Map();

/**
 * プロフィールを取得（キャッシュあり）
 * @param {string} pubkey - Nostrの公開鍵
 * @param {Function} fetchFn - プロフィール取得関数（非同期）
 * @returns {Promise<Object>} - プロフィールデータ
 */
export async function getProfile(pubkey, fetchFn) {
  if (profileCache.has(pubkey)) {
    return profileCache.get(pubkey);
  }

  const profile = await fetchFn(pubkey);
  profileCache.set(pubkey, profile);
  return profile;
}

/**
 * キャッシュをクリア（特定pubkeyまたは全体）
 * @param {string} [pubkey] - 指定があればそのpubkeyのみ削除
 */
export function clearProfileCache(pubkey) {
  if (pubkey) {
    profileCache.delete(pubkey);
  } else {
    profileCache.clear();
  }
}
