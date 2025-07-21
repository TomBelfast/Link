#!/bin/bash

# Skrypt do utworzenia nowej aplikacji Link w Coolify
# Używa danych z dokumentacji coollify.md

# Konfiguracja
COOLIFY_URL="http://192.168.0.25:8000"
API_TOKEN="23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b"
GITHUB_REPO="https://github.com/TomBelfast/Link"
APP_NAME="link-app"

echo "=== Tworzenie nowej aplikacji Link w Coolify ==="
echo "URL: $COOLIFY_URL"
echo "Nazwa aplikacji: $APP_NAME"
echo "Repo: $GITHUB_REPO"
echo ""

# 1. Sprawdź połączenie z Coolify
echo "1. Sprawdzanie połączenia z Coolify..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$COOLIFY_URL/api/v1/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Coolify jest dostępny"
else
    echo "❌ Błąd połączenia z Coolify (HTTP $HEALTH_RESPONSE)"
    exit 1
fi

# 2. Pobierz listę serwerów
echo ""
echo "2. Pobieranie listy serwerów..."
SERVERS_RESPONSE=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "$COOLIFY_URL/api/v1/servers")

if [ $? -eq 0 ]; then
    echo "✅ Lista serwerów pobrana"
    SERVER_UUID=$(echo "$SERVERS_RESPONSE" | grep -o '"uuid":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$SERVER_UUID" ]; then
        echo "✅ Znaleziono serwer: $SERVER_UUID"
    else
        echo "❌ Nie znaleziono serwera"
        exit 1
    fi
else
    echo "❌ Błąd pobierania listy serwerów"
    exit 1
fi

# 3. Utwórz nową aplikację Docker Compose (standalone)
echo ""
echo "3. Tworzenie nowej aplikacji Docker Compose..."
CREATE_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"$APP_NAME\",
        \"description\": \"Aplikacja Link - Next.js z TypeScript\",
        \"server_uuid\": \"$SERVER_UUID\",
        \"build_pack\": \"dockercompose\",
        \"docker_compose_location\": \"/docker-compose.coolify.yml\",
        \"install_command\": \"npm install --legacy-peer-deps\",
        \"build_command\": \"npm run build\",
        \"start_command\": \"npm start\"
    }" \
    "$COOLIFY_URL/api/v1/applications/dockercompose")

if [ $? -eq 0 ]; then
    echo "✅ Aplikacja utworzona"
    echo "Odpowiedź: $CREATE_RESPONSE"
    
    # Wyciągnij ID aplikacji z odpowiedzi
    NEW_APP_ID=$(echo "$CREATE_RESPONSE" | grep -o '"uuid":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$NEW_APP_ID" ]; then
        echo "✅ Nowa aplikacja ID: $NEW_APP_ID"
        
        # Zapisz ID do pliku
        echo "$NEW_APP_ID" > .coolify-app-id
        echo "ID aplikacji zapisane w pliku .coolify-app-id"
    fi
else
    echo "❌ Błąd tworzenia aplikacji"
    echo "Odpowiedź: $CREATE_RESPONSE"
    exit 1
fi

echo ""
echo "=== Tworzenie zakończone ==="
echo "Panel Coolify: $COOLIFY_URL"
if [ -n "$NEW_APP_ID" ]; then
    echo "Nowa aplikacja: $COOLIFY_URL/applications/$NEW_APP_ID"
fi 