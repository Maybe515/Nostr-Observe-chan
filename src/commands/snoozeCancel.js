// commands/snoozeCancel.js
import { setNotificationPausedUntil, isNotificationPaused } from './snooze.js';

export default {
  data: {
    name: 'snooze-cancel',
    description: '通知の一時停止を即時解除します'
  },
  async execute(interaction) {
    if (!isNotificationPaused()) {
      return interaction.reply('🔔 現在、通知は停止されていません');
    }

    setNotificationPausedUntil(0);
    await interaction.reply('✅ 通知の一時停止を解除しました');
  }
}
