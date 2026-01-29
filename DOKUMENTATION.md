# TrainEm - Projektdokumentation

## Inhaltsverzeichnis

### 1. [Projektübersicht](#1-projektübersicht)
- 1.1 [Kurzbeschreibung](#11-kurzbeschreibung)
- 1.2 [Team & Aufgabenverteilung](#12-team--aufgabenverteilung)
- 1.3 [Links & Zugänge](#13-links--zugänge)
- 1.4 [Quellen & AI-Disclaimer](#14-quellen--ai-disclaimer)
- 1.5 [Glossar](#15-glossar)

### 2. [Developer-Dokumentation](#2-developer-dokumentation)
- 2.1 [Prerequisites & Tools](#21-prerequisites--tools)
- 2.2 [Setup & Installation](#22-setup--installation)
- 2.3 [Projektstruktur](#23-projektstruktur)
- 2.4 [Umgebungsvariablen & Konfiguration](#24-umgebungsvariablen--konfiguration)
- 2.5 [Entwicklungsprozess](#25-entwicklungsprozess)
- 2.6 [Tests ausführen](#26-tests-ausführen)
- 2.7 [API-Dokumentation](#27-api-dokumentation)
- 2.8 [Deployment](#28-deployment)
- 2.9 [Known Issues & Technische Schulden](#29-known-issues--technische-schulden)

### 3. [Architektur & Design](#3-architektur--design)
- 3.1 [Systemarchitektur](#31-systemarchitektur)
- 3.2 [Datenmodell](#32-datenmodell)
- 3.3 [Design-Entscheidungen](#33-design-entscheidungen)
- 3.4 [Technologie-Stack](#34-technologie-stack)
- 3.5 [Lizenzen](#35-lizenzen)

### 4. [User-Dokumentation](#4-user-dokumentation)
- 4.1 [Systemanforderungen](#41-systemanforderungen)
- 4.2 [Installation & Erste Schritte](#42-installation--erste-schritte)
- 4.3 [Features & Workflows](#43-features--workflows)
- 4.4 [Rollen & Berechtigungen](#44-rollen--berechtigungen)
- 4.5 [FAQ & Troubleshooting](#45-faq--troubleshooting)

### 5. [Prozess-Dokumentation](#5-prozess-dokumentation)
- 5.1 [Meilensteine & Zeitplan](#51-meilensteine--zeitplan)
- 5.2 [Entwicklungsprozess & Methodik](#52-entwicklungsprozess--methodik)
- 5.3 [Meetingprotokolle](#53-meetingprotokolle)
- 5.4 [Playtests & User Feedback](#54-playtests--user-feedback)
- 5.5 [Lessons Learned & Retrospektive](#55-lessons-learned--retrospektive)

---

## 1. Projektübersicht

### 1.1 Kurzbeschreibung

**TrainEm** ist eine webbasierte Fitness- und Habit-Tracking-Anwendung mit Gamification-Elementen, die Nutzer dabei unterstützt, personalisierte Trainingspläne zu erstellen, Gewohnheiten zu tracken und ihre Fitnessziele durch spielerische Motivation zu erreichen.

#### Ziele & Nutzen

**Für wen?**
- Fitness-Anfänger, die strukturierte Trainingspläne benötigen
- Fortgeschrittene Athleten, die ihre Workouts organisieren möchten
- Personen, die durch Gamification motiviert werden möchten
- Teams/Gruppen, die gemeinsam trainieren und sich messen wollen

**Welches Problem löst TrainEm?**
- **Motivation**: Durch XP-System (67 XP pro Übung, 10 XP pro Habit), Streak-Tracking und Pixel-Art-Avatar bleiben Nutzer motiviert
- **Organisation**: Workouts und Habits erstellen und verwalten
- **Fortschrittsverfolgung**: Kalenderansicht, Statistiken und XP-History
- **Gemeinschaft**: Gruppen beitreten und gemeinsam XP sammeln
- **Wettbewerb**: Pixel Wars - 1v1 Battles zwischen Gruppen auf geteiltem Canvas

#### Kernfunktionen

1. **Intelligentes Onboarding**: 6-stufiger Wizard zur Erfassung von Nutzerdaten (Erfahrung, Ziele, Trainingstage)
2. **Workout-Management**: Eigene Workouts mit 50+ vordefinierten Übungen erstellen
3. **Habit-Tracking**: Tägliche und wöchentliche Gewohnheiten verfolgen
4. **Gamification**: XP-Punkte (67 pro Übung, 10 pro Habit), Level-System, Streak-Tracking
5. **Pixel-Art-Avatar**: Personalisierter 32x32 Pixel-Canvas
6. **Gruppen**: Teams erstellen, beitreten und gemeinsam XP sammeln
7. **Pixel Wars**: Kompetitive 1v1 Battles zwischen Gruppen auf geteiltem Canvas
8. **Dashboard**: Übersicht über aktive Workouts, Stats und Fortschritt
9. **Kalender**: Historie aller abgeschlossenen Workouts und Habits

---

### 1.2 Team & Aufgabenverteilung

#### Teammitglieder

| Name | Rolle | Verantwortungsbereich | Kontakt |
|------|-------|----------------------|---------|
| **[Name 1]** | Frontend-Entwicklung | Onboarding, Dashboard, UI-Komponenten | [Email] |
| **[Name 2]** | Backend-Entwicklung | API, Datenbank, Auth0-Integration | [Email] |
| **[Name 3]** | Full-Stack | Groups, Pixel Wars, Entry-System | [Email] |
| **[Name 4]** | Design & UX | UI/UX-Design, Pixel-Art-System, Styling | [Email] |
| **[Name 5]** | Dokumentation & Testing | Dokumentation, Tests, QA | [Email] |

> **Hinweis**: Bitte Namen, Rollen und E-Mail-Adressen der tatsächlichen Teammitglieder eintragen.

#### Aufgabenteilung nach Bereichen

- **Frontend**:
  - React-Komponenten (Sidebar, Dashboard, Workouts, Habits)
  - UI-Bibliothek Integration (shadcn/ui, Radix UI)
  - State Management (Context API)
  - Routing & Navigation

- **Backend**:
  - Express API-Endpoints (9 Route-Module)
  - MongoDB Schema-Design (User, Workout, Habit, Entry, Group, Battle, etc.)
  - Auth0 JWT-Validierung
  - Business Logic (Service Layer)

- **Design**:
  - Tailwind CSS Styling
  - Pixel-Art Avatar-System
  - Responsive Design
  - Gamification-Elemente

---

### 1.3 Links & Zugänge

#### Repositories & Versionskontrolle
- **GitLab Repository**: `https://gitlab.bht-berlin.de/judi2641/trainem`
- **Branch-Strategie**:
  - `main` - Produktions-ready Code
  - `release-final` - Aktueller Release-Branch
  - `pixelwars` - Feature-Branch für Pixel Wars

#### Deployment
- **Live-URL**: [URL einfügen, falls deployed]
- **Backend-API**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

#### Projekt-Management
- **Issue Tracker**: GitLab Issues
- **Dokumentation**: Diese Datei + `/docs/` Ordner

---

### 1.4 Quellen & AI-Disclaimer

#### Verwendete externe Ressourcen

**UI-Komponenten & Bibliotheken**:
- [shadcn/ui](https://ui.shadcn.com/) - UI-Komponentenbibliothek
- [Radix UI](https://www.radix-ui.com/) - Accessible Komponenten-Primitives
- [Lucide Icons](https://lucide.dev/) - Icon-Bibliothek
- [Recharts](https://recharts.org/) - Chart-Bibliothek für React
- [Sonner](https://sonner.emilkowal.ski/) - Toast-Notifications

**Frameworks & Tools**:
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Auth0 Documentation](https://auth0.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

#### KI-Tools Disclaimer

**Verwendung von KI-Tools**:

Im Rahmen der Entwicklung wurden folgende KI-Tools eingesetzt:

1. **Code-Generierung**:
   - **Claude Code** für:
     - Boilerplate-Code für React-Komponenten
     - TypeScript-Interface-Definitionen
     - Mongoose-Schema-Erstellung
     - Hilfe bei Debugging und Refactoring
     - API-Endpoint-Implementierung

2. **Dokumentation**:
   - Claude Code zur Unterstützung bei:
     - README-Erstellung
     - API-Dokumentation
     - Code-Kommentare

**Eigenleistung vs. KI-Unterstützung**:
- Alle KI-generierten Code-Vorschläge wurden geprüft, angepasst und getestet
- Architektur-Entscheidungen wurden vom Team getroffen
- Business-Logic wurde vom Team konzipiert
- UI/UX-Design basiert auf eigenen Konzepten

---

### 1.5 Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Auth0** | Authentifizierungs- und Autorisierungsplattform für OAuth2/JWT |
| **auth0Id** | Eindeutige User-ID von Auth0 (Format: `auth0\|...`) |
| **Entry** | Abgeschlossener Workout/Habit-Eintrag (z.B. "Workout vom 24.01.2026") |
| **Workout** | Trainingsplan mit mehreren Übungen (Exercises) |
| **Habit** | Tägliche oder wöchentliche Gewohnheit (z.B. "10 Min Meditation") |
| **Exercise** | Einzelne Übung (z.B. "Push-Ups", "Squats") mit Sets/Reps/Weight |
| **XP (Experience Points)** | Punkte durch Workout-Completion (67 XP pro Übung, 10 XP pro Habit) |
| **Level** | Berechnet aus XP (Level 1 = 100 XP, Level 2 = 110 XP, etc.) |
| **Pixel-Art Avatar** | Personalisierter 32x32 Pixel-Canvas im Profil |
| **Streak** | Anzahl aufeinanderfolgender Trainingstage |
| **Group** | Team von Nutzern, die gemeinsam XP sammeln |
| **Pixel Wars / Battle** | 1v1 Wettbewerb zwischen zwei Gruppen auf einem geteilten Pixel-Canvas |
| **Challenge** | Anfrage einer Gruppe an eine andere für ein Pixel Wars Battle |
| **Season** | Zeitlich begrenzter Pixel Wars Wettbewerb mit Leaderboard |
| **shadcn/ui** | Komponentenbibliothek basierend auf Radix UI + Tailwind CSS |
| **Protected Route** | React-Route, die nur für authentifizierte Nutzer zugänglich ist |
| **Onboarding** | Prozess für neue Nutzer (Name, Ziele, Trainingserfahrung) |

---

## 2. Developer-Dokumentation

### 2.1 Prerequisites & Tools

#### Erforderliche Software

| Tool | Version | Download | Zweck |
|------|---------|----------|-------|
| **Node.js** | ≥ 20.x | [nodejs.org](https://nodejs.org/) | JavaScript Runtime |
| **npm** | ≥ 9.x | (kommt mit Node.js) | Package Manager |
| **Docker** | ≥ 20.x | [docker.com](https://www.docker.com/) | MongoDB Container |
| **Git** | ≥ 2.x | [git-scm.com](https://git-scm.com/) | Versionskontrolle |

#### Empfohlene Tools

- **VS Code** mit Extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
- **Postman** oder **Insomnia** für API-Testing
- **MongoDB Compass** für Datenbank-Verwaltung

#### Überprüfung der Installation

```bash
node --version  # sollte v20.x oder höher sein
npm --version   # sollte 9.x oder höher sein
docker --version
git --version
```

---

### 2.2 Setup & Installation

#### Schritt-für-Schritt-Anleitung

**1. Repository klonen**

```bash
git clone https://gitlab.bht-berlin.de/judi2641/trainem.git
cd trainem
```

**2. MongoDB-Container starten**

```bash
cd backend
docker compose up -d
cd ..
```

**3. Dependencies installieren**

```bash
npm run install:all
```

**4. Anwendung starten**

```bash
npm run dev
```

**5. Anwendung öffnen**

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend-API**: [http://localhost:3000](http://localhost:3000)

#### Alternative: Einzelne Services starten

```bash
npm run frontend  # Nur Frontend
npm run backend   # Nur Backend
```

#### Build für Produktion

```bash
cd frontend && npm run build
cd ../backend && npm run build
```

---

### 2.3 Projektstruktur

```
trainem/
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── main.tsx                  # Entry Point
│   │   ├── App.tsx                   # Routing-Konfiguration
│   │   ├── pages/                    # Seiten-Komponenten
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Workouts.tsx
│   │   │   ├── Habits.tsx
│   │   │   ├── Statistics.tsx
│   │   │   ├── Groups.tsx
│   │   │   ├── PixelWars.tsx
│   │   │   ├── PixelArt.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Onboarding.tsx
│   │   │   └── OnboardingSteps/
│   │   │       ├── Landing.tsx
│   │   │       ├── BasicInfo.tsx
│   │   │       ├── Experience.tsx
│   │   │       ├── Goals.tsx
│   │   │       ├── Schedule.tsx
│   │   │       └── Intro.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui Komponenten
│   │   │   ├── dashboardkacheln/     # Dashboard-Widgets
│   │   │   │   ├── ActiveWorkout.tsx
│   │   │   │   ├── PixelCharacter.tsx
│   │   │   │   ├── QuickStats.tsx
│   │   │   │   └── UpcomingWorkouts.tsx
│   │   │   ├── groups/               # Gruppen-Komponenten
│   │   │   ├── pixelwar/             # Pixel Wars Komponenten
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── WorkoutsArea.tsx
│   │   │   ├── HabitsArea.tsx
│   │   │   └── GroupsArea.tsx
│   │   ├── context/
│   │   │   ├── AppContext.tsx        # Global State
│   │   │   └── OnboardingContext.tsx
│   │   ├── hooks/
│   │   │   └── use-mobile.tsx
│   │   └── util/
│   │       ├── level.ts              # XP → Level Calculation
│   │       ├── theme.ts
│   │       └── stringToColor.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                           # Express Backend
│   ├── src/
│   │   ├── Server.ts                 # Express-App & Server-Start
│   │   ├── database/
│   │   │   └── db.ts                 # MongoDB-Verbindung
│   │   ├── endpoints/                # API-Endpoints
│   │   │   ├── users/
│   │   │   │   ├── UserModel.ts
│   │   │   │   ├── UserService.ts
│   │   │   │   └── UserRoute.ts
│   │   │   ├── workouts/
│   │   │   ├── habits/
│   │   │   ├── entries/
│   │   │   ├── exercises/
│   │   │   ├── pixelArt/
│   │   │   ├── groups/
│   │   │   └── pixelwar/
│   │   │       ├── PixelWarRoute.ts    # Seasons
│   │   │       ├── BattleRoute.ts      # 1v1 Battles
│   │   │       ├── BattleModel.ts
│   │   │       └── BattleService.ts
│   │   └── utils/
│   │       └── logger.ts
│   ├── package.json
│   └── docker-compose.yml
│
├── shared/                            # Geteilte TypeScript Types
│   └── sharedTypes.ts
│
├── docs/                              # Dokumentation (Details)
│   ├── 01-Projektuebersicht.md
│   ├── 03-API-Dokumentation.md
│   ├── 05-Datenmodelle.md
│   └── 06-Frontend-Struktur.md
│
├── package.json                      # Root-Package
└── DOKUMENTATION.md                  # Diese Datei
```

---

### 2.4 Umgebungsvariablen & Konfiguration

#### Frontend-Konfiguration

Erstelle eine `.env`-Datei im `frontend/`-Verzeichnis:

```env
VITE_AUTH0_DOMAIN=dein-tenant.eu.auth0.com
VITE_AUTH0_CLIENT_ID=deine-client-id
VITE_AUTH0_AUDIENCE=https://deine-api-identifier
VITE_API_URL=http://localhost:3000
```

#### MongoDB-Konfiguration

Die `docker-compose.yml` im `backend/`-Verzeichnis:

```yaml
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

### 2.5 Entwicklungsprozess

#### Git-Workflow

**Branch-Strategie**:
- `main`: Produktions-ready Code
- `release-final`: Aktueller Release-Branch
- Feature-Branches: `feature/feature-name`
- Bugfix-Branches: `bugfix/bug-name`

**Commit-Konventionen**:

```bash
git commit -m "feat: Add workout creation"
git commit -m "fix: Fix XP calculation"
git commit -m "docs: Update API documentation"
```

---

### 2.6 Tests ausführen

#### Backend-Tests

```bash
cd backend
npm run test
```

**Test-Framework**: Jest mit ts-jest

---

### 2.7 API-Dokumentation

#### Base URL

```
http://localhost:3000/api
```

#### API-Routen Übersicht

| Route | Beschreibung |
|-------|--------------|
| `/api/user` | User-Management, Onboarding |
| `/api/workouts` | Workout CRUD, Übungen hinzufügen |
| `/api/habits` | Habit CRUD |
| `/api/entries` | Abgeschlossene Workouts/Habits |
| `/api/exercises` | 50+ vordefinierte Übungen |
| `/api/pixel-art` | Pixel-Art Avatar |
| `/api/groups` | Gruppen erstellen, beitreten |
| `/api/pixelwar` | Seasons, Leaderboards |
| `/api/pixelwar/battles` | 1v1 Battles |

#### Wichtige Endpoints

##### User erstellen
```http
POST /api/user
Content-Type: application/json

{
  "email": "user@example.com",
  "auth0Id": "auth0|123456789"
}
```

##### Workout erstellen
```http
POST /api/workouts
Content-Type: application/json

{
  "auth0Id": "auth0|123",
  "name": "Leg Day",
  "description": "Beintraining"
}
```

##### Übung als abgeschlossen markieren
```http
PATCH /api/entries/:entryId/complete-exercise
Content-Type: application/json

{
  "exerciseName": "Squats"
}
```

**XP-System**:
- Übung abschließen: **+67 XP**
- Habit abschließen: **+10 XP**

Detaillierte API-Dokumentation: [docs/03-API-Dokumentation.md](docs/03-API-Dokumentation.md)

---

### 2.8 Deployment

#### Voraussetzungen

- Node.js Server oder Cloud-Platform
- MongoDB Atlas Account (für Cloud-Datenbank)
- Auth0 Production Tenant

#### Build & Start

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
NODE_ENV=production node dist/Server.js
```

---

### 2.9 Known Issues & Technische Schulden

#### Bekannte Bugs

1. **Avatar-Update verzögert**: Avatar-Bild aktualisiert sich nicht sofort nach XP-Gewinn
   - **Workaround**: Dashboard neu laden

#### Technische Schulden

1. **Frontend-Tests fehlen**: Keine Unit-Tests für React-Komponenten
2. **Real-time Updates**: Polling statt WebSockets für Live-Score

#### Feature-Requests (nicht implementiert)

- Benachrichtigungen
- Mobile App (React Native)
- Social Features (Freunde hinzufügen)

---

## 3. Architektur & Design

### 3.1 Systemarchitektur

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         React Frontend (Port 5173)                     │ │
│  │  - React Router (SPA)                                  │ │
│  │  - Auth0 Provider (OAuth2)                             │ │
│  │  - Tailwind CSS + shadcn/ui                            │ │
│  │  - Context API State Management                        │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP REST API
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Backend (Port 3000)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  9 Route-Module:                                       │ │
│  │  - /api/user, /api/workouts, /api/habits               │ │
│  │  - /api/entries, /api/exercises, /api/pixel-art        │ │
│  │  - /api/groups, /api/pixelwar, /api/pixelwar/battles   │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ Mongoose ODM
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Database (Port 27017)                   │
│  Collections: users, workouts, habits, entries,             │
│               exercises, pixelarts, groups, battles, etc.   │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Datenmodell

#### Haupt-Entitäten

**User**
```typescript
{
  email: String,
  auth0Id: String,
  firstName: String,
  lastName: String,
  points: Number,      // XP-Punkte
  streak: Number,
  onboardingCompleted: Boolean,
  pixels: [{ x, y, color }],
  canvas: { width: 32, height: 32, pixels }
}
```

**Workout**
```typescript
{
  auth0Id: String,
  name: String,
  description: String,
  exercises: [{
    exercise: { name, type, primaryMuscleGroups, videoUrl },
    sets: Number,
    reps: Number,
    weight: Number
  }]
}
```

**Entry** (abgeschlossene Workouts/Habits)
```typescript
{
  auth0Id: String,
  date: Date,
  workoutId: ObjectId,       // oder habitId
  plannedExercises: [...],
  completed_exercises: [...],
  completed: Boolean,
  score: Number              // verdiente XP
}
```

**Group**
```typescript
{
  name: String,
  color: String,
  members: [{ userId, role, contributedXP }],
  totalXP: Number,
  isPublic: Boolean
}
```

**Battle** (Pixel Wars 1v1)
```typescript
{
  challenger: { groupId, groupName, color, pixelsOwned, totalXP, members },
  opponent: { groupId, groupName, color, pixelsOwned, totalXP, members },
  status: 'pending' | 'active' | 'completed',
  settings: {
    duration: 10080,  // 7 Tage (in Minuten)
    gridSize: 15,     // 15x15 Pixel
    winCondition: 'pixels',
    allowOverwrite: true
  }
}

// BattleMember: { userId, contributedXP, pixelsPlaced, pixelsAvailable }
// 1 Übung = 1 Pixel verdient, 1 Habit = 1 Pixel verdient
```

Detaillierte Datenmodelle: [docs/05-Datenmodelle.md](docs/05-Datenmodelle.md)

---

### 3.3 Design-Entscheidungen

#### Warum MERN-Stack?
- **MongoDB**: Flexible NoSQL-DB, ideal für variable Workout-Strukturen
- **Express**: Minimalistisches Backend-Framework
- **React**: Komponentenbasierte UI, großes Ecosystem
- **Node.js**: JavaScript Full-Stack

#### Warum Auth0?
- Sofort einsatzbereit: OAuth2/OIDC ohne eigene Implementierung
- Sicherheit: Best Practices für Token-Handling
- Skalierbar: Später Social Logins einfach hinzufügbar

#### Warum shadcn/ui?
- Moderne Component Library basierend auf Radix UI
- Tailwind CSS Integration
- Copy-Paste statt npm install → volle Kontrolle
- Accessibility out-of-the-box

---

### 3.4 Technologie-Stack

#### Frontend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| React | 19.1.1 | UI-Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.1.7 | Build-Tool |
| React Router DOM | 7.9.5 | Routing |
| Tailwind CSS | 4.1.16 | Styling |
| shadcn/ui | Latest | UI-Komponenten |
| Auth0 React | 2.8.0 | Authentication |
| Recharts | 2.15.4 | Charts |
| Sonner | 2.0.7 | Toasts |

#### Backend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Node.js | ≥20.x | Runtime |
| Express | 5.1.0 | Web-Framework |
| TypeScript | 5.9.3 | Type Safety |
| Mongoose | 8.0+ | MongoDB ODM |
| Winston | 3.18.3 | Logging |

---

### 3.5 Lizenzen

**Dependencies-Lizenzen**: Die meisten Bibliotheken stehen unter MIT-Lizenz.

**Auth0**: Kommerzieller Service, Free Tier bis 7.000 aktive Nutzer.

---

## 4. User-Dokumentation

### 4.1 Systemanforderungen

#### Browser-Unterstützung
- Google Chrome ≥ 90
- Mozilla Firefox ≥ 88
- Microsoft Edge ≥ 90
- Safari ≥ 14

**Nicht unterstützt**: Internet Explorer

---

### 4.2 Installation & Erste Schritte

#### Registrierung
1. Öffne die App
2. Klicke auf "Registrieren"
3. E-Mail und Passwort eingeben (oder Social Login)
4. E-Mail bestätigen

#### Onboarding-Wizard

Nach erfolgreicher Registrierung wirst du durch den Wizard geführt:

1. **Landing**: Willkommen
2. **Basis-Informationen**: Name, Geburtsdatum, Geschlecht
3. **Erfahrungslevel**: Starter / Intermediate / Pro
4. **Trainingsziele**: Muscle Gain / Fat Loss / Maintenance
5. **Trainingstage**: Wähle deine Trainingstage und Dauer
6. **Intro**: Zusammenfassung & Start

---

### 4.3 Features & Workflows

#### Dashboard
- **Avatar**: Zeigt dein Level (basierend auf XP)
- **Quick Stats**: Streak, Total XP, Level
- **Aktives Workout**: Aktuell laufendes Training
- **Upcoming Workouts**: Geplante Workouts

#### Workouts
- Eigene Workouts erstellen
- 50+ vordefinierte Übungen mit Video-Anleitungen
- Übungen hinzufügen mit Sets/Reps/Weight
- Workout starten → Übungen abhaken → XP verdienen

**XP-System**:
- Jede abgeschlossene Übung: **+67 XP** + **1 Pixel** (falls in aktivem Battle)
- User-Points werden erhöht
- Gruppen-XP wird aktualisiert (falls in Gruppe)
- Battle-Pixel werden freigeschaltet (falls in aktivem Battle)

#### Habits
- Tägliche oder wöchentliche Habits erstellen
- Checkbox anklicken um Habit als erledigt zu markieren
- Habit abschließen: **+10 XP** + **1 Pixel** (falls in aktivem Battle)

#### Gruppen
- Öffentliche Gruppen durchsuchen und beitreten
- Eigene Gruppe erstellen
- Gemeinsam XP sammeln
- Rollen: Owner, Admin, Member

#### Pixel Wars
- Gruppe A fordert Gruppe B heraus (Admin/Owner)
- Beide Teams platzieren Pixel auf geteiltem Canvas (Default: 15x15)
- **Pixel verdienen**: Pro abgeschlossener Übung = 1 Pixel, Pro Habit = 1 Pixel
- Pixel können überschrieben werden (je nach Einstellung)
- **Gewinner**: Meiste Pixel nach Zeitablauf (Default: 7 Tage)
- Jedes Team hat seine eigene Farbe (Gruppenfarbe)

---

### 4.4 Rollen & Berechtigungen

**User-Rechte**:
- Account erstellen & verwalten
- Workouts & Habits erstellen/bearbeiten/löschen
- Entries abschließen & XP verdienen
- Gruppen beitreten/erstellen
- An Pixel Wars teilnehmen

**Gruppen-Rollen**:
- **Owner**: Gruppe erstellen, löschen, Mitglieder verwalten
- **Admin**: Mitglieder verwalten
- **Member**: XP beitragen, an Battles teilnehmen

---

### 4.5 FAQ & Troubleshooting

**Q: Wie bekomme ich XP?**
A: Übungen abschließen (67 XP) oder Habits (10 XP).

**Q: Wie funktioniert das Level-System?**
A: Level 1 = 0-99 XP, Level 2 = 100-109 XP, Level 3 = 110-119 XP, etc.

**Q: Wie funktionieren Pixel Wars?**
A: Deine Gruppe fordert eine andere heraus. Pro abgeschlossener Übung/Habit verdienst du 1 Pixel. Diese Pixel platzierst du auf dem Canvas. Nach 7 Tagen gewinnt das Team mit mehr Pixeln.

**Q: Mein Avatar aktualisiert sich nicht**
A: Seite neu laden (F5).

---

## 5. Prozess-Dokumentation

### 5.1 Meilensteine & Zeitplan

| Phase | Status |
|-------|--------|
| Projektstart & Konzeption | ✅ Abgeschlossen |
| Auth0-Integration | ✅ Abgeschlossen |
| Onboarding-Wizard | ✅ Abgeschlossen |
| Workout & Habit System | ✅ Abgeschlossen |
| Entry-System & XP | ✅ Abgeschlossen |
| Dashboard & Statistics | ✅ Abgeschlossen |
| Gruppen-Funktionalität | ✅ Abgeschlossen |
| Pixel Wars (Battles) | ✅ Abgeschlossen |
| Testing & Dokumentation | ✅ Abgeschlossen |

---

### 5.2 Entwicklungsprozess & Methodik

**Framework**: Agile/Scrum-ähnlich

**Tools**:
- Issue Tracking: GitLab Issues
- Communication: Team-Chat
- Version Control: Git/GitLab

---

### 5.3 Meetingprotokolle

> Tatsächliche Meeting-Notizen hier einfügen

---

### 5.4 Playtests & User Feedback

> User-Test-Ergebnisse hier dokumentieren

---

### 5.5 Lessons Learned & Retrospektive

#### Was lief gut?
- React & TypeScript: Gute Entwicklererfahrung
- Auth0: Zeitsparend, keine Sicherheitsprobleme
- MongoDB: Flexibel für schnelle Iterationen
- shadcn/ui: Schnelles Prototyping

#### Was hätten wir besser machen können?
- Tests von Anfang an schreiben
- Mehr Mobile-First Design
- Früher mit Real-time Updates (WebSockets)

---

## Anhang

### A. Abkürzungen

| Abkürzung | Bedeutung |
|-----------|-----------|
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| XP | Experience Points |

---

### B. Weitere Ressourcen

- **GitLab Repository**: https://gitlab.bht-berlin.de/judi2641/trainem
- **API-Dokumentation**: [docs/03-API-Dokumentation.md](docs/03-API-Dokumentation.md)
- **Datenmodelle**: [docs/05-Datenmodelle.md](docs/05-Datenmodelle.md)

---

### C. Changelog

| Version | Datum | Änderungen |
|---------|-------|------------|
| 2.1 | 2026-01-29 | Pixel Wars: Training = Pixel System, Habits Checkbox Fix |
| 2.0 | 2026-01-29 | Komplett überarbeitet: Workouts, Habits, Entries, Groups, Pixel Wars |
| 1.0 | 2025-01-21 | Initiale Dokumentation |

---

**Ende der Dokumentation**

**Letzte Aktualisierung**: 2026-01-29
