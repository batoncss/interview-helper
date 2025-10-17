# Помощник в собеседовании

Для работы backend через Docker Compose необходимо создать файл конфигурации `conf.ini` в корне проекта.

## Пример структуры файла `conf.ini`

```ini
[KEYS]
secret_key = <ваш секретный ключ>
api_key_yandex = <ваш API ключ Яндекс>

[DB]
URL = postgresql+asyncpg://user:qwerty123@db:5432/mydb
```

## Запуск
```bash
  docker-compose up --build
```