# 02 - Developer Setup

[← Zurück zum Wiki](../WIKI.md)

---

## 📋 Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Entwicklungs-Workflow](#entwicklungs-workflow)
- [Scripts](#scripts)
- [Projektstruktur](#projektstruktur)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Troubleshooting](#troubleshooting)

---

## 🛠️ Voraussetzungen

### Required Software

| Software | Mindestversion | Download |
|----------|---------------|----------|
| **Node.js** | 20.x | https://nodejs.org/ |
| **npm** | 10.x | (inkludiert in Node.js) |
| **Docker** | 24.x | https://www.docker.com/ |
| **Docker Compose** | 2.x | (inkludiert in Docker Desktop) |
| **Git** | 2.x | https://git-scm.com/ |

### Optional (Empfohlen)

- **VS Code** (https://code.visualstudio.com/)
  - Extensions:
    - ESLint
    - Prettier
    - TypeScript and JavaScript Language Features
    - Tailwind CSS IntelliSense
    - MongoDB for VS Code (optional)
- **Postman** oder **Insomnia** (für API-Testing)
- **MongoDB Compass** (GUI für MongoDB, optional)

### System-Requirements

- **OS**: macOS, Windows, Linux
- **RAM**: min. 8 GB (16 GB empfohlen)
- **Festplatte**: ca. 2 GB für Projekt + Dependencies

---

## 📥 Installation

### 1. Repository klonen

```bash
git clone <repository-url>
cd trainem
```

### 2. Dependencies installieren

Das Projekt hat einen Monorepo-Ansatz mit drei Hauptbereichen:
- `/backend` - Express API
- `/frontend` - React App
- `/shared` - Gemeinsame TypeScript-Typen

**Alle Dependencies auf einmal installieren**:
```bash
npm run install:all
```

**Oder manuell**:
```bash
# Root Dependencies (Concurrently, Linting)
npm install

# Backend Dependencies
cd backend
npm install

# Frontend Dependencies
cd ../frontend
npm install
```

### 3. MongoDB starten

Das Projekt nutzt Docker für MongoDB:

```bash
cd backend
docker compose up -d
```

**Prüfen, ob MongoDB läuft**:
```bash
docker ps | grep my_database
```

Erwartete Ausgabe:
```
9bbe230bdd2f   mongo:latest   ...   Up 2 days   0.0.0.0:27017->27017/tcp   my_database
```

### 4. Backend konfigurieren

Das Backend nutzt `config/default.json` für Konfiguration:

**`backend/config/default.json`**:
```json
{
  "server": {
    "port": 3000
  },
  "database": {
    "uri": "mongodb://localhost:27017/trainem"
  },
  "auth0": {
    "domain": "dev-wmcuuu42i1iqwc5e.us.auth0.com",
    "audience": "https://trainem.authentication"
  }
}
```

> **Hinweis**: Keine `.env`-Datei erforderlich, da Auth0-Config in `config/` liegt.

### 5. App starten

**Development Mode** (Frontend + Backend parallel):
```bash
npm run dev
```

Dies startet:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

**Separate Starts** (optional):
```bash
# Nur Backend
npm run backend

# Nur Frontend
npm run frontend
```

---

## 🔄 Entwicklungs-Workflow

### Täglicher Workflow

1. **Git aktualisieren**:
   ```bash
   git pull origin main
   ```

2. **Feature-Branch erstellen**:
   ```bash
   git checkout -b feature/dein-feature-name
   ```

3. **MongoDB starten** (falls nicht läuft):
   ```bash
   cd backend && docker compose up -d
   ```

4. **App starten**:
   ```bash
   npm run dev
   ```

5. **Entwickeln & Testen**:
   - Backend Auto-Reload via `nodemon`
   - Frontend Hot Module Replacement via `vite`

6. **Code linting**:
   ```bash
   npm run lint
   ```

7. **Code formatieren**:
   ```bash
   npm run format
   ```

8. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: beschreibung deines features"
   git push origin feature/dein-feature-name
   ```

9. **Merge Request erstellen** auf GitLab

### Branch-Strategie

- `main` - Stabiler Production Code
- `develop` - Integration Branch (falls verwendet)
- `feature/*` - Feature-Entwicklung
- `bugfix/*` - Bugfixes
- `hotfix/*` - Dringende Fixes für Production

---

## 📜 Scripts

### Root-Level Scripts (`package.json`)

```json
{
  "dev": "concurrently \"npm run backend\" \"npm run frontend\"",
  "backend": "npm --prefix backend start",
  "frontend": "npm --prefix frontend run dev",
  "install:all": "npm --prefix frontend install && npm --prefix backend install && npm install",
  "lint": "eslint \"frontend/src/**/*.{ts,tsx}\" \"backend/src/**/*.ts\" \"shared/**/*.ts\"",
  "format": "prettier --write '{src,tests}/**/*.{ts,json,md}'"
}
```

### Backend Scripts (`backend/package.json`)

```json
{
  "start": "nodemon src/Server.ts",        // Dev-Server mit Auto-Reload
  "build": "tsc",                          // TypeScript Compilation
  "test": "jest",                          // Tests ausführen
  "test:watch": "jest --watch"             // Tests im Watch-Mode
}
```

### Frontend Scripts (`frontend/package.json`)

```json
{
  "dev": "vite",                           // Dev-Server starten
  "build": "tsc -b && vite build",         // Production Build
  "preview": "vite preview",               // Preview Production Build
  "lint": "eslint ."                       // ESLint ausführen
}
```

---

## 📁 Projektstruktur

```
trainem/
├── backend/
│   ├── config/
│   │   └── default.json          # Server & DB Config
│   ├── src/
│   │   ├── database/             # MongoDB Connection
│   │   ├── endpoints/            # API Routes & Services
│   │   │   ├── users/
│   │   │   │   ├── UserModel.ts
│   │   │   │   ├── UserService.ts
│   │   │   │   └── UserRoute.ts
│   │   │   ├── workouts/
│   │   │   ├── habits/
│   │   │   ├── entries/
│   │   │   ├── exercises/
│   │   │   └── pixelArt/
│   │   ├── utils/                # Helper Functions
│   │   ├── errors/               # Error Handling
│   │   └── Server.ts             # Entry Point
│   ├── __tests__/                # Jest Tests
│   ├── docker-compose.yml        # MongoDB Container
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui Components (40+)
│   │   │   ├── dashboardkacheln/ # Dashboard Widgets
│   │   │   ├── statistiken/      # Charts
│   │   │   ├── trainingsplan/    # Workout Components
│   │   │   └── pixel/            # Pixel-Art Components
│   │   ├── pages/
│   │   │   ├── OnboardingSteps/  # 7 Onboarding Pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Workouts.tsx
│   │   │   ├── Habits.tsx
│   │   │   ├── Statistics.tsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AppContext.tsx    # Global State
│   │   │   └── OnboardingContext.tsx
│   │   ├── hooks/                # Custom Hooks
│   │   ├── util/                 # Helpers
│   │   ├── lib/                  # Libraries
│   │   ├── App.tsx               # Router
│   │   ├── main.tsx              # Entry Point
│   │   └── MockAuth0Provider.tsx # Dev Mock
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── shared/
│   ├── sharedTypes.ts            # Shared TypeScript Types
│   └── types/
│       └── other/                # Additional Types
│
├── docs/                         # Projekt-Dokumentation
├── node_modules/
├── package.json                  # Root Package (Scripts)
├── eslint.config.js
├── .prettierrc.json
├── .gitignore
└── README.md
```

### Wichtige Ordner

| Ordner | Beschreibung |
|--------|--------------|
| `/backend/src/endpoints/` | Alle API-Endpunkte (Model-Service-Route Pattern) |
| `/frontend/src/components/ui/` | shadcn/ui Components (Copy-Paste Library) |
| `/frontend/src/pages/` | Route-Pages (React Router) |
| `/frontend/src/context/` | Global State Management (React Context) |
| `/shared/` | Gemeinsame Types für Frontend & Backend |

---

## 🔑 Umgebungsvariablen

### Backend

**Keine `.env`-Datei erforderlich!** Konfiguration liegt in:
- `backend/config/default.json` - Default Config
- `backend/config/production.json` - Production Overrides (optional)

**Config-Format**:
```json
{
  "server": { "port": 3000 },
  "database": { "uri": "mongodb://localhost:27017/trainem" },
  "auth0": {
    "domain": "dev-wmcuuu42i1iqwc5e.us.auth0.com",
    "audience": "https://trainem.authentication"
  }
}
```

### Frontend

**Keine `.env` erforderlich** - Auth0-Config ist hardcoded in `main.tsx`.

**Falls Environment Variables benötigt**:
```bash
# .env.local (wird von Vite gelesen)
VITE_API_URL=http://localhost:3000
VITE_AUTH0_DOMAIN=dev-wmcuuu42i1iqwc5e.us.auth0.com
VITE_AUTH0_CLIENT_ID=g8BoaEXH4lB7gRMqRc8F0ruGLvy9OXkD
```

Zugriff in React:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🐛 Troubleshooting

### Problem: MongoDB verbindet nicht

**Symptom**:
```
[error] MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**Lösung**:
```bash
# 1. Prüfen ob Container läuft
docker ps | grep my_database

# 2. Falls nicht, starten
cd backend
docker compose up -d

# 3. Logs prüfen
docker logs my_database
```

### Problem: Auth0 Callback Error

**Symptom**:
```
Callback URL mismatch
```

**Lösung (Dev Mode)**:
Die App nutzt im Dev-Mode `MockAuth0Provider` - kein echter Auth0-Login nötig!

Siehe [frontend/src/main.tsx:13-19](../frontend/src/main.tsx#L13-L19)

**Für echten Auth0**: Callback URL in Auth0 Dashboard hinzufügen:
- `http://localhost:5173/callback`

### Problem: Port 3000 bereits belegt

**Symptom**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Lösung**:
```bash
# Port freigeben (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Oder Backend-Port ändern in backend/config/default.json
{
  "server": { "port": 3001 }
}
```

### Problem: Frontend Build-Fehler

**Symptom**:
```
Failed to resolve import "@radix-ui/react-dropdown-menu"
```

**Lösung**:
```bash
# Frontend Dependencies neu installieren
cd frontend
rm -rf node_modules
npm install
```

### Problem: TypeScript Errors in Shared Types

**Symptom**:
```
Cannot find module 'trainem' or its corresponding type declarations
```

**Lösung**:
```bash
# Shared Types sind als Dependency eingebunden
# Frontend package.json:
"dependencies": {
  "trainem": "file:.."
}

# Nach Änderungen in /shared:
cd frontend
npm install
```

### Problem: ESLint/Prettier Konflikte

**Symptom**:
Formatierung wird ständig geändert.

**Lösung**:
```bash
# Prettier ausführen (formatiert alles)
npm run format

# ESLint Fehler fixen
npm run lint -- --fix
```

---

## 🚀 Next Steps

Nach erfolgreichem Setup:

1. **API testen**: Öffne http://localhost:3000/api/exercises
2. **Frontend öffnen**: http://localhost:5173
3. **Onboarding durchlaufen**: Wird automatisch angezeigt
4. **API-Doku lesen**: [docs/03-API-Dokumentation.md](03-API-Dokumentation.md)
5. **Code-Style Guide**: [In ESLint Config definiert](../eslint.config.js)

---

## 📞 Hilfe & Support

**Bei Problemen**:
1. Prüfe [Troubleshooting](#troubleshooting)
2. Suche in GitLab Issues
3. Frage im Team-Chat
4. Erstelle ein neues Issue

---

**Letzte Aktualisierung**: 2026-01-24

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu API-Dokumentation →](03-API-Dokumentation.md)
