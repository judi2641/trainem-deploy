# 01 - Projektübersicht

[← Zurück zum Wiki](../WIKI.md)

---

## 📋 Kurzbeschreibung

**Trainem** ist eine webbasierte Fitness- und Habit-Tracking-Anwendung, die Gamification-Elemente mit persönlicher Gesundheitsförderung verbindet. Nutzer können individuelle Workouts und tägliche Gewohnheiten (Habits) erstellen, verfolgen und abschließen. Als Belohnung erhalten sie Experience Points (XP), die sich in einem personalisierten Pixel-Art-Avatar widerspiegeln.

### Vision
Fitness und Selbstverbesserung sollen Spaß machen! Trainem kombiniert klassisches Fitness-Tracking mit spielerischen Elementen, um Nutzer langfristig zu motivieren.

### Kernfunktionen
- ✅ Erstellen und Verwalten von Workout-Plänen
- ✅ Habit-Tracking (täglich & wöchentlich)
- ✅ 50+ vordefinierte Übungen mit Video-Anleitungen
- ✅ XP-System & Level-Progression
- ✅ Personalisierter Pixel-Art-Avatar (32x32 Grid)
- ✅ Statistiken & Performance-Analytics
- ✅ Kalenderansicht für Training-History
- ✅ Streak-Tracking (aufeinanderfolgende Trainingstage)

---

## 🎯 Projektziele

### Primäre Ziele
1. **Motivation durch Gamification**: Nutzer sollen durch XP, Level und visuelle Belohnungen (Pixel-Art) langfristig motiviert bleiben
2. **Einfache Bedienung**: Intuitives UI für schnelles Workout-Tracking
3. **Flexibilität**: Eigene Workouts & Habits erstellen, nicht nur vordefinierte Pläne
4. **Visualisierung**: Statistiken und Fortschritt übersichtlich darstellen

### Sekundäre Ziele
- Technische Lernziele: MERN-Stack, TypeScript, Auth0, shadcn/ui
- Uni-Projekt: Dokumentation, Testing, CI/CD
- Erweiterbarkeit: Modulare Architektur für zukünftige Features

---

## 👥 Team & Aufgabenverteilung

> **Hinweis**: Bitte hier eure tatsächlichen Namen und Rollen eintragen

| Name | Rolle | Verantwortlichkeiten |
|------|-------|---------------------|
| [Name 1] | Backend Lead | API-Entwicklung, Datenbank, Auth0-Integration |
| [Name 2] | Frontend Lead | React-Komponenten, UI/UX, Routing |
| [Name 3] | Full Stack | Gamification-Logik, Testing, Deployment |
| [Name 4] | Designer/Frontend | Pixel-Art-System, Statistiken, Styling |

### Arbeitsweise
- **Versionskontrolle**: GitLab mit Feature-Branches
- **Kommunikation**: [Discord/Slack/WhatsApp]
- **Meetings**: [Wöchentlich/Zweiwöchentlich]
- **Task-Tracking**: [GitLab Issues/Jira/Trello]

---

## 🏗️ Technologie-Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 5.1.0
- **Datenbank**: MongoDB 8.0 (Mongoose ODM)
- **Authentifizierung**: Auth0 (OAuth2 JWT)
- **Logging**: Winston 3.18.3
- **Dev Tools**: TypeScript, Nodemon, ts-node

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.5
- **UI-Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS 4.1.16
- **Charts**: Recharts 2.15.4
- **Auth**: Auth0 React SDK
- **Icons**: Lucide React
- **Notifications**: Sonner

### Development & Deployment
- **Sprache**: TypeScript 5.9.3
- **Linting**: ESLint + Prettier
- **Testing**: Jest 29.7.0
- **Containerization**: Docker (MongoDB)
- **CI/CD**: GitLab CI
- **Process Manager**: Concurrently (parallel dev servers)

### Begründung der Technologie-Wahl

#### Warum MERN?
- **M**ongoDB: Flexible NoSQL-Datenbank, ideal für schemalose Daten (Pixel-Art, variable Workout-Strukturen)
- **E**xpress: Minimalistisches Backend-Framework, schnelle API-Entwicklung
- **R**eact: Komponentenbasierte UI, großes Ecosystem, gute TypeScript-Unterstützung
- **N**ode.js: JavaScript Full-Stack, einheitliche Sprache für Frontend & Backend

#### Warum Auth0?
- Sofort einsatzbereit: OAuth2/OIDC ohne eigene Implementierung
- Sicherheit: Best Practices für Token-Handling
- Skalierbar: Später Social Logins (Google, GitHub) einfach hinzufügbar

#### Warum shadcn/ui?
- Moderne Component Library basierend auf Radix UI
- Tailwind CSS Integration
- Copy-Paste statt npm install → volle Kontrolle über Code
- Accessibility (a11y) out-of-the-box

#### Warum TypeScript?
- Type Safety: Weniger Runtime-Errors
- Bessere IDE-Unterstützung (Autocomplete, Refactoring)
- Shared Types zwischen Frontend & Backend

---

## 📚 Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Entry** | Abgeschlossener Workout/Habit-Eintrag (z.B. "Workout vom 24.01.2026") |
| **Workout** | Trainingsplan mit mehreren Übungen (Exercises) |
| **Habit** | Tägliche oder wöchentliche Gewohnheit (z.B. "10 Min Meditation") |
| **Exercise** | Einzelne Übung (z.B. "Push-Ups", "Squats") mit Sets/Reps/Weight |
| **XP (Experience Points)** | Punkte, die durch Workout-Completion verdient werden (67 XP pro Übung, 10 XP pro Habit) |
| **Level** | Berechnet aus XP (Level 1 = 100 XP, Level 2 = 110 XP, etc.) |
| **Pixel-Art Avatar** | Personalisierter 32x32 Pixel-Canvas, der im Profil angezeigt wird |
| **Streak** | Anzahl aufeinanderfolgender Trainingstage |
| **Onboarding** | 7-Schritte-Prozess für neue Nutzer (Name, Ziele, Trainingserfahrung, Avatar-Farbe) |
| **auth0Id** | Eindeutige User-ID von Auth0 (Format: `auth0|...`) |
| **shadcn/ui** | Komponentenbibliothek basierend auf Radix UI + Tailwind CSS |
| **Protected Route** | React-Route, die nur für authentifizierte Nutzer zugänglich ist |

---

## 🔗 Links & Zugänge

### Repositories
- **GitLab**: [Link hier einfügen]
- **GitHub Mirror**: [Falls vorhanden]

### Deployment
- **Production**: [URL hier einfügen]
- **Staging**: [URL hier einfügen]

### Externe Services
- **Auth0 Dashboard**: https://manage.auth0.com/ (Zugang: [Team-Lead])
- **MongoDB Atlas**: [Falls Cloud-DB genutzt wird]

### Dokumentation
- **Projektwiki**: [Dieses Dokument]
- **API-Specs**: [docs/03-API-Dokumentation.md](03-API-Dokumentation.md)
- **Figma/Design**: [Falls vorhanden]

---

## 🤖 AI-Disclaimer

Bei der Entwicklung von Trainem wurden folgende AI-Tools genutzt:

| Tool | Verwendung | Umfang |
|------|-----------|--------|
| **Claude Code** | Code-Generierung, Refactoring, Dokumentation | Mittel-Hoch |
| **GitHub Copilot** | Code-Completion, Boilerplate | Mittel |
| **ChatGPT** | Debugging, Architektur-Beratung | Gering |

Alle AI-generierten Inhalte wurden vom Team **überprüft, angepasst und verstanden**. Die finale Verantwortung für Code-Qualität und Design-Entscheidungen liegt beim Entwicklungsteam.

---

## 📄 Lizenzen

### Projekt-Lizenz
- **Lizenz**: [MIT/GPL/Proprietary - hier eintragen]
- **Copyright**: © 2025-2026 Trainem Team

### Verwendete Libraries
Alle verwendeten Open-Source-Libraries sind in `package.json` (Frontend/Backend) aufgelistet und entsprechen ihren jeweiligen Lizenzen (meist MIT).

**Wichtige Lizenzen**:
- React: MIT
- Express: MIT
- MongoDB Community: SSPL
- shadcn/ui: MIT
- Auth0: Proprietär (siehe Auth0 Terms of Service)

---

## 📞 Kontakt

**Team-Lead**: [Name & E-Mail hier einfügen]
**Support**: [E-Mail/Discord]
**Issues**: [GitLab Issue Tracker]

---

**Letzte Aktualisierung**: 2026-01-24
**Nächste Review**: [Datum eintragen]

[← Zurück zum Wiki](../WIKI.md)
