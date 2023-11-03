FROM node:latest as dev

WORKDIR /app

COPY package.json ./
COPY *.config.js ./
COPY index.html ./
COPY server.js ./

RUN npm install

COPY public/ public/
COPY src/ src/
COPY start.sh ./

EXPOSE 3000
EXPOSE 5173

RUN chmod +x start.sh

CMD ["./start.sh"]
