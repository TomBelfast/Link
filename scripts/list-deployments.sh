#!/bin/bash

# Skrypt do listowania deploymentów aplikacji w Coolify
# Używa danych z dokumentacji coollify.md

# Konfiguracja
COOLIFY_URL="http://192.168.0.25:8000"
API_TOKEN="23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b"
LINK_APP_ID="wokco08os8k88ggcg0k4c8wk"

echo "=== Listowanie deploymentów aplikacji Link w Coolify ==="
echo "URL: $COOLIFY_URL"
echo "Aplikacja Link ID: $LINK_APP_ID"
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

# 2. Pobierz listę deploymentów
echo ""
echo "2. Pobieranie listy deploymentów..."
DEPLOYMENTS_LIST=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID/deployments")

if [ $? -eq 0 ]; then
    echo "✅ Lista deploymentów pobrana"
    echo ""
    echo "=== LISTA DEPLOYMENTÓW ==="
    echo "$DEPLOYMENTS_LIST"
    echo "=== KONIEC LISTY ==="
else
    echo "❌ Błąd pobierania listy deploymentów"
fi

# 3. Pobierz szczegóły aplikacji
echo ""
echo "3. Pobieranie szczegółów aplikacji..."
APP_DETAILS=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID")

if [ $? -eq 0 ]; then
    echo "✅ Szczegóły aplikacji pobrane"
    echo ""
    echo "=== SZCZEGÓŁY APLIKACJI ==="
    echo "$APP_DETAILS"
    echo "=== KONIEC SZCZEGÓŁÓW ==="
else
    echo "❌ Błąd pobierania szczegółów aplikacji"
fi

echo ""
echo "=== Listowanie zakończone ==="
echo "Panel Coolify: $COOLIFY_URL"
echo "Aplikacja Link: $COOLIFY_URL/applications/$LINK_APP_ID" 