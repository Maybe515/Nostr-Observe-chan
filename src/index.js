import { connectRelays, requestProfile } from './nostr/relay.js';
import { matchKeyword } from './nostr/keywordFilter.js';
import { discordClient } from './discord/client.js';
import { sendNotification } from './discord/notifier.js';
import { logError } from './utils/logger.js';
import { loadNotifiedEvents, saveNotifiedEvents } from './utils/persistence.js';
import { getDisplayName, getProfile } from './nostr/profileCache.js';

//const notifiedEvents = loadNotifiedEvents();    // 起動時に復元
const notifiedEvents = new Set();

connectRelays(async (event, relay) => {
    try {
        if (isDuplicate(event)) return;     // 取得したイベントが重複している場合スキップする
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

function isDuplicate(event) {
    if (notifiedEvents.has(event.id)) return true;
    notifiedEvents.add(event.id);
    saveNotifiedEvents(notifiedEvents);     // 通知ごとに保存（永続化）
    return false;
}
