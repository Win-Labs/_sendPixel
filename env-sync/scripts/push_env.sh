#!/bin/bash

# Load variables from .env.secret
ENV_CONFIG_FILE="./.curl.env"
if [ -f "$ENV_CONFIG_FILE" ]; then
  export $(grep -v '^#' "$ENV_CONFIG_FILE" | xargs)
else
  echo "❌ Config file $ENV_CONFIG_FILE not found"
  exit 1
fi

PROJECT_NAME="_sendPixel"
INPUT_FILE="./.dynamic.env"  # or .env

API_URL="http://$SERVER_HOST:$SERVER_PORT/env/$PROJECT_NAME"

# Convert .env to { key: value, ... } JSON using jq
ENV_JSON=$(jq -Rn '
  [inputs
   | select(test("^[[:space:]]*$") | not)           # skip empty lines
   | select(test("^#") | not)                       # skip comments
   | split("=")
   | {(.[0]): (.[1] | sub("^\"";"") | sub("\"$";""))}
  ] | add
' < "$INPUT_FILE")

# Wrap into full JSON payload
PAYLOAD=$(jq -n --argjson vars "$ENV_JSON" '{ variables: $vars }')

echo "🚀 Final payload to POST:"
echo "$PAYLOAD" | jq .

# Send it
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
