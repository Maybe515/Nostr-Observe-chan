# Nostrを見守る優秀なオペレーター、のすとら監視ちゃん！
Nostrのkind:1イベントを監視し、キーワード検出時にDiscordへEmbed通知するBotです。<br>
スラッシュコマンド制御の機能も備えています。<br>
<br>

## 機能一覧
- キーワード検出によるイベント通知
- システムエラーをログチャンネルへ通知
- リレー接続管理（接続失敗時に再接続試行）
- Nostrプロフィールの取得（pubkey, nip05, display_name, picture）
- スラッシュコマンドによるBot設定操作
  - リレー管理（追加・削除） 
  - キーワード管理（追加・削除）
  - ユーザーミュート機能（追加・解除）
  - 指定した秒数の間、通知を一時停止・解除
  - 通知メッセージを一括削除（最大100件/回）
<br>

## 開発環境
- Windows 11 Pro（23H2）
- Visual Studio Code　v1.102.1（user setup）
- npm　v10.9.2
- Node.js　v22.17.1（v20+ 推奨）
- discord.js　v14.21.0（v14+ 必須）
- nostr-tools　v1.17.0
- dotenv　v16.3.1
- ws　v8.18.3
<br>

## ディレクトリ構成
```
📂 nostr-observe-chan/
├── 📂 src/
│   ├── 📂 assets/              # 通知に使う画像など
│   ├── 📂 commands/            # スラッシュコマンド群
│   ├── 📂 config/              # JSON形式の設定ファイル
│   │   ├── configCache.js          # 設定のキャッシュ・読み書き
│   │   └── sendNotification.json         # Embed通知の整形・送信処理
│   ├── 📂 notify/
│   │   ├── errorNotification.js    # エラーログEmbed通知
│   │   └── sendNotification.js         # キーワード検出用のEmbed通知の整形・送信処理
│   ├── 📂 nostr/
│   │   ├── profileEmbed.js          # プロフィール表示用のEmbed通知の整形
│   │   └── subscribeEvents.js      # Nostr購読・通知フィルタ処理
│   ├── 📂 utils/
│   │   ├── dedup.js            # 重複イベント検知
│   │   ├── imageUploader.js    # アバター画像アップロード
│   │   ├── nostrUtils.js         # 
│   │   ├── profileCache.js            # プロフィールのキャッシュ
│   │   ├── relayLoader.js      # リレーの再接続制御
│   │   └── textFormat.js      # Embed通知に表示させるテキストの整形
│   └── index.js                # Botの起動処理（エントリポイント）
├── 📄 .env                     # トークンやIDの環境変数
└── 📄 README.md
```
<br>

## 必要な環境変数（.env）
```env
DISCORD_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CHANNEL_ID=123456789012345678
ERROR_CHANNEL_ID=987654321098765432
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
|`/mute-add`|`pubkey`(hex or npub)|ミュート追加
|`/mute-remove`|`pubkey`(hex or npub)|ミュート解除
|`/mute-list`|-|ミュート対象一覧表示
|`/profile-show`|`pubkey`(hex or npub)|pubkeyからプロフィール取得
|`/embed-clear`|-|Embedメッセージ一括削除
|`/snooze`|`seconds`|通知一時停止（秒指定）
|`/snooze-cancel`|-|通知停止を即時解除
<br>

## 起動方法
以下コマンドをルートディレクトリで実行。<br>
もしくは`Launch.bat`をルートディレクトリで実行。
```
npm install
npm start
```
<br>

## トラブルシューティング
正常に動作しない場合は以下を実施すると改善されることがあります。
- nostr-toolsを安定したバージョンに変更する（v1.14.0）
- パッケージを入れ直す
- package-lock.jsonをリセットする

