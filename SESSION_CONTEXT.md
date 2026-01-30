# Session Context für Claude Code

**Letzte Session**: 2026-01-29
**Branch**: `release-final`
**Status**: Release-ready, Build erfolgreich, Dokumentation aktualisiert

---

## Projekt-Übersicht

**Trainem** - MERN Fitness & Habit Tracking App mit Gamification

### Tech-Stack
- **Backend**: Express.js 5.1 + MongoDB (Docker) + Auth0
- **Frontend**: React 19.1 + Vite 7.1 + Tailwind CSS 4.1 + shadcn/ui
- **Database**: MongoDB (Docker Container)
- **Auth**: Auth0 (OAuth2 JWT)

### Wichtige Pfade
```
/backend          - Express API (Port 3000)
/frontend         - React App (Port 5173)
/shared           - Gemeinsame TypeScript Types (sharedTypes.ts)
/docs             - Projektdokumentation (11 Dateien)
DOKUMENTATION.md  - Haupt-Dokumentation (aktualisiert)
WIKI.md           - Dokumentations-Index
```

---

## Was in dieser Session gemacht wurde

### 1. Build-Fehler gefixt
- Unused imports entfernt (useCallback, Button, React)
- 28 unbenutzte UI-Komponenten gelöscht (accordion, carousel, toast, etc.)
- Frontend Build: ERFOLGREICH
- Backend Build: ERFOLGREICH

### 2. Release-Branch erstellt
- Neuer Branch `release-final` aus `pixelwars` erstellt
- `new_design` Branch gemerged (landingpage + onboarding)
- Alle relevanten Features zusammengeführt

### 3. Dokumentation aktualisiert
- `DOKUMENTATION.md` komplett überarbeitet
- `docs/06-Frontend-Struktur.md` an aktuellen Stand angepasst
- Alle Features dokumentiert: Workouts, Habits, Entries, Groups, Pixel Wars

### 4. Code geprüft
- XP-System: 67 XP pro Übung, 10 XP pro Habit
- Groups: XP-Sharing zu allen Gruppen des Users
- Battles: XP wird zu aktiven Battles hinzugefügt
- API-Endpoints: 9 Route-Module registriert

---

## App starten

```bash
# 1. MongoDB starten
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

## Features (vollständig implementiert)

### Core Features
- User-Management (Auth0)
- Onboarding (6 Schritte)
- Workouts (Create, Edit, Execute)
- Habits (Daily/Weekly)
- Entry-System (Workout-Ausführung)
- 50+ Exercises mit Videos
- XP-System (67 XP/Exercise, 10 XP/Habit)
- Level-Progression
- Pixel-Art Avatar (32x32)
- Streak-Tracking

### Gruppen
- Gruppen erstellen (öffentlich/privat)
- Gruppen beitreten/verlassen
- Gemeinsam XP sammeln
- Rollen: Owner, Admin, Member

### Pixel Wars
- 1v1 Battles zwischen Gruppen
- Challenge erstellen, annehmen, ablehnen
- Pixel auf geteiltem Canvas setzen
- XP automatisch zum Battle hinzugefügt
- Live-Score Tracking
- Winner-Ermittlung nach Zeitablauf

---

## API-Routen

| Route | Beschreibung |
|-------|--------------|
| `/api/user` | User-Management, Onboarding |
| `/api/workouts` | Workout CRUD |
| `/api/habits` | Habit CRUD |
| `/api/entries` | Abgeschlossene Workouts/Habits |
| `/api/exercises` | 50+ Übungen (öffentlich) |
| `/api/pixel-art` | Pixel-Art Avatar |
| `/api/groups` | Gruppen CRUD |
| `/api/pixelwar` | Seasons, Leaderboards |
| `/api/pixelwar/battles` | 1v1 Battles |

---

## Wichtige Dateien

### Backend
```
backend/src/
├── Server.ts                    # Entry Point (9 Routes)
├── endpoints/
│   ├── users/UserService.ts     # User-Logik
│   ├── workouts/WorkoutService.ts
│   ├── habits/HabitService.ts
│   ├── entries/EntryService.ts  # XP-Logik (67 XP/Exercise)
│   ├── exercises/               # 50+ Übungen
│   ├── groups/GroupService.ts   # Gruppen-Logik
│   └── pixelwar/
│       ├── BattleService.ts     # 1v1 Battle-Logik
│       └── PixelWarService.ts   # Season-Logik
```

### Frontend
```
frontend/src/
├── main.tsx                     # Entry (Auth0Provider)
├── App.tsx                      # Router (10 Routes)
├── context/AppContext.tsx       # Global State
├── pages/
│   ├── Dashboard.tsx
│   ├── Workouts.tsx
│   ├── Habits.tsx
│   ├── Groups.tsx
│   ├── PixelWars.tsx
│   ├── Statistics.tsx
│   └── OnboardingSteps/         # 6 Steps
├── components/
│   ├── ui/                      # shadcn Components (bereinigt)
│   ├── dashboardkacheln/        # Widgets
│   ├── groups/                  # Gruppen-Komponenten
│   └── pixelwar/                # Pixel Wars Komponenten
```

### Shared Types
```
shared/sharedTypes.ts            # Alle TypeScript Interfaces
- User, Workout, Habit, Entry
- Exercise, WorkoutExercise
- Group, GroupMember
- Battle, BattleParticipant, BattleSettings
- Season, PixelBoard
```

---

## Git-Status

**Branch**: `release-final`

**Letzte Commits**:
```
f55c6ad - fix: Build-Fehler behoben und unbenutzte UI-Komponenten entfernt
2086f1f - Merge remote-tracking branch 'origin/new_design' into pixelwars
44f3bf5 - docs: Groups und Pixel Wars Dokumentation aktualisiert
```

---

## Hilfreiche Kommandos

```bash
# App starten
npm run dev

# Nur Backend
npm run backend

# Nur Frontend
npm run frontend

# Build (Frontend)
cd frontend && npm run build

# Build (Backend)
cd backend && npm run build

# Tests (Backend)
cd backend && npm test

# MongoDB Container
cd backend && docker compose up -d
cd backend && docker compose down

# Git
git status
git log --oneline -10
git push origin release-final
```

---

## Credentials

**MongoDB**:
- Local: `mongodb://localhost:27017/trainem`

**Auth0** (siehe `frontend/src/main.tsx`):
- Domain: `dev-wmcuuu42i1iqwc5e.us.auth0.com`
- Client ID: `g8BoaEXH4lB7gRMqRc8F0ruGLvy9OXkD`
- Audience: `https://trainem.authentication`

**Ports**:
- Frontend: 5173
- Backend: 3000
- MongoDB: 27017

---

## Dokumentation

**Haupt-Einstieg**: [DOKUMENTATION.md](DOKUMENTATION.md)

Alle Docs in `/docs/`:
- Setup: [02-Developer-Setup.md](docs/02-Developer-Setup.md)
- API: [03-API-Dokumentation.md](docs/03-API-Dokumentation.md)
- Datenmodelle: [05-Datenmodelle.md](docs/05-Datenmodelle.md)
- Frontend: [06-Frontend-Struktur.md](docs/06-Frontend-Struktur.md)

---

**Erstellt**: 2026-01-24
**Aktualisiert**: 2026-01-29
**Für**: Kontinuität zwischen Claude Code Sessions
