import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

export const NOTIFICATIONS_TOPIC = 'https://fastdesktop.createdsarl.com/notifications';

// La souscription SSE tourne côté Rust pour contourner les restrictions
// CORS de WebView2 sur Windows (https://tauri.localhost bloqué par Mercure).
let subscriptionStarted = false;

async function ensureMercureStarted(topics: string[]): Promise<void> {
  if (subscriptionStarted) return;
  subscriptionStarted = true;
  await invoke('start_mercure_subscription', { topics });
}

export async function subscribeMercure<T = unknown>(
  topics: string[],
  onMessage: (data: T) => void,
): Promise<UnlistenFn> {
  await ensureMercureStarted(topics);

  return listen<string>('mercure-message', (event) => {
    try {
      let parsed = JSON.parse(event.payload);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      onMessage(parsed as T);
    } catch {
      console.error('[Mercure] Erreur parsing:', event.payload);
    }
  });
}
