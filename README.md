# Помощник в собеседовании

Проект состоит из двух частей:  

- **Backend** — сервис на Python FastAPI  
- **Frontend** — веб-приложение на React  

Проект можно запускать локально или через Docker Compose в двух режимах: **Development** и **Production**.

---

## Установка и настройка

1. Клонируйте репозиторий:
```bash
    git clone https://github.com/batoncss/interview-helper
    cd interview-helper
```
2. Создайте файл .env в корне проекта с примером содержимого:

```ini
    # Режим работы: 1 - prod, 2 - dev
    DEV_MODE=...
    
    # Данные для базы данных
    POSTGRES_USER=user
    POSTGRES_PASSWORD=qwerty123
    POSTGRES_DB=mydb
    DATABASE_URL_PROD=postgresql+asyncpg://user:qwerty123@db:5432/mydb
    DATABASE_URL_DEV=postgresql+asyncpg://user:qwerty123@localhost:5432/mydb
    
    # Backend keys
    SECRET_KEY=...
    API_KEY_YANDEX=...
    API_KEY_OPENAI=...
    
    # Прочие настройки
    ALGORITHM=...
    ACCESS_TOKEN_EXPIRE_MINUTES=...
    SAMPLE_RATE=...
    
    # Порты
    BACKEND_PORT=...
    FRONTEND_PORT=...
```
.env управляет всеми конфигурациями проекта: backend, база данных, ключи и порты.

## Режимы работы

Production (DEV_MODE=1): запуск с использованием продакшен-базы и ключей.
Development (DEV_MODE=2): локальный запуск с подключением к локальной базе данных.

## Локальный запуск

```shell
  ./run.sh
```

## Запуск через Docker Compose

```bash
  docker-compose up --build
```

## Переменные окружения

| Переменная                  | Описание                         |
| --------------------------- | -------------------------------- |
| DEV_MODE                    | 1 — продакшен, 2 — разработка    |
| POSTGRES_USER               | Пользователь БД                  |
| POSTGRES_PASSWORD           | Пароль БД                        |
| POSTGRES_DB                 | Название базы данных             |
| DATABASE_URL_PROD           | URL продакшен базы               |
| DATABASE_URL_DEV            | URL локальной базы               |
| SECRET_KEY                  | Секретный ключ для backend       |
| API_KEY_YANDEX              | API ключ Яндекс                  |
| API_KEY_OPENAI              | API ключ OpenAI                  |
| ALGORITHM                   | Алгоритм шифрования токенов      |
| ACCESS_TOKEN_EXPIRE_MINUTES | Время жизни токена доступа (мин) |
| SAMPLE_RATE                 | Частота сэмплирования аудио      |
| BACKEND_PORT                | Порт backend сервиса             |
| FRONTEND_PORT               | Порт frontend сервиса            |
