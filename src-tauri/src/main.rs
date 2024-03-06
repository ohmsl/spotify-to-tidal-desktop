// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn start_express_server() {
    std::process::Command::new("node")
        .arg("../server/dist/server/server.js")
        .spawn()
        .expect("failed to start the express server");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_express_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
