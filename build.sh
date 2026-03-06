#!/bin/bash
set -e

echo "[BUILD] Starting build process..."

# 1. Build Frontend
echo "[BUILD] Building Frontend (Quasar)..."
cd frontend
npm install
npx quasar build
cd ..

# 2. Build Docker Images
echo "[BUILD] Building Docker images..."
docker-compose build

echo "[SUCCESS] Build completed successfully!"
