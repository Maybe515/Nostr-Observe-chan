# nostr-observe-chan
Nostr上のイベントを監視し、キーワード検出時にDiscordへEmbed通知するBotです。<br>
プロフィール取得・画像アップロード・通知整形・スラッシュコマンド制御など、多彩な機能を備えています。<br>
<br>

## 機能一覧
- キーワード検出によるイベント通知（kind:1）
- Nostrプロフィールの取得（nip05, display_name）
- ローカル画像をDiscordへアップロードし通知Embedで使用
- pubkeyごとの通知ミュート機能
- リレー接続管理（追加・削除・接続試行上限）
- スラッシュコマンドによるBot設定操作
- `/embed-clear` で通知メッセージを一括削除
- システムエラーをEmbed形式でログチャンネルへ通知
- `/snooze` で通知を一時停止・解除
<br>

## 開発環境
- Windows 11 Pro (23H2)
- Visual Studio Code: 1.102.1 (user setup)
- npm v10.9.2
- Node.js v22.17.1      ※v20+ 推奨
- discord.js v14.21.0   ※v14+ 必須
- nostr-tools v1.17.0
- dotenv v16.3.1
- ws v8.18.3
<br>

## 📁 ディレクトリ構成
📂 nostr-observe-chan/
 ├── assets/    # 通知に使う画像類
 ├── commands/  # スラッシュコマンド群
 ├── config/
 │    ├── keywords.json  # 検出対象キーワード 
 │    ├── relays.json    # Nostrリレー一覧 
 │    └── muted.json     # ミュート対象pubkey一覧 
 ├── discord/ 
 │    └── notifier.js    # Embed通知の整形・送信 
 ├── nostr/ 
 │    ├── nostrClient.js # イベント購読・フィルタ処理 
 │    └── profile.js     # pubkey → プロフィール取得 
 ├── utils/ 
 │    ├── imageUploader.js  # ローカル画像アップロード
 │    ├── errorNotifier.js  # エラーEmbed通知 
 │    ├── muteList.js       # ミュート情報読み込み 
 │    ├── dedup.js          # 重複検知 
 │    └── relayLoader.js    # リレーの再接続制御 
 ├── index.js       # メイン起動エントリ 
 ├── .env           # Discord設定情報（TOKENなど） 
 └── README.md
<br>

## 必要な環境変数（.env）
```env
DISCORD_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CHANNEL_ID=123456789012345678
ERROR_CHANNEL_ID=987654321098765432
CLIENT_ID=123456789012345678
```
<br>

## 利用可能なスラッシュコマンド一覧
|コマンド名|引数|説明|
:-:|:-:|:-:
|`/ping`|-|Bot応答確認
|`/keyword-add`|`word`|キーワード追加
|`/keyword-remove`|`word`|キーワード削除
|`/keyword-list`|-|キーワード一覧表示
|`/relay-add`|`Relay URL`(wss://～)|リレー追加
|`/relay-remove`|`Relay URL`(wss://～)|リレー削除
|`/relay-list`|-|リレー一覧表示
|`/mute-add`|`pubkey`(HEX or npub)|pubkeyミュート追加
|`/mute-remove`|`pubkey`(HEX or npub)|ミュート解除
|`/mute-list`|-|ミュート対象一覧表示
|`/profile-show`|`pubkey`(HEX or npub)|pubkeyからプロフィール取得
|`/embed-clear`|-|Embedメッセージ一括削除
|`/snooze`|`seconds`|通知一時停止（秒指定）
|`/snooze-cancel`|-|通知停止を即時解除
<br>

## 起動方法
以下コマンドをルートディレクトリで実行
```Bash
npm install
npm start
```
