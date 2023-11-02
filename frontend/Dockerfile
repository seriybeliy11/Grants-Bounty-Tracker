FROM node:latest as dev

WORKDIR /app

COPY package.json ./
COPY *.config.js ./
COPY index.html ./
COPY server.js ./

RUN npm install

COPY public/ public/

COPY src/ src/

ENV PORT 3000

EXPOSE $PORT
EXPOSE 5173

RUN echo 'npm run dev -- --host &\nnode server.js' > start.sh

RUN chmod +x start.sh

CMD ["./start.sh"]
