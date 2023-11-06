FROM alpine:latest

WORKDIR /app

COPY . .

RUN apk update && apk add --no-cache nodejs npm curl

RUN npm install

RUN chmod +x start.sh

EXPOSE 3000

EXPOSE 5173

CMD ./start.sh
