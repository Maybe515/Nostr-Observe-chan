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

// プロフィール画像の形式チェック
export function isValidImageURL(url) {
  return typeof url === 'string' &&
    (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('attachment://'));
}