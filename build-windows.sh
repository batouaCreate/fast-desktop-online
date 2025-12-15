#!/bin/bash
set -e

echo "Building frontend..."
npm run build

echo "Building Windows executable with cargo-xwin..."
cd src-tauri
cargo xwin build --release --target x86_64-pc-windows-msvc

echo "Build complete!"
echo "Executable location: src-tauri/target/x86_64-pc-windows-msvc/release/fast-app.exe"
