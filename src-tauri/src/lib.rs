mod mercure;
mod printer;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            mercure::start_mercure_subscription,
            printer::print_ticket,
            printer::print_stub_and_ticket,
            printer::list_printers,
            printer::print_raw_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
