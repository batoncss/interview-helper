FROM python:3.11-slim

# Устанавливаем системные зависимости для сборки Python расширений
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    portaudio19-dev \
    && rm -rf /var/lib/apt/lists/*

# Рабочая директория
WORKDIR /app

# Копируем бэкенд
COPY backend /app

# Устанавливаем Python зависимости
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install uvicorn asyncpg python-multipart "uvicorn[standard]" yandex-speechkit

# Переменные окружения
ENV PYTHONUNBUFFERED=1

# Команда запуска
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
