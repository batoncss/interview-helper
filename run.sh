#!/bin/bash

# Запуск бэкенда
cd backend
uvicorn main:app --reload --port 8000 &
BACK_PID=$!

# Запуск фронтенда
cd ../frontend
npm run dev &

# Ожидание завершения
wait $BACK_PID
