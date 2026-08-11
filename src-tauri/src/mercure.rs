use futures_util::StreamExt;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Emitter};

static MERCURE_RUNNING: AtomicBool = AtomicBool::new(false);

const MERCURE_HUB_URL: &str = "https://mercure.createdsarl.com/.well-known/mercure";
const RECONNECT_DELAY_SECS: u64 = 3;
const MAX_RECONNECT_DELAY_SECS: u64 = 30;

#[tauri::command]
pub async fn start_mercure_subscription(app: AppHandle, topics: Vec<String>) -> Result<(), String> {
    if MERCURE_RUNNING
        .compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst)
        .is_err()
    {
        return Ok(());
    }

    tauri::async_runtime::spawn(async move {
        let mut delay = RECONNECT_DELAY_SECS;
        loop {
            match connect_and_stream(&app, &topics).await {
                Ok(_) => {
                    eprintln!("[Mercure] Connexion fermée, reconnexion...");
                }
                Err(e) => {
                    eprintln!("[Mercure] Erreur: {}, reconnexion dans {}s...", e, delay);
                }
            }
            tokio::time::sleep(tokio::time::Duration::from_secs(delay)).await;
            delay = (delay * 2).min(MAX_RECONNECT_DELAY_SECS);
        }
    });

    Ok(())
}

async fn connect_and_stream(app: &AppHandle, topics: &[String]) -> Result<(), String> {
    let mut url =
        reqwest::Url::parse(MERCURE_HUB_URL).map_err(|e| format!("URL invalide: {}", e))?;

    {
        let mut pairs = url.query_pairs_mut();
        for topic in topics {
            pairs.append_pair("topic", topic);
        }
    }

    let client = reqwest::Client::new();
    let response = client
        .get(url)
        .header("Accept", "text/event-stream")
        .header("Cache-Control", "no-cache")
        .send()
        .await
        .map_err(|e| format!("Connexion échouée: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("HTTP {}", response.status()));
    }

    let mut stream = response.bytes_stream();
    let mut buffer = String::new();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| format!("Erreur stream: {}", e))?;
        buffer.push_str(&String::from_utf8_lossy(&chunk));

        // Normaliser les fins de ligne Windows (\r\n → \n)
        let normalized = buffer.replace("\r\n", "\n");
        buffer = normalized;

        // Les messages SSE sont séparés par une ligne vide (\n\n)
        while let Some(end_pos) = buffer.find("\n\n") {
            let message_block = buffer[..end_pos].to_string();
            buffer = buffer[end_pos + 2..].to_string();

            let mut data_parts: Vec<&str> = Vec::new();
            for line in message_block.lines() {
                if let Some(data) = line.strip_prefix("data: ") {
                    data_parts.push(data);
                }
            }

            if !data_parts.is_empty() {
                let payload = data_parts.join("\n");
                let _ = app.emit("mercure-message", payload);
            }
        }
    }

    Ok(())
}
