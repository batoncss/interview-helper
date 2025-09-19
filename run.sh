#!/bin/bash

set -e


cd "$(dirname "$0")" || exit 1

uvicorn backend.main:app --reload --port 8000 &
BACK_PID=$!

cd frontend  || exit 1
npm run dev &

wait $BACK_PID
