#!/bin/bash

# Skrypt do utworzenia aplikacji w Coolify przez API
# Używa danych z dokumentacji coollify.md

# Konfiguracja
COOLIFY_URL="http://192.168.0.25:8000"
API_TOKEN="23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b"
GITHUB_REPO="https://github.com/TomBelfast/Link"
APP_NAME="link-app"
DOCKER_COMPOSE_FILE="docker-compose.coolify.yml"

echo "=== Tworzenie aplikacji w Coolify ==="
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

# 2. Pobierz listę projektów
echo ""
echo "2. Pobieranie listy projektów..."
PROJECTS_RESPONSE=$(curl -s -H "Authorization: Bearer $API_TOKEN" "$COOLIFY_URL/api/v1/projects")
echo "Projekty: $PROJECTS_RESPONSE"

# 3. Utwórz projekt (jeśli nie istnieje)
echo ""
echo "3. Tworzenie projektu 'link-project'..."
PROJECT_DATA='{
    "name": "link-project",
    "description": "Projekt dla aplikacji Link"
}'

PROJECT_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$PROJECT_DATA" \
    "$COOLIFY_URL/api/v1/projects")

echo "Odpowiedź tworzenia projektu: $PROJECT_RESPONSE"

# 4. Utwórz aplikację Docker Compose
echo ""
echo "4. Tworzenie aplikacji Docker Compose..."
APP_DATA='{
    "name": "'$APP_NAME'",
    "repository": "'$GITHUB_REPO'",
    "branch": "master",
    "dockerComposeFile": "'$DOCKER_COMPOSE_FILE'",
    "port": 3000,
    "type": "dockercompose"
}'

APP_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$APP_DATA" \
    "$COOLIFY_URL/api/v1/applications/dockercompose")

echo "Odpowiedź tworzenia aplikacji: $APP_RESPONSE"

# 5. Sprawdź status aplikacji
echo ""
echo "5. Sprawdzanie statusu aplikacji..."
sleep 5

APPS_RESPONSE=$(curl -s -H "Authorization: Bearer $API_TOKEN" "$COOLIFY_URL/api/v1/applications")
echo "Lista aplikacji: $APPS_RESPONSE"

echo ""
echo "=== Instrukcje dalszej konfiguracji ==="
echo "1. Zaloguj się do panelu Coolify: https://host.aihub.ovh"
echo "2. Przejdź do aplikacji '$APP_NAME'"
echo "3. Dodaj zmienne środowiskowe:"
echo "   - NODE_ENV=production"
echo "   - PORT=3000"
echo "   - HOST=0.0.0.0"
echo "   - NEXT_TELEMETRY_DISABLED=1"
echo "   - NODE_OPTIONS=--max_old_space_size=4096"
echo "   - NPM_CONFIG_LEGACY_PEER_DEPS=true"
echo "4. Skonfiguruj domenę i SSL"
echo "5. Uruchom deployment"

echo ""
echo "✅ Skrypt zakończony pomyślnie!" 