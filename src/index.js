// メインエントリー。Botの起動、コマンド登録、Nostr連携、イベント受信処理の制御塔。
import { connectRelays, requestProfile } from './nostr/relay.js';
import { getDisplayName, getProfile } from './nostr/profileCache.js';
import { isDuplicateEvent } from './nostr/eventCache.js';
import { matchKeyword } from './nostr/keywordFilter.js';
import { loadKeywords } from './nostr/keyword.js';
import { loadMuted } from './nostr/muteManager.js';
import { discordClient, startClient } from './discord/client.js';
import { sendNotification } from './discord/notifier.js';
import { registerCommands } from './discord/registerCommands.js';
import { routeCommand } from './discord/handler.js';
import { loadNotifiedEvents, saveNotifiedEvents } from './utils/persistence.js';
import { logError } from './utils/logger.js';

startClient().then(() => {
  registerCommands(discordClient);
  connectRelays(onNostrEvent);
});

loadKeywords();   // 🔍 キーワードを起動時に読み込み
loadMuted();      // 🔇 ミュートリストを起動時に読み込み

const notifiedEvents = loadNotifiedEvents();    // 起動時に復元

connectRelays(async (event, relay) => {
    try {
        if (isDuplicateEvent(event)) return;     // 取得したイベントが重複している場合スキップする
        const keyword = matchKeyword(event.content);
        if (keyword) {
            const profile = getProfile(event.pubkey);
            const displayName = getDisplayName(event.pubkey);

            // プロフィールが未取得なら明示的にリクエスト
            if (!profile.display_name && !profile.name) {
                requestProfile(relay, event.pubkey);
            }

            await sendNotification(discordClient, event.content, displayName, keyword, profile.picture, displayName, profile.about);
            //console.log('🧾 表示名チェック:', {     // デバッグ用
            //    pubkey: event.pubkey,
            //    display_name: profile.display_name,
            //    name: profile.name,
            //    nip05: profile.nip05,
            //    resolved: displayName
            //});
        }
    } catch (err) {
        logError('イベント処理中のエラー', err, discordClient);
    }
});

// 定期保存（10分ごと）
setInterval(() => {
    saveNotifiedEvents(notifiedEvents);
    console.log(`-----`);
    console.log('💾 通知済みイベントIDを保存しました');
}, 10 * 60 * 1000);

// コマンド受付
discordClient.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    await routeCommand(interaction);
  }
});

function onNostrEvent(event, relay) {
  try {
    if (event.kind !== 1) return;
    if (isDuplicateEvent(event)) return;          // 🔁 通知済みならスキップ

    const keyword = matchKeyword(event.content);
    if (!keyword) return;

    const profile = getProfile(event.pubkey);
    const displayName = getDisplayName(event.pubkey);

    if (!profile.display_name && !profile.name) {
      requestProfile(relay, event.pubkey);
    }

    sendNotification(discordClient, event.content, displayName, keyword, profile.picture, displayName, profile.about);
  } catch (err) {
    console.error('❌ Nostrイベント処理中のエラー:', err);
  }
}