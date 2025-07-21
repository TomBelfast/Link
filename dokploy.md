# Dokploy – Kompletny Przewodnik Użytkownika (Self-Hosted)

---

**Adres panelu:**  
http://192.168.0.160:3000/dashboard/settings/server

---

## 1. Instalacja

**Wymagania:**
- Serwer z Docker i Docker Swarm (np. Ubuntu 22.04/24.04)
- Dostęp root

**Instalacja jednym poleceniem:**
```bash
curl -sSL https://dokploy.com/install.sh | sh
```
Po zakończeniu instalacji panel webowy będzie dostępny na porcie 3000:
```
http://192.168.0.160:3000
```

---

## 2. Pierwsze logowanie i konfiguracja administratora

1. Otwórz przeglądarkę i przejdź pod adres `http://192.168.0.160:3000`.
2. Utwórz konto administratora (formularz rejestracji pojawi się przy pierwszym uruchomieniu).
3. Zaloguj się na utworzone konto.

---

## 3. Tworzenie i zarządzanie projektami

### **Tworzenie projektu**
- W panelu kliknij „New Project” lub „Create Project”.
- Podaj nazwę, opis i zatwierdź.

### **Dodawanie aplikacji**
- Wybierz projekt, kliknij „Add Application”.
- Wskaż typ aplikacji (np. Node.js, Python, PHP, Go, Docker Compose).
- Podaj repozytorium (GitHub, GitLab, Bitbucket, Docker Registry) lub wybierz szablon.
- Skonfiguruj zmienne środowiskowe, build type, provider (np. Docker, GitHub).

### **Zarządzanie aplikacją**
- Start/Stop/Restart aplikacji.
- Redeploy (ponowne wdrożenie z najnowszego kodu).
- Podgląd logów, monitorowanie zasobów (CPU, RAM, sieć).
- Edycja zmiennych środowiskowych i Traefik (reverse proxy).

---

## 4. Bazy danych

Dokploy obsługuje:
- MySQL
- PostgreSQL
- MariaDB
- MongoDB
- Redis

**Dodawanie bazy:**
- W projekcie kliknij „Add Database”.
- Wybierz typ bazy, ustaw hasła, porty, opcjonalnie zdefiniuj backupy.
- Baza zostanie uruchomiona jako osobny kontener.

---

## 5. Backupy

- Możesz skonfigurować automatyczne backupy baz danych do zewnętrznego storage (np. S3, FTP).
- Ustaw harmonogram i miejsce docelowe w sekcji „Backups”.

---

## 6. Zarządzanie przez API/CLI

Dokploy udostępnia API (REST) oraz CLI (jeśli zainstalowane).

**Przykład pobrania wszystkich projektów przez API:**
```bash
curl -X 'GET' \
  'http://192.168.0.160:3000/api/project.all' \
  -H 'accept: application/json' \
  -H 'x-api-key: TWÓJ_API_KEY'
```
API Key generujesz w panelu w sekcji „Profile” lub „Settings”.

---

## 7. Integracja z Traefik

- Dokploy automatycznie konfiguruje Traefik jako reverse proxy.
- Możesz edytować reguły, dodać własne domeny, certyfikaty SSL (Let's Encrypt).

---

## 8. Monitoring i powiadomienia

- W panelu masz podgląd na zużycie CPU, RAM, dysku, sieci dla każdej aplikacji i bazy.
- Możesz skonfigurować powiadomienia (Slack, Discord, Telegram, Email) o statusie wdrożeń.

---

## 9. Skalowanie i Multi-Node

- Dzięki Docker Swarm możesz dodać kolejne serwery do klastra.
- W panelu pojawi się opcja wyboru węzła docelowego dla aplikacji/bazy.

---

## 10. Przykładowe operacje API

**Tworzenie użytkownika:**
```
POST /auth.createUser
```
**Logowanie:**
```
POST /auth.login
```
**Tworzenie aplikacji:**
```
POST /application.create
```
**Tworzenie bazy MongoDB:**
```
POST /mongo.create
```
**Sprawdzanie zdrowia systemu:**
```
GET /settings.health
```
**Pełna dokumentacja API:**  
`http://192.168.0.160:3000/swagger`

---

## 11. Najczęstsze problemy

- **Brak dostępu do panelu:** Upewnij się, że port 3000 jest otwarty w firewallu.
- **Problemy z DNS:** Sprawdź `/etc/resolv.conf` i ustaw `nameserver 8.8.8.8`.
- **Brak narzędzia CLI:** Panel webowy jest głównym narzędziem zarządzania, CLI jest opcjonalne.

---

## 12. Dokumentacja i wsparcie

- Oficjalna dokumentacja: [docs.dokploy.com](https://docs.dokploy.com)
- API: `http://192.168.0.160:3000/swagger`
- Repozytorium: [github.com/dokploy/website](https://github.com/dokploy/website)

---

**Gotowe!**
Masz pełną, praktyczną dokumentację krok po kroku do zarządzania Dokploy na własnym serwerze. 

---

## 13. Przykładowy API Key i testowanie endpointów

**Twój API Key:**
```
DokplooygSAjbwlMmhkAHSRdRskUHWeekjJDPomdMhiQLdlsXQPjCgvSbJjdRGGEbkLJDWxu
```

**Przykładowe zapytania do API (z nowym adresem i kluczem):**

### Pobranie wszystkich projektów
```bash
curl -X 'GET' \
  'https://dok.aihub.ovh/api/project.all' \
  -H 'accept: application/json' \
  -H 'x-api-key: DokplooygSAjbwlMmhkAHSRdRskUHWeekjJDPomdMhiQLdlsXQPjCgvSbJjdRGGEbkLJDWxu'
```

### Tworzenie użytkownika
```bash
curl -X POST 'https://dok.aihub.ovh/api/auth.createUser' \
  -H 'accept: application/json' \
  -H 'x-api-key: DokplooygSAjbwlMmhkAHSRdRskUHWeekjJDPomdMhiQLdlsXQPjCgvSbJjdRGGEbkLJDWxu' \
  -d '{"email":"user@example.com","password":"TwojeHaslo"}'
```

### Logowanie
```bash
curl -X POST 'https://dok.aihub.ovh/api/auth.login' \
  -H 'accept: application/json' \
  -H 'x-api-key: DokplooygSAjbwlMmhkAHSRdRskUHWeekjJDPomdMhiQLdlsXQPjCgvSbJjdRGGEbkLJDWxu' \
  -d '{"email":"user@example.com","password":"TwojeHaslo"}'
```

### Tworzenie aplikacji
```bash
curl -X POST 'https://dok.aihub.ovh/api/application.create' \
  -H 'accept: application/json' \
  -H 'x-api-key: DokplooygSAjbwlMmhkAHSRdRskUHWeekjJDPomdMhiQLdlsXQPjCgvSbJjdRGGEbkLJDWxu' \
  -d '{...}'
```

### Tworzenie bazy MongoDB
```bash
curl -X POST 'https://dok.aihub.ovh/api/mongo.create' \
  -H 'accept: application/json' \
  -H 'x-api-key: DokplooygSAjbwlMmhkAHSRdRskUHWeekjJDPomdMhiQLdlsXQPjCgvSbJjdRGGEbkLJDWxu' \
  -d '{...}'
```

### Sprawdzanie zdrowia systemu
```bash
curl -X GET 'https://dok.aihub.ovh/api/settings.health' \
  -H 'accept: application/json' \
  -H 'x-api-key: DokplooygSAjbwlMmhkAHSRdRskUHWeekjJDPomdMhiQLdlsXQPjCgvSbJjdRGGEbkLJDWxu'
```

---

**Wszystkie powyższe zapytania możesz testować bezpośrednio z terminala lub narzędzi typu Postman.**

--- 