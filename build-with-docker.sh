#!/bin/bash
set -e

echo "🐳 Building Windows executable with Docker..."

# Construire l'image Docker
docker build -f Dockerfile.windows -t fast-app-builder .

# Créer un conteneur et extraire l'exécutable
docker create --name fast-app-temp fast-app-builder

# Copier l'exécutable depuis le conteneur
mkdir -p dist-windows
docker cp fast-app-temp:/app/src-tauri/target/x86_64-pc-windows-msvc/release/fast-app.exe ./dist-windows/

# Nettoyer le conteneur temporaire
docker rm fast-app-temp

# Créer une archive ZIP
cd dist-windows
zip -9 ../fast-app-windows-x64.zip fast-app.exe
cd ..

echo "✅ Build completed!"
echo "📦 Executable: dist-windows/fast-app.exe"
echo "📦 Archive: fast-app-windows-x64.zip"
