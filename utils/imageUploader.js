// utils/imageUploader.js
import path from 'path';
import { AttachmentBuilder } from 'discord.js';

/**
 * Discord にローカル画像をアップロードし、CDN URL を取得する
 * @param {Client} client
 * @param {string} channelId
 * @param {string} fileName - アセットフォルダ内の画像ファイル名
 * @returns {Promise<string|null>}
 */
export default async function uploadImage(client, channelId, fileName) {
  try {
    const filePath = path.join('./assets', fileName);
    const channel = await client.channels.fetch(channelId);
    if (!channel) throw new Error('チャンネルが見つかりません');

    const attachment = new AttachmentBuilder(filePath);
    const message = await channel.send({ files: [attachment] });

    const uploaded = message.attachments.first();
    if (!uploaded) return null;

    const imageUrl = uploaded.url;
    //console.log(`🖼️ プロフィール画像アップロード成功: ${imageUrl}`);
    console.log(`🖼️ プロフィール画像アップロード成功`);
    await message.delete();     // メッセージ削除

    return imageUrl;
  } catch (error) {
    console.warn(`⚠️ 画像アップロード失敗: ${error.message}`);
    return null;
  }
}
