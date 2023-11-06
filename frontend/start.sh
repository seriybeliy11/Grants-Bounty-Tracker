#!/bin/sh

echo starting api server

node server.js &

while true; do
  echo requesting to api server
  response=$(curl -s "http://localhost:3000/check_status")
  echo parsing response
  status=$(echo "$response" | grep -o '"status":"[^"]*"' | awk -F ':"' '{print $2}' | awk -F '"' '{print $1}')
  if [ "$status" = "completed" ]; then
    break
  fi
  sleep 1
done

echo starting frontend

npm run dev -- --host