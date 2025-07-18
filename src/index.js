import { connectRelay } from './nostr/relay.js';
import { matchKeyword } from './nostr/keywordFilter.js';
import { discordClient } from './discord/client.js';
import { sendNotification } from './discord/notifier.js';

connectRelay(async (event) => {
  const keyword = matchKeyword(event.content);
  if (keyword) {
    console.log(`🔍 キーワード「${keyword}」検出`);
    await sendNotification(discordClient, event.content, event.pubkey, keyword);
  }
});
