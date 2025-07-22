// スラッシュコマンドをBotに登録
export async function registerCommands(client) {
  const commands = [
    { name: 'profile', description: '指定したNostr公開鍵のプロフィールを表示',
      options: [{name: 'pubkey', description: '対象のNostr公開鍵（hex形式）', type: 3, required: true}] },
    { name: 'add-keyword', description: '通知対象にキーワードを追加', 
        options: [{name: 'keyword', description: '追加するキーワード', type: 3, required: true}] },
    { name: 'remove-keyword', description: '通知対象からキーワードを削除',
        options: [{name: 'keyword', description: '削除するキーワード', type: 3, required: true}] },
    { name: 'list-keywords', description: '検出対象のキーワード一覧を表示' },
    { name: 'search-event', description: 'キーワードで最近のイベントを検索',
      options: [{name: 'keyword', description: '検索するキーワード', type: 3, required: true}] },
    { name: 'mute', description: '指定したユーザーをミュートして通知を抑制する', 
      options: [{name: 'pubkey', description: 'ミュート対象のNostr公開鍵', type: 3, required: true}] },
    { name: 'unmute', description: '指定ユーザーのミュートを解除する',
      options: [{name: 'pubkey', description: '解除対象のNostr公開鍵', type: 3, required: true}] },
    { name: 'list-muted', description: 'ミュート中のユーザー一覧を表示' },
    { name: 'relays', description: '接続中のNostrリレーを表示' },
    { name: 'status', description: 'Botの全体状態や指定ユーザーの通知状態を表示',
      options: [{name: 'pubkey', description: '確認したいNostr公開鍵（省略可能）', type: 3, required: false}] },
    { name: 'uptime', description: 'Botの稼働時間を表示' },
    { name: 'ping', description: 'Botが動作中か確認' },
    { name: 'version', description: 'Botのバージョンを表示' }
  ];

  await client.application.commands.set(commands);
  console.log('✅ コマンド登録完了');
}
