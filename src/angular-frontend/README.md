# Culina Angular Frontend

Culina ist eine Rezept-Webanwendung entwickelt mit Angular, die Benutzern ermöglicht, Rezepte hochzuladen, zu bewerten und zu entdecken.

## 🚀 Features

✅ **Benutzer-Authentifikation**
- Registrierung mit Name, E-Mail und Passwort
- Login mit JWT-Token-Verwaltung
- Automatisches Token-Management im localStorage

✅ **Rezept-Upload mit Datei-Upload**
- Formular mit Titel, Beschreibung, Zutaten und Anweisungen
- Bildupload mit Vorschau-Funktion
- FormData-basierter Upload an PHP-Backend

✅ **Asynchrone Ajax-Bewertungen**
- Bewertungen ohne Seitenreload hinzufügen
- 5-Sterne-Bewertungssystem
- Optionale Kommentare

✅ **Clientseitiger JavaScript/TypeScript-Code**
- Alle console.log-Ausgaben zeigen Ajax-Requests
- Services für API-Kommunikation
- Reactive Forms und Data Binding

## 📁 Projektstruktur

```
angular-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── recipe-grid/
│   │   │   ├── recipe-detail/
│   │   │   ├── upload-recipe/
│   │   │   ├── login-dialog/
│   │   │   └── register-dialog/
│   │   ├── models/
│   │   │   └── recipe.model.ts
│   │   ├─�� services/
│   │   │   ├── auth.service.ts
│   │   │   └── recipe.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.module.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation & Setup

### Voraussetzungen
- Node.js (v18 oder höher)
- npm oder yarn
- Angular CLI (`npm install -g @angular/cli`)

### 1. Abhängigkeiten installieren

```bash
cd angular-frontend
npm install
```

### 2. PHP-Backend konfigurieren

Stellen Sie sicher, dass das PHP-Backend läuft:

```bash
cd ../backend
php -S localhost:8000
```

### 3. API-URL anpassen (optional)

Öffnen Sie `src/environments/environment.ts` und passen Sie die API-URL an:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'  // Ihre Backend-URL
};
```

### 4. Development Server starten

```bash
npm start
# oder
ng serve
```

Die Anwendung ist unter `http://localhost:4200` verfügbar.

### 5. Produktion Build

```bash
npm run build
# oder
ng build --configuration production
```

Die Build-Dateien befinden sich im `dist/` Ordner.

## 📡 API-Integration

Alle API-Calls werden über Services durchgeführt und loggen die Request-Details in die Konsole:

### AuthService

```typescript
// Registrierung
this.authService.register(name, email, password).subscribe(response => {
  console.log('📤 Ajax-Request an PHP-Backend: /api/auth/register.php');
});

// Login
this.authService.login(email, password).subscribe(response => {
  console.log('📤 Ajax-Request an PHP-Backend: /api/auth/login.php');
});
```

### RecipeService

```typescript
// Rezepte laden
this.recipeService.getRecipes().subscribe(response => {
  console.log('📤 Ajax-Request an PHP-Backend: /api/recipes/list.php');
});

// Rezept erstellen (mit Datei-Upload)
this.recipeService.createRecipe(formData).subscribe(response => {
  console.log('📤 Ajax-Request (FormData) an PHP-Backend: /api/recipes/create.php');
});

// Bewertung erstellen (asynchron)
this.recipeService.createRating(recipeId, rating, comment).subscribe(response => {
  console.log('✅ Bewertung erfolgreich erstellt (Ajax ohne Reload)');
});
```

## 🔑 Authentifizierung

Die Anwendung verwendet JWT-Token für die Authentifizierung:

1. Nach erfolgreicher Registrierung/Login wird der Token im `localStorage` gespeichert
2. Alle geschützten API-Requests senden den Token im `Authorization`-Header:
   ```
   Authorization: Bearer {token}
   ```
3. Token-Gültigkeit: 7 Tage

## 🎨 Styling

Die Anwendung nutzt **Tailwind CSS** für das Styling:

- Responsive Design
- Mobile-First Ansatz
- Utility-First CSS-Klassen
- Custom Orange-Theme für Culina-Branding

## 📦 Komponenten-Übersicht

### HeaderComponent
- Navigation und Logo
- Benutzer-Anzeige mit Avatar
- Login/Logout-Funktionalität

### RecipeGridComponent
- Grid-Layout für Rezeptübersicht
- Lazy Loading Support
- Mock-Daten Fallback

### RecipeDetailComponent
- Vollständige Rezeptansicht
- Zutaten und Zubereitungsschritte
- Bewertungsformular (asynchron)
- Bewertungsliste

### UploadRecipeComponent
- Mehrstufiges Formular
- Dynamische Zutaten/Anweisungen-Listen
- Bildupload mit Vorschau
- FormData-basierter Upload

### LoginDialogComponent & RegisterDialogComponent
- Modal-Dialoge für Authentifizierung
- Formular-Validierung
- Error-Handling

## 🧪 Testing

```bash
# Unit Tests
ng test

# E2E Tests (falls konfiguriert)
ng e2e
```

## 🚢 Deployment

### Build für Produktion

```bash
ng build --configuration production
```

### Environment-Variablen

Bearbeiten Sie `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://ihre-domain.com/api'
};
```

### Server-Deployment

Kopieren Sie die Dateien aus `dist/culina-angular` auf Ihren Webserver (z.B. Apache, Nginx).

Nginx-Konfiguration für Angular (wichtig für Client-Side Routing):

```nginx
server {
    listen 80;
    server_name ihre-domain.com;
    root /var/www/culina-angular;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔍 Console.log Ausgaben

Die Anwendung zeigt alle Ajax-Requests in der Browser-Konsole:

```
📤 Ajax-Request wird an PHP-Backend gesendet:
   Endpoint: http://localhost:8000/api/recipes/list.php
   Method: GET
   Params: { page: 1, limit: 20 }

✅ Rezepte erfolgreich geladen: 12

📤 Ajax-Request (asynchron) wird an PHP-Backend gesendet:
   Endpoint: http://localhost:8000/api/ratings/create.php
   Method: POST
   Data: { recipe_id: 1, rating: 5, comment: "Sehr lecker!" }

✅ Bewertung erfolgreich erstellt (Ajax ohne Reload)
```

## 📋 Anforderungen erfüllt

✅ **Benutzer-Authentifikation**
- Login: `src/app/components/login-dialog/`
- Registrierung: `src/app/components/register-dialog/`
- Service: `src/app/services/auth.service.ts`

✅ **Dateiupload**
- Upload-Komponente: `src/app/components/upload-recipe/`
- FormData mit Bild: Zeile 62-70 in `upload-recipe.component.ts`

✅ **Clientseitiger JavaScript-Code**
- TypeScript Services und Komponenten
- Reactive Programming mit RxJS

✅ **Asynchrone Abfragen (Ajax)**
- Alle HTTP-Requests verwenden HttpClient
- Bewertungen ohne Seitenreload: `recipe.service.ts` Zeile 61-73

## 💻 Development-Tipps

### Angular DevTools
Installieren Sie die [Angular DevTools](https://angular.io/guide/devtools) Browser-Extension für besseres Debugging.

### Hot Reload
Der Development Server (`ng serve`) unterstützt Hot Module Replacement - Änderungen werden automatisch im Browser aktualisiert.

### Strict Mode
Das Projekt nutzt TypeScript Strict Mode für bessere Type Safety.

## 📚 Weitere Ressourcen

- [Angular Dokumentation](https://angular.io/docs)
- [Tailwind CSS Dokumentation](https://tailwindcss.com/docs)
- [RxJS Dokumentation](https://rxjs.dev/)

## 👥 Für Dozenten/Abgabe

Dieses Projekt demonstriert:

1. **Moderne Angular-Architektur** mit Services, Components und Models
2. **RESTful API-Integration** mit HttpClient und RxJS Observables
3. **Authentifizierung** mit JWT-Token-Management
4. **Datei-Upload** mit FormData und Bildvorschau
5. **Asynchrone Requests** ohne Seitenreload (Ajax)
6. **Responsive Design** mit Tailwind CSS
7. **TypeScript Best Practices** mit Interfaces und Type Safety

Alle Ajax-Requests sind mit `console.log` markiert und zeigen genau, welche Daten an das PHP-Backend gesendet werden.
