#!/bin/bash

# Skrypt do sprawdzania logów deploymentu w Coolify
# Używa danych z dokumentacji coollify.md

# Konfiguracja
COOLIFY_URL="http://192.168.0.25:8000"
API_TOKEN="23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b"
LINK_APP_ID="wokco08os8k88ggcg0k4c8wk"
DEPLOYMENT_ID="us8gk4gsw88ogkow08cc0gg4"

echo "=== Sprawdzanie logów deploymentu w Coolify ==="
echo "URL: $COOLIFY_URL"
echo "Aplikacja Link ID: $LINK_APP_ID"
echo "Deployment ID: $DEPLOYMENT_ID"
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

# 2. Pobierz logi deploymentu
echo ""
echo "2. Pobieranie logów deploymentu..."
DEPLOYMENT_LOGS=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID/deployments/$DEPLOYMENT_ID/logs")

if [ $? -eq 0 ]; then
    echo "✅ Logi deploymentu pobrane"
    echo ""
    echo "=== LOGI DEPLOYMENTU ==="
    echo "$DEPLOYMENT_LOGS"
    echo "=== KONIEC LOGÓW ==="
else
    echo "❌ Błąd pobierania logów deploymentu"
fi

# 3. Pobierz status deploymentu
echo ""
echo "3. Sprawdzanie statusu deploymentu..."
DEPLOYMENT_STATUS=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID/deployments/$DEPLOYMENT_ID")

if [ $? -eq 0 ]; then
    echo "✅ Status deploymentu pobrany"
    echo ""
    echo "=== STATUS DEPLOYMENTU ==="
    echo "$DEPLOYMENT_STATUS"
    echo "=== KONIEC STATUSU ==="
else
    echo "❌ Błąd pobierania statusu deploymentu"
fi

echo ""
echo "=== Sprawdzanie zakończone ==="
echo "Panel Coolify: $COOLIFY_URL"
echo "Aplikacja Link: $COOLIFY_URL/applications/$LINK_APP_ID" 