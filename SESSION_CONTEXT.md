# 🤖 Session Context für Claude Code

**Letzte Session**: 2026-01-24
**Branch**: `new_design`
**Status**: Entwicklung, Dokumentation fertig

---

## 📋 Projekt-Übersicht

**Trainem** - MERN Fitness & Habit Tracking App mit Gamification

### Tech-Stack
- **Backend**: Express.js + MongoDB (Docker) + Auth0
- **Frontend**: React 19 + Vite + Tailwind CSS + shadcn/ui
- **Database**: MongoDB (Docker Container `my_database`)
- **Auth**: Auth0 (Production) - aktuell Callback-Problem in Dev

### Wichtige Pfade
```
/backend          - Express API (Port 3000)
/frontend         - React App (Port 5173)
/shared           - Gemeinsame TypeScript Types
/docs             - Projektdokumentation (11 Dateien)
WIKI.md           - Haupt-Dokumentations-Index
```

---

## ✅ Was in letzter Session gemacht wurde

### 1. App-Start gefixt
- MongoDB Docker Container läuft bereits
- Frontend Dependencies neu installiert (radix-ui Problem)
- App läuft auf `http://localhost:5173`

### 2. Auth0 Workaround (temporär rückgängig gemacht)
- Problem: Auth0 Callback URL nicht konfiguriert
- Lösung war: `MockAuth0Provider.tsx` für Dev-Mode
- **AKTUELL**: MockAuth zurück zu echtem Auth0Provider
- `MockAuth0Provider.tsx` wurde gelöscht

### 3. Komplette Dokumentation erstellt 📚
**11 Markdown-Dateien** in `/docs`:
1. Projektübersicht (Team, Tech-Stack, Glossar)
2. Developer Setup (Installation, Scripts)
3. API-Dokumentation (alle Endpoints)
4. Architektur & Design (MERN, Patterns)
5. Datenmodelle (MongoDB Schemas)
6. Frontend-Struktur (Komponenten, Routing)
7. User-Dokumentation (Anleitung, FAQ)
8. Deployment (Vercel, Railway, MongoDB Atlas)
9. Testing (Jest, Known Issues)
10. Prozess & Meilensteine (Timeline, ADRs)
11. Lessons Learned (Retrospektive)

**Commit**: `📚 Doku 📚` (gepusht auf `new_design`)

---

## 🔧 Wie man die App startet

```bash
# 1. MongoDB starten (falls nicht läuft)
cd backend
docker compose up -d

# 2. App starten (Backend + Frontend)
cd ..
npm run dev
```

**URLs**:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MongoDB: mongodb://localhost:27017/trainem

---

## ⚠️ Bekannte Probleme

### 1. Auth0 Callback Error
**Problem**:
```
Callback URL mismatch
The provided redirect_uri is not in the list of allowed callback URLs
```

**Grund**:
- `http://localhost:5173/callback` nicht in Auth0 Dashboard konfiguriert
- Team hat keinen Zugang zum Auth0 Dashboard

**Workarounds**:
- **Temporär entfernt**: MockAuth0Provider (User wollte das rückgängig)
- **Lösung**: Auth0 Dashboard-Zugang bekommen & Callback URL hinzufügen

**Für nächste Session**:
- Falls User wieder entwickeln will, MockAuth0Provider wieder aktivieren
- Oder: Auth0 Dashboard konfigurieren

### 2. Fehlende Frontend-Tests
- 0% Test Coverage im Frontend
- Backend: 30% Coverage
- Geplant: Vitest + React Testing Library

### 3. Performance
- Pixel-Art bei großen Grids (>64x64) langsam
- Canvas API statt DOM geplant

---

## 📂 Wichtige Dateien

### Backend
```
backend/src/
├── Server.ts                    # Entry Point
├── database/                    # MongoDB Connection
├── endpoints/
│   ├── users/UserService.ts     # User-Logik
│   ├── workouts/WorkoutService.ts
│   ├── entries/EntryService.ts  # XP-Logik (67 XP/Exercise)
│   └── exercises/               # 50+ Übungen
└── utils/logger.ts              # Winston Logger
```

### Frontend
```
frontend/src/
├── main.tsx                     # Entry (Auth0Provider)
├── App.tsx                      # Router
├── context/AppContext.tsx       # Global State
├── pages/
│   ├── Dashboard.tsx
│   ├── Onboarding.tsx           # 7 Steps
│   └── OnboardingSteps/
├── components/
│   ├── ui/                      # 40+ shadcn Components
│   ├── dashboardkacheln/        # Widgets
│   └── statistiken/             # Charts (Recharts)
└── util/
    ├── level.ts                 # XP → Level Calc
    └── statsHelpers.ts
```

---

## 🎮 Features

### Core Features
- ✅ User-Management (Auth0)
- ✅ Onboarding (7 Schritte)
- ✅ Workouts (Create, Edit, Execute)
- ✅ Habits (Daily/Weekly)
- ✅ Entry-System (Workout-Ausführung)
- ✅ 50+ Exercises mit Videos
- ✅ XP-System (67 XP/Exercise, 10 XP/Habit)
- ✅ Level-Progression
- ✅ Pixel-Art Avatar (32x32)
- ✅ Statistiken (Charts)
- ✅ Streak-Tracking

### Geplant
- [ ] Frontend-Tests
- [ ] E2E-Tests
- [ ] Performance-Optimierung
- [ ] Production Deployment
- [ ] Social Features (V2.0)

---

## 🗂️ Git-Status

**Branch**: `new_design`
**Letzte Commits**:
```
983a4bc - 📚 Doku 📚 (2026-01-24)
eda111c - LandingPage und Onboading verändert
42a9df7 - Sidebar mit shadcn
```

**Untracked Files** (nicht committed):
```
DOKUMENTATION.md                           # Alt, kann gelöscht werden
frontend/src/components/StatistikenArea.tsx
frontend/src/components/statistiken/
frontend/src/components/trainingsplan/
frontend/src/util/statsHelpers.ts
trainem/                                    # Unbekannt, prüfen
```

---

## 💡 Nächste Schritte (Vorschläge)

### Sofort
1. **Auth0-Problem lösen**:
   - Option A: MockAuth0Provider wieder aktivieren für Dev
   - Option B: Auth0 Dashboard-Zugang bekommen

2. **Untracked Files committen**:
   - `StatistikenArea.tsx`, `statistiken/`, etc.
   - `trainem/` Ordner prüfen (was ist das?)

### Kurzfristig
3. **Frontend-Tests schreiben**
4. **Performance-Optimierung** (Pixel-Art)
5. **Deployment vorbereiten**

### Mittelfristig
6. **Production Deployment** (Vercel + Railway)
7. **MongoDB Atlas** statt lokalem Docker
8. **Monitoring** (Sentry)

---

## 🔑 Wichtige Credentials

**MongoDB**:
- Local: `mongodb://localhost:27017/trainem`
- Container: `my_database` (Port 27017)

**Auth0** (siehe `frontend/src/main.tsx`):
- Domain: `dev-wmcuuu42i1iqwc5e.us.auth0.com`
- Client ID: `g8BoaEXH4lB7gRMqRc8F0ruGLvy9OXkD`
- Audience: `https://trainem.authentication`

**Ports**:
- Frontend: 5173
- Backend: 3000
- MongoDB: 27017

---

## 📚 Dokumentation

**Haupt-Einstieg**: [WIKI.md](WIKI.md)

Alle Docs in `/docs/`:
- Setup: [02-Developer-Setup.md](docs/02-Developer-Setup.md)
- API: [03-API-Dokumentation.md](docs/03-API-Dokumentation.md)
- Architektur: [04-Architektur-Design.md](docs/04-Architektur-Design.md)

---

## 🐛 Debugging-Tipps

**MongoDB nicht erreichbar?**
```bash
docker ps | grep my_database
docker compose up -d
```

**Frontend Build-Fehler?**
```bash
cd frontend
rm -rf node_modules
npm install
```

**Backend startet nicht?**
```bash
cd backend
npm install
```

**Logs prüfen**:
```bash
# Wenn App im Background läuft
tail -f /private/tmp/claude/-Users-daboy-Documents-Projekt-trainem/tasks/*.output
```

---

## 🎯 Projektkontext für KI

**Team**: 4 Studierende (Namen in Docs TODO)
**Zweck**: Uni-Projekt (Abgabe Feb 2026)
**Entwicklungszeit**: Nov 2025 - Jan 2026 (3 Monate)
**Status**: MVP fertig, Doku fertig, Testing & Deployment offen

**Besonderheiten**:
- Gamification mit Pixel-Art Avatar
- 50+ vordefinierte Übungen
- shadcn/ui (Copy-Paste Components)
- TypeScript Full-Stack
- Auth0 für Authentifizierung (aktuell Problem in Dev)

**Code-Qualität**:
- ESLint + Prettier aktiv
- Jest Tests im Backend (30% Coverage)
- TypeScript strict mode
- Clean Code angestrebt

---

## 📞 Hilfreiche Kommandos

```bash
# App starten
npm run dev

# Nur Backend
npm run backend

# Nur Frontend
npm run frontend

# Tests (Backend)
cd backend && npm test

# Linting
npm run lint

# Build (Frontend)
cd frontend && npm run build

# MongoDB Container
cd backend && docker compose up -d
cd backend && docker compose down

# Git
git status
git log --oneline -10
git branch -a
```

---

**Erstellt**: 2026-01-24 21:15 Uhr
**Für**: Kontinuität zwischen Claude Code Sessions
**Update**: Bei wichtigen Änderungen diese Datei aktualisieren!

---

## 🤝 Tipps für die nächste Session

1. **Diese Datei lesen** - Kontext verstehen
2. **Git Status prüfen** - Was ist neu?
3. **App starten testen** - Funktioniert alles?
4. **User fragen** - Was ist das Ziel heute?
5. **Dokumentation nutzen** - `/docs` ist vollständig

**Viel Erfolg! 🚀**
