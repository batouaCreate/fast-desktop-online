import { useEffect, useRef } from 'react';
import { subscribeMercure } from '../services/mercure';

export function useMercure<T = unknown>(
  topics: string[],
  onMessage: (data: T) => void,
  enabled = true,
) {
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    if (!enabled || !topics.length) return;

    let es: EventSource | null = null;
    let cancelled = false;

    subscribeMercure<T>(topics, (data) => handlerRef.current(data))
      .then((source) => {
        if (cancelled) {
          source.close();
          return;
        }
        es = source;
      })
      .catch((err) => {
        console.error('[Mercure] Failed to subscribe:', err);
      });

    return () => {
      cancelled = true;
      es?.close();
    };
  // topics.join(',') évite les re-renders sur des références d'array stables
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics.join(','), enabled]);
}
