FROM node:latest as dev

WORKDIR /app

COPY package*.json ./
COPY *.config.js ./
COPY index.html ./

RUN npm install

COPY public/ public/

COPY src/ src/

EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host"]
