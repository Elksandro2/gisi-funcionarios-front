# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Instala as dependências separadamente para aproveitar o cache de camadas do Docker
COPY package*.json ./
RUN npm ci

# Copia o restante dos arquivos e executa o build (ele lerá o .env.production automaticamente)
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copia os arquivos gerados no Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração customizada do Nginx para suportar SPA
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]