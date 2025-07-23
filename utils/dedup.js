const processedEvents = new Set();

export function isDuplicate(id) {
  return processedEvents.has(id);
}

export function markProcessed(id) {
  processedEvents.add(id);
}
