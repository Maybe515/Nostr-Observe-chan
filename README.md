## 概要
Nostrのkind:1イベントを監視して、特定のキーワードが検出された時にDiscordのテキストチャンネルへEmbed形式で通知するbot<br>
<br>

## 開発環境
- Windows11 Pro (23H2)
- Visual Studio Code　v1.102.0
- Node.js　v22.17.1
- npm　v10.9.2
- discord.js　v14.13.0
- nostr-tools　v1.15.0
- dotenv　v16.3.1
<br>

## コマンド
|コマンド|引数|説明|
:-:|:-:|:-:
|`/profile`|`pubkey`|プロフィールを表示する|
|`/add-keyword`|`keyword`|検出対象のキーワードを追加|
|`/remove-keyword`|`keyword`|検出対象のキーワードを削除|
|`/list-keywords`|-|検出対象のキーワード一覧を表示|
|`/mute`|`pubkey`|指定ユーザーをミュートにする|
|`/unmute`|`pubkey`|指定ユーザーのミュートを解除する|
|`/list-muted`|-|ミュート中のユーザー一覧を表示する|
|`/relays`|-|接続中のリレー一覧を表示|
|`/status`|`pubkey(省略可)`|接続中のリレー一覧を表示|
|`/uptime`|-|Botの稼働時間を表示|
|`/ping`|-|応答確認|
|`/version`|-|バージョンを表示|
<!--|`/search-event`|`keyword`|イベントの検索結果を表示|-->
<br>

## 更新履歴
2025.07.18　新規作成
