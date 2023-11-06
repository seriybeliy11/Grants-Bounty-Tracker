#!/bin/sh

node server.js &

while true; do
  response=$(curl -s "http://localhost:3000/check_status")
  status=$(echo "$response" | grep -o '"status":"[^"]*"' | awk -F ':"' '{print $2}' | awk -F '"' '{print $1}')
  if [ "$status" = "completed" ]; then
    break
  fi
  sleep 1
done

npm run dev -- --host