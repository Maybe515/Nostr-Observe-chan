import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data/muted.json');
let mutedPubkeys = [];

export function loadMuted() {
  try {
    mutedPubkeys = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    mutedPubkeys = [];
  }
}

function saveMuted() {
  fs.writeFileSync(filePath, JSON.stringify(mutedPubkeys, null, 2));
}

export function muteUser(pubkey) {
  if (!mutedPubkeys.includes(pubkey)) {
    mutedPubkeys.push(pubkey);
    saveMuted();
  }
}

export function unmuteUser(pubkey) {
  const index = mutedPubkeys.indexOf(pubkey);
  if (index !== -1) {
    mutedPubkeys.splice(index, 1);
    saveMuted();
  }
}

export function isMuted(pubkey) {
  return mutedPubkeys.includes(pubkey);
}

export function getMutedList() {
  return [...mutedPubkeys];
}
