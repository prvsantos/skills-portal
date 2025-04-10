# Etapa 1: Build do frontend
FROM node:18 AS builder
WORKDIR /app

# Instala dependências primeiro (melhora cache)
COPY package*.json ./
RUN npm install

# Copia o restante do código-fonte
COPY public ./public
COPY src ./src
# opcional se os acima já cobrem tudo
#COPY . . 

# Gera build de produção
RUN npm run build

# Etapa 2: Servir via NGINX
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
