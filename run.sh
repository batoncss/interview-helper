#!/bin/bash
set -e

cd "$(dirname "$0")" || exit 1

# запустить бэкенд
backend/run_backend.sh &
BACK_PID=$!

# запустить фронтенд
frontend/run_frontend.sh &
FRONT_PID=$!

# при выходе убивать оба процесса
trap "kill $BACK_PID $FRONT_PID" EXIT

# ждать оба
wait
