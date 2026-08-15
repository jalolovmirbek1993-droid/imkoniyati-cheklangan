#!/usr/bin/env bash
set -e

echo "=== Inklyuziv AI Platformasini Yangilash va Deploy Qilish ==="

# 1. Eng so'nggi o'zgarishlarni tortish
git pull origin main

# 2. Bog'liqliklarni yangilash va yig'ish
npm install
npm run build

# 3. Docker konteynerni qayta qurish va ishga tushirish
docker compose down
docker compose up -d --build

echo "=== Muvaffaqiyatli ishga tushdi! http://localhost:3000 da faol ==="
