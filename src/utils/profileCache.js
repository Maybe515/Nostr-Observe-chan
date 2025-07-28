const profileCache = new Map();

export function getProfile(pubkey) {
  return profileCache.get(pubkey);
}

export function setProfile(pubkey, profile) {
  profileCache.set(pubkey, profile);
}

export function hasProfile(pubkey) {
  return profileCache.has(pubkey);
}

export function clearProfile(pubkey) {
  pubkey ? profileCache.delete(pubkey) : profileCache.clear();
}
