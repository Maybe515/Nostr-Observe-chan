const processedEventIds = new Set();
/**
 * 重複判定＆登録処理
 * @param {string} id - イベントID
 * @returns {boolean} trueなら重複（すでに処理済み）
 */
export function isDuplicate(id) {
  return processedEventIds.has(id);
}

export function markProcessed(id) {
  processedEventIds.add(id);
}
