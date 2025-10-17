# frontend/Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json для кеша
COPY frontend/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь фронт
COPY frontend/ ./

# Строим фронтенд
RUN npm run build

# Stage для nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
