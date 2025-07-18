import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

export async function sendNotification(client, content, pubkey, keyword) {
  const embed = new EmbedBuilder()
    .setTitle('🔔 キーワード検出')
    .setDescription(content)
    .addFields(
      { name: '検出キーワード', value: keyword },
      { name: '投稿者 pubkey', value: pubkey }
    )
    .setColor(0xffcc00)
    .setTimestamp();

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  if (channel) await channel.send({ embeds: [embed] });
}
