const MAX_LENGTH = 2000;

/**
 * 長文をDiscord Embed用にトリム
 * @param {string} text
 * @returns {string}
 */
export function trimContent(text) {
  if (!text) return '（本文なし）';
  if (text.length <= MAX_LENGTH) return text;

  const trimmed = text.replace(/\n+/g, ' ').substring(0, MAX_LENGTH - 3);
  return trimmed + '...';
}
