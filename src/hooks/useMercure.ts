import { useEffect, useRef } from 'react';
import { subscribeMercure } from '../services/mercure';

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_DELAY_MS = 30000;

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
    let retryDelay = RECONNECT_DELAY_MS;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      if (cancelled) return;

      subscribeMercure<T>(topics, (data) => handlerRef.current(data), () => {
        if (cancelled) return;
        es = null;
        retryTimer = setTimeout(() => {
          retryDelay = Math.min(retryDelay * 2, MAX_RECONNECT_DELAY_MS);
          connect();
        }, retryDelay);
      })
        .then((source) => {
          if (cancelled) {
            source.close();
            return;
          }
          es = source;
          retryDelay = RECONNECT_DELAY_MS;
        })
        .catch((err) => {
          console.error('[Mercure] Failed to subscribe:', err);
          if (!cancelled) {
            retryTimer = setTimeout(() => {
              retryDelay = Math.min(retryDelay * 2, MAX_RECONNECT_DELAY_MS);
              connect();
            }, retryDelay);
          }
        });
    }

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      es?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics.join(','), enabled]);
}
