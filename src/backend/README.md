# Culina Backend - PHP API

## Installation & Setup

### 1. Voraussetzungen
- PHP 7.4 oder höher
- MySQL 5.7 oder höher
- Apache/Nginx Webserver
- PDO MySQL Extension

### 2. Datenbank einrichten

```bash
# MySQL Datenbank erstellen
mysql -u root -p < config/schema.sql
```

Oder manuell in phpMyAdmin die Datei `config/schema.sql` importieren.

### 3. Datenbank-Konfiguration anpassen

Bearbeiten Sie `config/database.php` und passen Sie die Zugangsdaten an:

```php
private $host = "localhost";
private $db_name = "culina_db";
private $username = "root";
private $password = "IhrPasswort";
```

### 4. Upload-Verzeichnis erstellen

```bash
mkdir -p uploads
chmod 755 uploads
```

### 5. Server starten

#### Mit PHP Development Server:
```bash
cd backend
php -S localhost:8000
```

#### Mit Apache:
Konfigurieren Sie Ihr Document Root auf das `backend` Verzeichnis.

## API-Endpunkte

### Authentifizierung

#### Registrierung
```
POST /api/auth/register.php
Content-Type: application/json

{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "password": "passwort123"
}

Response:
{
  "success": true,
  "message": "Registrierung erfolgreich",
  "data": {
    "user": {
      "id": 1,
      "name": "Max Mustermann",
      "email": "max@example.com",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Max"
    },
    "token": "eyJ1c2VyX2lkIjoxLCJpYXQiOj..."
  }
}
```

#### Login
```
POST /api/auth/login.php
Content-Type: application/json

{
  "email": "max@example.com",
  "password": "passwort123"
}

Response:
{
  "success": true,
  "message": "Login erfolgreich",
  "data": {
    "user": { ... },
    "token": "eyJ1c2VyX2lkIjoxLCJpYXQiOj..."
  }
}
```

### Rezepte

#### Alle Rezepte abrufen
```
GET /api/recipes/list.php?page=1&limit=20

Response:
{
  "success": true,
  "message": "Rezepte erfolgreich abgerufen",
  "data": {
    "recipes": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### Rezept-Details
```
GET /api/recipes/detail.php?id=1

Response:
{
  "success": true,
  "message": "Rezept erfolgreich abgerufen",
  "data": {
    "id": 1,
    "title": "Pasta Carbonara",
    "description": "...",
    "ingredients": [...],
    "instructions": [...],
    "ratings": [...],
    "averageRating": 4.5
  }
}
```

#### Rezept erstellen
```
POST /api/recipes/create.php
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- title: "Pasta Carbonara"
- description: "Leckere Pasta"
- cookTime: "30 Min"
- difficulty: "Mittel"
- ingredients: ["400g Pasta", "200g Speck", ...]
- instructions: ["Pasta kochen", "Speck braten", ...]
- image: [File]

Response:
{
  "success": true,
  "message": "Rezept erfolgreich erstellt",
  "data": {
    "recipe_id": 7,
    "title": "Pasta Carbonara",
    "image": "uploads/recipe_123456.jpg"
  }
}
```

### Bewertungen

#### Bewertung erstellen (Ajax)
```
POST /api/ratings/create.php
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipe_id": 1,
  "rating": 5,
  "comment": "Sehr lecker!"
}

Response:
{
  "success": true,
  "message": "Bewertung erfolgreich erstellt",
  "data": {
    "rating": {
      "id": 10,
      "userId": 1,
      "userName": "Max Mustermann",
      "rating": 5,
      "comment": "Sehr lecker!",
      "createdAt": "2024-03-15 10:30:00"
    },
    "averageRating": 4.7,
    "totalRatings": 3
  }
}
```

## Authentifizierung

Das Backend verwendet ein vereinfachtes JWT-basiertes Token-System:

1. Nach erfolgreicher Registrierung/Login erhält der Benutzer einen Token
2. Dieser Token muss bei geschützten Endpoints im Authorization-Header mitgesendet werden:
   ```
   Authorization: Bearer {token}
   ```
3. Token ist 7 Tage gültig

## Datei-Upload

- Erlaubte Dateitypen: JPEG, PNG, JPG, GIF
- Maximale Dateigröße: 5 MB
- Dateien werden im `uploads/` Verzeichnis gespeichert
- Eindeutige Dateinamen werden automatisch generiert

## Sicherheit

**WICHTIG für Produktion:**

1. Ändern Sie den Secret Key in `utils/helpers.php`:
   ```php
   $secret = "CULINA_SECRET_KEY_2024"; // Durch sicheren Key ersetzen!
   ```

2. Verwenden Sie HTTPS in Produktion

3. Aktivieren Sie SQL-Injection-Schutz (bereits implementiert via PDO)

4. Konfigurieren Sie CORS für Ihre spezifische Domain:
   ```php
   header("Access-Control-Allow-Origin: https://ihre-domain.com");
   ```

5. Implementieren Sie Rate Limiting für API-Requests

6. Validieren Sie alle Eingaben serverseitig

## Fehlerbehandlung

Alle Fehler werden als JSON zurückgegeben:

```json
{
  "success": false,
  "message": "Fehlerbeschreibung"
}
```

HTTP-Statuscodes:
- 200: Erfolg
- 400: Ungültige Anfrage
- 401: Nicht authentifiziert
- 404: Nicht gefunden
- 405: Methode nicht erlaubt
- 500: Serverfehler

## Verzeichnisstruktur

```
backend/
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   └── register.php
│   ├── recipes/
│   │   ├── create.php
│   │   ├── list.php
│   │   └── detail.php
│   └── ratings/
│       └── create.php
├── config/
│   ├── database.php
│   └── schema.sql
├── utils/
│   └── helpers.php
├── uploads/
│   └── (hochgeladene Bilder)
└── README.md
```

## Beispiel: Frontend-Integration

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
};

// Rezept erstellen
const createRecipe = async (formData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8000/api/recipes/create.php', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData // FormData mit Bild
  });
  
  return await response.json();
};

// Bewertung erstellen (Ajax)
const createRating = async (recipeId, rating, comment) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8000/api/ratings/create.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ recipe_id: recipeId, rating, comment })
  });
  
  return await response.json();
};
```

## Testing

Sie können die API mit Tools wie Postman oder cURL testen:

```bash
# Registrierung testen
curl -X POST http://localhost:8000/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Rezepte abrufen
curl http://localhost:8000/api/recipes/list.php
```
