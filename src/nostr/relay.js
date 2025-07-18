import { relayInit } from 'nostr-tools';
import dotenv from 'dotenv';
dotenv.config();

export async function connectRelay(onEvent) {
  const relay = relayInit(process.env.RELAY_URL);
  await relay.connect();

  relay.on('connect', () => console.log('✅ Nostr relay connected'));
  relay.on('error', () => console.error('❌ Nostr relay error'));

  const sub = relay.sub([
    { kinds: [1], since: Math.floor(Date.now() / 1000) }
  ]);

  sub.on('event', onEvent);
}
