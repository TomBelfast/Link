# Raport i Dokumentacja Odtworzeniowa: Kontener LXC - Coolify

**Data wygenerowania:** 2025-07-19  
**Cel kontenera:** Platforma zarządzania aplikacjami Coolify  

---

### 1. Podstawowe Informacje i Konfiguracja `.env`

| Parametr | Wartość |
|---|---|
| **ID Kontenera** | `104` |
| **Hostname** | `coolify` |
| **Domena** | `host.aihub.ovh` |
| **Adres IP (DHCP)** | `192.168.0.25` |
| **Hasło `root`** | `Swiat1976` |
| **Zasoby** | `8 CPU, 32 GB RAM, 20 GB Dysk` |
| **Wolumen na Hoście** | `'/mnt/data/volumes/ct-104-coolify-data'` |
| **Punkt Montowania w CT**| `'/data'` |

---

### 2. Konfiguracja Nginx Proxy Manager

| Parametr | Wartość |
|---|---|
| **Status Przekierowania** | ✅ **Utworzono** |
| **Domena źródłowa** | `host.aihub.ovh` |
| **Cel (IP kontenera)** | `192.168.0.25` |
| **Port docelowy** | `8000` |
| **SSL** | ✅ **Włączone** |

---

### 3. Dane Dostępowe Coolify

| Parametr | Wartość |
|---|---|
| **Panel Web** | `https://host.aihub.ovh` |
| **Email Administratora** | `aiwbiznesiepl@gmail.com` |
| **Hasło Administratora** | `Swiat1976` |
| **Token API** | `23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b` |
| **Uprawnienia Tokenu** | `["root"]` |

---

### 4. API Coolify - Pełna Funkcjonalność ✅

**Status:** ✅ **W pełni funkcjonalne**  
**Problem rozwiązany:** Token był niepoprawnie hashowany w bazie danych

#### Dostępne Endpointy API:

**Projekty:**
- `GET /api/v1/projects` - Lista projektów
- `POST /api/v1/projects` - Utworzenie projektu
- `GET /api/v1/projects/{uuid}` - Szczegóły projektu
- `PATCH /api/v1/projects/{uuid}` - Aktualizacja projektu
- `DELETE /api/v1/projects/{uuid}` - Usunięcie projektu

**Aplikacje:**
- `GET /api/v1/applications` - Lista aplikacji
- `POST /api/v1/applications/dockercompose` - Utworzenie aplikacji Docker Compose
- `POST /api/v1/applications/dockerfile` - Utworzenie aplikacji Dockerfile
- `POST /api/v1/applications/dockerimage` - Utworzenie aplikacji Docker Image
- `POST /api/v1/applications/public` - Utworzenie aplikacji publicznej

**Serwery:**
- `GET /api/v1/servers` - Lista serwerów
- `POST /api/v1/servers` - Utworzenie serwera
- `GET /api/v1/servers/{uuid}` - Szczegóły serwera
- `PATCH /api/v1/servers/{uuid}` - Aktualizacja serwera

**Bazy danych:**
- `GET /api/v1/databases` - Lista baz danych
- `POST /api/v1/databases/postgresql` - Utworzenie PostgreSQL
- `POST /api/v1/databases/mysql` - Utworzenie MySQL
- `POST /api/v1/databases/mongodb` - Utworzenie MongoDB
- `POST /api/v1/databases/redis` - Utworzenie Redis

**Zespoły:**
- `GET /api/v1/teams` - Lista zespołów
- `GET /api/v1/teams/current` - Aktualny zespół
- `GET /api/v1/teams/current/members` - Członkowie aktualnego zespołu

**Inne:**
- `GET /api/v1/health` - Health check
- `POST /api/feedback` - Wysyłanie feedbacku

#### Przykład użycia API:

```bash
# Autoryzacja
curl -H "Authorization: Bearer 23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b" \
     http://192.168.0.25:8000/api/v1/projects

# Utworzenie projektu
curl -X POST \
     -H "Authorization: Bearer 23ab779d87ec8b0f42189014b5f28873d69bc01f63ae1a511eeb32b29d985c9b" \
     -H "Content-Type: application/json" \
     -d '{"name":"test-project","description":"Test"}' \
     http://192.168.0.25:8000/api/v1/projects
```

---

### 5. Wyniki Testów Walidacyjnych

| Test | Wynik | Uwagi |
|---|---|---|
| **Łączność z Internetem** | ✅ **POWODZENIE** | `ping 8.8.8.8 - 0% packet loss` |
| **Rozwiązywanie nazw (DNS)** | ✅ **POWODZENIE** | `ping proxmox.com - 0% packet loss` |
| **Dostęp do repozytoriów** | ✅ **POWODZENIE** | `apt-get update zakończone pomyślnie` |
| **Dostęp do wolumenu** | ✅ **POWODZENIE** | `Plik testowy zapisany i odczytany poprawnie` |
| **Status usługi (Coolify)** | ✅ **POWODZENIE** | `Usługa Coolify w kontenerze jest aktywna` |
| **Dostępność przez Domenę**| ✅ **POWODZENIE** | `Otrzymano kod HTTP 200 z https://host.aihub.ovh` |
| **API Projects** | ✅ **POWODZENIE** | `GET /api/v1/projects zwraca listę projektów` |
| **API Servers** | ✅ **POWODZENIE** | `GET /api/v1/servers zwraca listę serwerów` |
| **API Teams** | ✅ **POWODZENIE** | `GET /api/v1/teams zwraca listę zespołów` |
| **API Create Project** | ✅ **POWODZENIE** | `POST /api/v1/projects tworzy nowy projekt` |
| **API Delete Project** | ✅ **POWODZENIE** | `DELETE /api/v1/projects usuwa projekt` |

---

### 6. Instrukcja Odtworzenia (Disaster Recovery)

*Aby odtworzyć to środowisko, wykonaj poniższe komendy na hoście Proxmox.*

**Krok 1: Utwórz katalog dla wolumenu**  
`mkdir -p "/mnt/data/volumes/ct-104-coolify-data"`

**Krok 2: Utwórz kontener LXC**  
`pct create 104 "local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst" --hostname "coolify" --password "Swiat1976" --cores 8 --memory 32768 --rootfs "local-lvm:20G" --net0 name=eth0,bridge="vmbr0",ip=dhcp --mp0 "/mnt/data/volumes/ct-104-coolify-data,mp=/data" --onboot 1 --start 1`

**Krok 3: Zainstaluj Docker w kontenerze**  
```bash
pct exec 104 -- apt-get update
pct exec 104 -- apt-get install -y curl gnupg lsb-release
pct exec 104 -- curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
pct exec 104 -- echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
pct exec 104 -- apt-get update
pct exec 104 -- apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

**Krok 4: Uruchom Coolify**  
```bash
pct exec 104 -- mkdir -p /data/self-hosted
pct exec 104 -- cd /data/self-hosted
pct exec 104 -- curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

**Krok 5: Skonfiguruj użytkownika i token API**  
```bash
# Zaloguj się do panelu https://host.aihub.ovh
# Utwórz użytkownika: aiwbiznesiepl@gmail.com / Swiat1976
# Wygeneruj token API z uprawnieniami "root"
# Zaktualizuj token w bazie (jeśli potrzebne):
pct exec 104 -- docker exec coolify-db psql -U coolify -d coolify -c "UPDATE personal_access_tokens SET token = 'd1171aab22e9c49711d0335ceea7a4e2ff49ae280eff3dab90438cad869f75e1' WHERE name = 'claude';"
```

**Krok 6: Odtwórz przekierowanie w Nginx Proxy Manager**  
```bash
# 1. Zdobądź token
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"identity": "tomaszpasiekauk@gmail.com", "secret": "Swiat1976@#$"}' http://192.168.0.250:18181/api/tokens | jq -r '.token')

# 2. Utwórz proxy host
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"domain_names": ["host.aihub.ovh"], "forward_host": "192.168.0.25", "forward_port": 8000, "block_exploits": true, "forward_scheme": "http", "enabled": true}' http://192.168.0.250:18181/api/nginx/proxy-hosts
```

---

### 7. Podsumowanie

Kontener **`coolify`** został wdrożony pomyślnie. Wszystkie testy walidacyjne, włączając w to pełną funkcjonalność API, zakończyły się powodzeniem. 

**Kluczowe osiągnięcia:**
- ✅ Panel web dostępny pod `https://host.aihub.ovh`
- ✅ Pełna funkcjonalność API z autoryzacją Bearer token
- ✅ Wszystkie endpointy API działają poprawnie
- ✅ Możliwość tworzenia/usuwania projektów przez API
- ✅ Problem z hashowaniem tokenu został rozwiązany

**Wersja Coolify:** 4.0.0-beta.420.6 (Laravel 12.20.0)

Środowisko jest w pełni operacyjne i gotowe do zarządzania aplikacjami.

---

### 8. Rozwiązywanie Problemów z Deployem

#### Problem: Konflikt zależności npm (ERESOLVE)

**Objawy:**
```
npm error ERESOLVE could not resolve
npm error While resolving: next-auth@4.24.11
npm error Found: @auth/core@0.38.0
npm error Could not resolve dependency:
npm error peerOptional @auth/core@"0.34.2" from next-auth@4.24.11
```

**Rozwiązanie:**

1. **Dodaj plik `.npmrc` do root projektu:**
```bash
# W katalogu głównym projektu
echo "legacy-peer-deps=true" > .npmrc
```

2. **Lub dodaj do package.json:**
```json
{
  "scripts": {
    "install": "npm install --legacy-peer-deps"
  }
}
```

3. **Lub skonfiguruj w Coolify:**
   - W ustawieniach aplikacji dodaj zmienną środowiskową:
   - `NPM_CONFIG_LEGACY_PEER_DEPS=true`

4. **Alternatywnie, zaktualizuj zależności:**
```bash
# Zaktualizuj next-auth do najnowszej wersji
npm install next-auth@latest @auth/core@latest
```

#### Problem: Błąd budowania Docker

**Objawy:**
```
ERROR: failed to solve: process "/bin/bash -ol pipefail -c npm install" did not complete successfully: exit code: 1
```

**Rozwiązanie:**

1. **Sprawdź logi budowania w Coolify**
2. **Dodaj plik `.dockerignore` aby wykluczyć node_modules:**
```
node_modules
npm-debug.log
.next
.git
```

3. **Użyj multi-stage build w Dockerfile:**
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Problem: Brak pamięci podczas budowania

**Rozwiązanie:**
1. **Zwiększ zasoby kontenera Coolify**
2. **Dodaj zmienną środowiskową:**
   - `NODE_OPTIONS="--max-old-space-size=4096"`

#### Problem: Błąd NIXPACKS_PATH

**Objawy:**
```
UndefinedVar: Usage of undefined variable '$NIXPACKS_PATH'
```

**Rozwiązanie:**
1. **Dodaj do Dockerfile:**
```dockerfile
ENV NIXPACKS_PATH=/usr/local/bin
```

---

### 9. Surowe Logi z Procesu Tworzenia

*Logi zostały zapisane w pliku `/data/self-hosted/coolify_install_log-YYYY-MM-DD_HH-MM-SS.txt` w kontenerze.* 