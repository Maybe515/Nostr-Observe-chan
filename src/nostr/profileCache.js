// kind:0 イベントからプロフィールを解析・キャッシュ
const profileMap = new Map();       // pubkey → profile情報

export function updateProfile(event) {
  if (event.kind !== 0 || !event.pubkey || !event.content) return;

  try {
        const content = JSON.parse(event.content);
        const profile = {
            nip05: content.nip05 || event.pubkey,
            picture: content.picture || null,
            display_name: content.display_name || null,
            name: content.name || null,
            about: content.about || null
        };
        profileMap.set(event.pubkey, profile);
        console.log('✅ プロフィール保存:', event.pubkey, profile);     // デバッグ用
        
    } catch (err) {
        console.log(`-----`);
        console.error('❌ プロフィール解析失敗:', err);
        console.log('📄 content:', event.content);      // デバッグ用
    }
}

export function getProfile(pubkey) {
    return profileMap.get(pubkey) || {
        nip05: pubkey,
        picture: null,
        display_name: null,
        name: null,
        about: null
    };
}

export function getDisplayName(pubkey) {
  const profile = getProfile(pubkey);
  return (
    profile.display_name?.trim() ||
    profile.name?.trim() ||
    profile.nip05?.trim() ||
    pubkey
  );
}

export function isProfileCached(pubkey) {
  return profileMap.has(pubkey);    // チェック関数
}