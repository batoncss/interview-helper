#!/bin/bash
set -e
cd "$(dirname "$0")"/.. || exit 1
uvicorn backend.main:app --reload --port 8000
