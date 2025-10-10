#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$0")/.."
FRONTEND_DIR="$PROJECT_ROOT/frontend"

cd "$FRONTEND_DIR" || { echo "Фронтенд директория не найдена"; exit 1; }

if ! command -v npm &>/dev/null; then
    echo "npm не найден. Установите Node.js и npm."
    exit 1
fi

echo "Устанавливаем зависимости фронта..."
npm install

echo "Запускаем фронт..."
npm run dev
