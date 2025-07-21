#!/bin/bash

# Skrypt do sprawdzania nowego deploymentu w Coolify
# Używa danych z dokumentacji coollify.md

# Konfiguracja
COOLIFY_URL="http://192.168.0.25:8000"
API_TOKEN="23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b"
LINK_APP_ID="wokco08os8k88ggcg0k4c8wk"
NEW_DEPLOYMENT_ID="gskco8wc4scs8so4okwss8sw"

echo "=== Sprawdzanie nowego deploymentu w Coolify ==="
echo "URL: $COOLIFY_URL"
echo "Aplikacja Link ID: $LINK_APP_ID"
echo "Nowy Deployment ID: $NEW_DEPLOYMENT_ID"
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

# 2. Pobierz logi nowego deploymentu
echo ""
echo "2. Pobieranie logów nowego deploymentu..."
DEPLOYMENT_LOGS=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID/deployments/$NEW_DEPLOYMENT_ID/logs")

if [ $? -eq 0 ]; then
    echo "✅ Logi deploymentu pobrane"
    echo ""
    echo "=== LOGI NOWEGO DEPLOYMENTU ==="
    echo "$DEPLOYMENT_LOGS"
    echo "=== KONIEC LOGÓW ==="
else
    echo "❌ Błąd pobierania logów deploymentu"
fi

# 3. Pobierz status nowego deploymentu
echo ""
echo "3. Sprawdzanie statusu nowego deploymentu..."
DEPLOYMENT_STATUS=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "$COOLIFY_URL/api/v1/applications/$LINK_APP_ID/deployments/$NEW_DEPLOYMENT_ID")

if [ $? -eq 0 ]; then
    echo "✅ Status deploymentu pobrany"
    echo ""
    echo "=== STATUS NOWEGO DEPLOYMENTU ==="
    echo "$DEPLOYMENT_STATUS"
    echo "=== KONIEC STATUSU ==="
else
    echo "❌ Błąd pobierania statusu deploymentu"
fi

# 4. Sprawdź status aplikacji
echo ""
echo "4. Sprawdzanie statusu aplikacji..."
sleep 5

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
echo "=== Sprawdzanie zakończone ==="
echo "Panel Coolify: $COOLIFY_URL"
echo "Aplikacja Link: $COOLIFY_URL/applications/$LINK_APP_ID" 