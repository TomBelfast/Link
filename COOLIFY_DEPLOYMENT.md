# Instrukcje Deploymentu przez Coolify

## Konfiguracja w Coolify

### 1. Utwórz nową aplikację Docker Compose

1. Zaloguj się do panelu Coolify: `https://host.aihub.ovh`
2. Przejdź do sekcji "Applications" → "New Application"
3. Wybierz "Docker Compose"
4. Podłącz repozytorium GitHub: `https://github.com/TomBelfast/Link`

### 2. Konfiguracja aplikacji

**Nazwa aplikacji:** `link-app`  
**Port:** `3000`  
**Docker Compose File:** `docker-compose.coolify.yml`

### 3. Zmienne środowiskowe

Dodaj następujące zmienne środowiskowe w ustawieniach aplikacji:

```
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--max_old_space_size=4096
NPM_CONFIG_LEGACY_PEER_DEPS=true
```

### 4. Konfiguracja bazy danych (opcjonalnie)

Jeśli potrzebujesz bazy danych MySQL:

1. Utwórz bazę danych MySQL w Coolify
2. Dodaj zmienne środowiskowe:
```
DATABASE_URL=mysql://user:password@host:3306/link
```

### 5. Konfiguracja domeny

1. W ustawieniach aplikacji dodaj domenę
2. Włącz SSL (Let's Encrypt)
3. Skonfiguruj przekierowanie w Nginx Proxy Manager

## Rozwiązywanie problemów

### Problem: ERESOLVE npm errors

**Rozwiązanie:** Plik `.npmrc` z `legacy-peer-deps=true` został już dodany.

### Problem: Brak pamięci podczas budowania

**Rozwiązanie:** 
- Zmienna `NODE_OPTIONS=--max_old_space_size=4096` została dodana
- Zwiększ zasoby kontenera w Coolify

### Problem: Błąd NIXPACKS_PATH

**Rozwiązanie:** Zmienna `NIXPACKS_PATH=/usr/local/bin` została dodana do Dockerfile.

### Problem: Port conflicts

**Rozwiązanie:** Aplikacja używa portu 3000 (standardowy dla Next.js).

## Monitoring

### Health Check
Aplikacja ma skonfigurowany health check na endpoint `/api/health`.

### Logi
Logi są dostępne w panelu Coolify w sekcji "Logs".

## Backup

### Wolumeny
- `/app/public/uploads` - pliki uploadowane przez użytkowników

### Baza danych
- Wykonuj regularne backup'y bazy danych MySQL

## Aktualizacje

### Automatyczne deploymenty
1. Włącz "Auto Deploy" w ustawieniach aplikacji
2. Push do branch `main` automatycznie uruchomi deployment

### Manualne deploymenty
1. W panelu Coolify kliknij "Deploy"
2. Wybierz branch i commit

## API Endpoints

Aplikacja udostępnia następujące endpointy:
- `GET /api/health` - Health check
- `GET /api/links` - Lista linków
- `POST /api/links` - Utworzenie linku
- `GET /api/ideas` - Lista pomysłów
- `POST /api/ideas` - Utworzenie pomysłu
- `GET /api/prompts` - Lista promptów
- `POST /api/prompts` - Utworzenie promptu

## Bezpieczeństwo

### Headers
Aplikacja ma skonfigurowane security headers:
- HSTS
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

### Environment Variables
Wszystkie wrażliwe dane powinny być przechowywane jako zmienne środowiskowe w Coolify. 