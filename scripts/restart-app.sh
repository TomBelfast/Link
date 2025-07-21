#!/bin/bash

# Skrypt do restartu aplikacji w Coolify
# Używa danych z dokumentacji coollify.md

# Konfiguracja
COOLIFY_URL="http://192.168.0.25:8000"
API_TOKEN="23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b"
LINK_APP_ID="wokco08os8k88ggcg0k4c8wk"

echo "=== Restart aplikacji Link w Coolify ==="
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

# 2. Zatrzymaj aplikację
echo ""
echo "2. Zatrzymywanie aplikacji..."
STOP_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID/stop")

if [ $? -eq 0 ]; then
    echo "✅ Aplikacja zatrzymana"
    echo "Odpowiedź: $STOP_RESPONSE"
else
    echo "❌ Błąd zatrzymywania aplikacji"
fi

# 3. Poczekaj chwilę
echo ""
echo "3. Oczekiwanie na zatrzymanie..."
sleep 10

# 4. Uruchom aplikację
echo ""
echo "4. Uruchamianie aplikacji..."
START_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID/start")

if [ $? -eq 0 ]; then
    echo "✅ Aplikacja uruchomiona"
    echo "Odpowiedź: $START_RESPONSE"
else
    echo "❌ Błąd uruchamiania aplikacji"
fi

# 5. Sprawdź status aplikacji
echo ""
echo "5. Sprawdzanie statusu aplikacji..."
sleep 15

STATUS_RESPONSE=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID")

if [ $? -eq 0 ]; then
    echo "✅ Status aplikacji pobrany"
    STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    echo "Status aplikacji: $STATUS"
    
    if [[ "$STATUS" == *"running"* ]]; then
        echo "✅ Aplikacja jest uruchomiona"
    elif [[ "$STATUS" == *"exited"* ]]; then
        echo "❌ Aplikacja jest zatrzymana"
    elif [[ "$STATUS" == *"building"* ]]; then
        echo "🔄 Aplikacja jest w trakcie budowania"
    else
        echo "⚠️  Nieznany status: $STATUS"
    fi
else
    echo "❌ Błąd pobierania statusu aplikacji"
fi

echo ""
echo "=== Restart zakończony ==="
echo "Panel Coolify: $COOLIFY_URL"
echo "Aplikacja Link: $COOLIFY_URL/applications/$LINK_APP_ID" 