FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install && npm install node-fetch
COPY . .
COPY .env .env
CMD ["node", "server.js"]