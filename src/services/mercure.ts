const MERCURE_HUB_URL = 'https://mercure.createdsarl.com/.well-known/mercure';
export const NOTIFICATIONS_TOPIC = 'https://fastdesktop.createdsarl.com/notifications';

export async function subscribeMercure<T = unknown>(
  topics: string[],
  onMessage: (data: T) => void,
  onError?: (event: Event) => void,
): Promise<EventSource> {
  const url = new URL(MERCURE_HUB_URL);
  for (const topic of topics) { url.searchParams.append('topic', topic); }

  const es = new EventSource(url.toString());

  es.onmessage = (event) => {
    try {
      let parsed = JSON.parse(event.data);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      onMessage(parsed as T);
    } catch { console.error('[Mercure] Parse error:', event.data); }
  };

  es.onerror = (err) => { console.error('[Mercure] Connection error', err); onError?.(err); };

  return es;
}