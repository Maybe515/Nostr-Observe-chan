const startTime = Date.now();

export function handleUptime(interaction) {
  const now = Date.now();
  const uptimeMs = now - startTime;
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const hours = Math.floor(uptimeSec / 3600);
  const minutes = Math.floor((uptimeSec % 3600) / 60);
  const seconds = uptimeSec % 60;

  interaction.reply(`🕒 稼働時間: ${hours}時間 ${minutes}分 ${seconds}秒`);
}
