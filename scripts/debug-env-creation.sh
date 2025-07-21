#!/bin/bash

# Skrypt debug do sprawdzenia odpowiedzi API przy tworzeniu środowiska

# Konfiguracja
COOLIFY_URL="http://192.168.0.25:8000"
API_TOKEN="23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b"
PROJECT_UUID="y8goow0ockkg0okwwssww40k"

echo "=== Debug tworzenia środowiska ==="
echo "URL: $COOLIFY_URL"
echo "Project UUID: $PROJECT_UUID"
echo ""

# Utwórz nowe środowisko i wyświetl pełną odpowiedź
echo "Tworzenie środowiska..."
CREATE_ENV_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"production\",
        \"description\": \"Środowisko produkcyjne dla aplikacji Link\"
    }" \
    "$COOLIFY_URL/api/v1/projects/$PROJECT_UUID/environments")

echo "Pełna odpowiedź API:"
echo "$CREATE_ENV_RESPONSE"
echo ""

# Sprawdź kod odpowiedzi
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"production\",
        \"description\": \"Środowisko produkcyjne dla aplikacji Link\"
    }" \
    "$COOLIFY_URL/api/v1/projects/$PROJECT_UUID/environments")

echo "Kod odpowiedzi HTTP: $HTTP_CODE" 