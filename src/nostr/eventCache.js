/// kind:1 イベントを保存して /search-event に活用
import { saveNotifiedEvents } from '../utils/persistence.js';

const recentEvents = [];
const notifiedEvents = new Set();

export function cacheEvent(event) {
  if (event.kind !== 1) return;
  recentEvents.push(event);

  // 最大保存件数を制限（例：100件）
  if (recentEvents.length > 100) {
    recentEvents.shift();
  }
}

export function getRecentEvents() {
  return [...recentEvents];
}

export function isDuplicateEvent(event) {
  if (!event || !event.id) return false;
  if (notifiedEvents.has(event.id)) return true;
  notifiedEvents.add(event.id);   
  saveNotifiedEvents(notifiedEvents);   // 通知ごとに保存（永続化）
  return false;
}