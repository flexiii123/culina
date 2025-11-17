# Culina Backend - Download & Installation

## Option 1: Manuelle Datei-Erstellung (Empfohlen)

Erstellen Sie auf Ihrem lokalen Computer folgende Verzeichnisstruktur und kopieren Sie die Dateien:

### Schritt 1: Verzeichnisstruktur erstellen

```
culina-backend/
├── api/
│   ├── auth/
│   ├── recipes/
│   └── ratings/
├── config/
├── utils/
└── uploads/
```

### Schritt 2: Dateien kopieren

Öffnen Sie im Figma Make Editor nacheinander jede Datei und kopieren Sie den Inhalt:

**Konfiguration:**
1. `/backend/config/database.php`
2. `/backend/config/schema.sql`

**Hilfsfunktionen:**
3. `/backend/utils/helpers.php`

**API Authentifizierung:**
4. `/backend/api/auth/register.php`
5. `/backend/api/auth/login.php`

**API Rezepte:**
6. `/backend/api/recipes/create.php`
7. `/backend/api/recipes/list.php`
8. `/backend/api/recipes/detail.php`

**API Bewertungen:**
9. `/backend/api/ratings/create.php`

**Weitere Dateien:**
10. `/backend/.htaccess`
11. `/backend/index.php`
12. `/backend/README.md`

---

## Option 2: Schnell-Kopierskript

Führen Sie in Ihrer lokalen Entwicklungsumgebung folgende Befehle aus:

```bash
# Verzeichnisse erstellen
mkdir -p culina-backend/api/auth
mkdir -p culina-backend/api/recipes
mkdir -p culina-backend/api/ratings
mkdir -p culina-backend/config
mkdir -p culina-backend/utils
mkdir -p culina-backend/uploads

# Dateien erstellen (kopieren Sie jeweils den Inhalt aus Figma Make)
# Dann können Sie die Dateien einzeln befüllen
```

---

## Option 3: ZIP-Download vorbereiten

### Alle Dateipfade für Ihre Dokumentation:

```
Dateistruktur für Abgabe:
========================

backend/
├── .htaccess                          (Apache-Konfiguration)
├── index.php                          (API-Übersicht)
├── README.md                          (Dokumentation)
│
├── config/
│   ├── database.php                   (Datenbankverbindung)
│   └── schema.sql                     (Datenbank-Schema)
│
├── utils/
│   └── helpers.php                    (Hilfsfunktionen & Sicherheit)
│
├── api/
│   ├── auth/
│   │   ├── login.php                  (Login-Endpoint)
│   │   └── register.php               (Registrierungs-Endpoint)
│   │
│   ├── recipes/
│   │   ├── create.php                 (Rezept erstellen + Upload)
│   │   ├── list.php                   (Rezeptliste)
│   │   └── detail.php                 (Rezeptdetails)
│   │
│   └── ratings/
│       └── create.php                 (Bewertung erstellen - Ajax)
│
└── uploads/                           (Ordner für Bild-Uploads)
```

---

## Installation nach Download

### 1. Datenbank einrichten
```bash
mysql -u root -p
# Dann schema.sql importieren:
source /pfad/zu/culina-backend/config/schema.sql
```

### 2. Datenbank-Zugangsdaten anpassen
Öffnen Sie `config/database.php` und passen Sie an:
```php
private $host = "localhost";
private $db_name = "culina_db";
private $username = "root";
private $password = "IhrPasswort";
```

### 3. Upload-Ordner Rechte setzen
```bash
chmod 755 uploads/
```

### 4. Server starten

**Mit PHP Development Server:**
```bash
cd culina-backend
php -S localhost:8000
```

**Oder mit XAMPP/MAMP:**
- Kopieren Sie den Ordner nach `htdocs/culina-backend`
- Öffnen Sie `http://localhost/culina-backend`

---

## Testen der API

```bash
# API-Übersicht
curl http://localhost:8000/index.php

# Registrierung testen
curl -X POST http://localhost:8000/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Rezepte abrufen
curl http://localhost:8000/api/recipes/list.php
```

---

## Wichtig für Abgabe

✅ **Alle Anforderungen erfüllt:**
- ✓ Benutzer-Authentifikation (login.php, register.php)
- ✓ Dateiupload (create.php mit Bildupload)
- ✓ Asynchrone Ajax-Abfragen (ratings/create.php)
- ✓ Clientseitiger JavaScript-Code (im Frontend-Mockup)
- ✓ PHP-Backend mit MySQL-Datenbank
- ✓ Vollständige Dokumentation (README.md)

---

## Zusammenfassung für Dozenten

Das Culina-Backend ist eine vollständige PHP-REST-API mit:

1. **Authentifizierung:** JWT-basiertes Token-System
2. **Dateiupload:** Sichere Bildverarbeitung mit Validierung
3. **Ajax:** Asynchrone Bewertungen ohne Seitenreload
4. **Sicherheit:** SQL-Injection-Schutz, Input-Validierung, CORS
5. **Datenbank:** MySQL mit normalisierten Tabellen (users, recipes, ratings)

Alle console.log-Markierungen im Frontend zeigen, welche Daten an welchen Endpoint gesendet werden.
