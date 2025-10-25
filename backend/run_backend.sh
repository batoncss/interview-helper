#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$0")/.."
BACKEND_DIR="$PROJECT_ROOT/backend"
VENV_DIR="$PROJECT_ROOT/.venv"

cd "$PROJECT_ROOT" || exit 1

# Проверка Python
if ! command -v python3.11 &>/dev/null; then
    echo "Python 3.11 не найден. Установите его и python3.11-venv."
    exit 1
fi

# Виртуальное окружение
if [ ! -f "$VENV_DIR/bin/activate" ]; then
    echo "Создаём виртуальное окружение..."
    python3.11 -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"

# Установка зависимостей
echo "Устанавливаем зависимости бэкенда..."
pip install --upgrade pip
pip install -r "$BACKEND_DIR/requirements.txt"
pip install "uvicorn[standard]" asyncpg python-multipart yandex-speechkit

# Подгрузка .env
export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)

# Запуск бэкенда
echo "Запускаем бэкенд..."
uvicorn backend.main:app --reload --port 8000
