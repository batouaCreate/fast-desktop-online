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

    let unlisten: (() => void) | null = null;
    let cancelled = false;

    subscribeMercure<T>(topics, (data) => handlerRef.current(data))
      .then((fn) => {
        if (cancelled) {
          fn();
          return;
        }
        unlisten = fn;
      })
      .catch((err) => {
        console.error('[Mercure] Impossible de démarrer:', err);
      });

    return () => {
      cancelled = true;
      unlisten?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics.join(','), enabled]);
}
