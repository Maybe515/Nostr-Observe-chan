let notifyPausedUntil = 0; // UNIXタイムスタンプで保持（秒単位）

export function isNotificationPaused() {
  return Date.now() / 1000 < notifyPausedUntil;
}

export function setNotificationPausedUntil(unixTime) {
  notifyPausedUntil = unixTime;
}

export default {
  data: {
    name: 'snooze',
    description: '指定した秒数の間、通知を一時停止します',
    options: [{
      name: 'seconds',
      type: 4,
      description: '通知停止する秒数（例: 30）',
      required: true
    }]
  },
  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    if (seconds <= 0) {
      return interaction.reply('⚠️ 1秒以上を指定してください');
    }

    const until = Math.floor(Date.now() / 1000 + seconds);
    notifyPausedUntil = until;

    await interaction.reply(`🔕 通知を ${seconds} 秒間停止します（再開: <t:${until}:R>）`);
  }
}
