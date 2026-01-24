# 10 - Prozess & Meilensteine

[← Zurück zum Wiki](../WIKI.md)

---

## 📅 Projektplan

### Projekt-Timeline

> **Hinweis**: Bitte hier eure tatsächlichen Daten eintragen

| Phase | Zeitraum | Status |
|-------|----------|--------|
| Kickoff & Planung | Nov 2025 | ✅ Abgeschlossen |
| Backend Setup (MongoDB, Express, Auth0) | Nov-Dez 2025 | ✅ Abgeschlossen |
| Frontend Setup (React, Vite, Tailwind) | Dez 2025 | ✅ Abgeschlossen |
| Core Features (Workouts, Habits, Entries) | Dez 2025 - Jan 2026 | ✅ Abgeschlossen |
| Gamification (XP, Pixel-Art) | Jan 2026 | ✅ Abgeschlossen |
| Statistiken & Charts | Jan 2026 | ✅ Abgeschlossen |
| Testing & Bugfixes | Jan 2026 | 🟡 In Arbeit |
| Dokumentation | Jan 2026 | ✅ Abgeschlossen |
| Deployment | Jan 2026 | 🟡 Geplant |
| Uni-Abgabe | Feb 2026 | 📅 Geplant |

---

## 🎯 Meilensteine

### Milestone 1: Projekt-Setup ✅

**Datum**: November 2025
**Ziel**: Entwicklungsumgebung einrichten

**Deliverables**:
- [x] Git-Repository erstellt
- [x] Backend-Boilerplate (Express + MongoDB)
- [x] Frontend-Boilerplate (React + Vite)
- [x] Docker für MongoDB
- [x] Auth0 konfiguriert
- [x] CI/CD Pipeline (GitLab CI)

---

### Milestone 2: MVP (Core Features) ✅

**Datum**: Dezember 2025 - Januar 2026
**Ziel**: Basis-Funktionalität implementieren

**Deliverables**:
- [x] User-Management (Auth0 + MongoDB)
- [x] Onboarding-Flow (7 Schritte)
- [x] Workout-System (Create, Read, Update, Delete)
- [x] Habit-System (Daily/Weekly)
- [x] Entry-System (Workout-Ausführung)
- [x] Exercise-Katalog (50+ Übungen)
- [x] Dashboard mit Widgets

---

### Milestone 3: Gamification ✅

**Datum**: Januar 2026
**Ziel**: Spielerische Elemente integrieren

**Deliverables**:
- [x] XP-System (67 XP pro Übung, 10 XP pro Habit)
- [x] Level-Berechnung
- [x] Streak-Tracking
- [x] Pixel-Art Avatar-System (32x32 Grid)
- [x] Character Color Selection im Onboarding

---

### Milestone 4: Analytics & Statistiken ✅

**Datum**: Januar 2026
**Ziel**: Fortschritt visuell darstellen

**Deliverables**:
- [x] XP Progress Chart (Recharts)
- [x] Plan Completion Chart
- [x] Weekday Performance Chart
- [x] Difficulty Distribution
- [x] Performance Overview Cards
- [x] Kalender-Ansicht

---

### Milestone 5: Testing & Qualität 🟡

**Datum**: Januar 2026 (laufend)
**Ziel**: Code-Qualität sicherstellen

**Deliverables**:
- [x] ESLint + Prettier
- [x] Jest für Backend
- [ ] Vitest für Frontend (geplant)
- [ ] E2E-Tests (geplant)
- [x] Code Coverage >30%

---

### Milestone 6: Dokumentation ✅

**Datum**: Januar 2026
**Ziel**: Vollständige Wiki-Dokumentation

**Deliverables**:
- [x] Projektübersicht
- [x] Developer-Setup
- [x] API-Dokumentation
- [x] Architektur & Design
- [x] Datenmodelle
- [x] Frontend-Struktur
- [x] User-Dokumentation
- [x] Deployment-Guide
- [x] Testing-Guide

---

### Milestone 7: Deployment 📅

**Datum**: Februar 2026 (geplant)
**Ziel**: Production-Ready Deployment

**Deliverables**:
- [ ] Frontend auf Vercel
- [ ] Backend auf Railway
- [ ] MongoDB Atlas
- [ ] Auth0 Production konfiguriert
- [ ] Monitoring (Sentry/LogRocket)
- [ ] Domain & SSL

---

## 📊 Sprint-Übersicht

> **Template** - Bitte mit tatsächlichen Sprint-Daten füllen

### Sprint 1 (KW 46-47, Nov 2025)

**Ziel**: Projekt-Setup & Backend-Foundation

**Tasks**:
- Setup MongoDB Container
- Express Server mit TypeScript
- Auth0 Integration
- User-Model & API

**Ergebnis**: ✅ Alle Tasks abgeschlossen

---

### Sprint 2 (KW 48-49, Nov 2025)

**Ziel**: Frontend-Foundation & Routing

**Tasks**:
- React + Vite Setup
- Tailwind CSS konfigurieren
- React Router implementieren
- Protected Routes

**Ergebnis**: ✅ Alle Tasks abgeschlossen

---

### Sprint 3-6 (Dez 2025 - Jan 2026)

> **TODO**: Bitte Sprint-Details ergänzen

---

## 📝 Meetingprotokolle

### Template für Meetingprotokolle

```markdown
## Meeting [Datum]

**Teilnehmer**: [Namen]
**Dauer**: [Zeit]

### Agenda
1. [Punkt 1]
2. [Punkt 2]

### Besprochene Punkte
- [Punkt]

### Entscheidungen
- [Entscheidung]

### Offene Punkte
- [ ] [Task] - Verantwortlich: [Name]

### Nächstes Meeting
**Datum**: [Datum]
```

---

### Meeting 2025-11-15: Kickoff

**Teilnehmer**: [Team-Namen hier einfügen]
**Dauer**: 2h

**Agenda**:
1. Projektziele definieren
2. Tech-Stack festlegen
3. Aufgabenverteilung
4. Timeline erstellen

**Entscheidungen**:
- MERN-Stack
- Auth0 für Authentifizierung
- MongoDB statt PostgreSQL (Flexibilität)
- shadcn/ui für Frontend

**Aufgaben**:
- [Name]: Backend-Setup
- [Name]: Frontend-Setup
- [Name]: Auth0 konfigurieren
- [Name]: Figma-Designs (optional)

---

### Meeting 2025-12-01: Sprint Review

**Teilnehmer**: [Namen]
**Besprochene Punkte**:
- Backend API läuft
- Frontend zeigt Landing Page
- Auth0 funktioniert

**Probleme**:
- Callback URL Fehler → Lösung: MockAuth0Provider

---

### Meeting 2026-01-15: Feature Freeze

**Entscheidungen**:
- Feature Freeze ab heute
- Fokus auf Testing & Dokumentation
- Deployment-Vorbereitung

---

> **TODO**: Weitere Meetings ergänzen

---

## 🗂️ Entscheidungslog

### ADR (Architecture Decision Records)

#### ADR-001: MERN statt LAMP

**Datum**: 2025-11-15
**Status**: Akzeptiert

**Kontext**: Technologie-Stack für Webapp

**Entscheidung**: MERN (MongoDB, Express, React, Node.js)

**Begründung**:
- JavaScript Full-Stack → eine Sprache
- MongoDB flexibler für Pixel-Art & variable Workouts
- React modern & komponentenbasiert
- Node.js großes Ecosystem

**Alternativen**:
- LAMP (PHP + MySQL): Zu veraltet
- Django + React: Python-Backend, aber Team bevorzugt JS

---

#### ADR-002: shadcn/ui statt Material-UI

**Datum**: 2025-11-20
**Status**: Akzeptiert

**Kontext**: UI-Library für Frontend

**Entscheidung**: shadcn/ui (Copy-Paste Components)

**Begründung**:
- Tailwind CSS Integration
- Volle Kontrolle über Code (Copy-Paste statt npm)
- Modern Design
- Accessibility out-of-the-box

**Alternativen**:
- Material-UI: Zu "Google-Look"
- Ant Design: Zu komplex

---

#### ADR-003: Auth0 statt eigene Auth

**Datum**: 2025-11-15
**Status**: Akzeptiert

**Kontext**: User-Authentifizierung

**Entscheidung**: Auth0 (OAuth2/OIDC)

**Begründung**:
- Sicherheit: Best Practices out-of-the-box
- Schneller: Keine eigene Implementierung
- Skalierbar: Social Logins einfach hinzufügbar

**Alternativen**:
- Passport.js: Eigene Implementierung, mehr Arbeit
- Firebase Auth: Vendor Lock-in

---

> **TODO**: Weitere ADRs ergänzen

---

## 📈 Arbeitsverteilung

> **Template** - Bitte mit tatsächlichen Namen füllen

| Teammitglied | Hauptverantwortung | Beiträge |
|--------------|-------------------|----------|
| [Name 1] | Backend Lead | User API, Workout API, MongoDB Setup |
| [Name 2] | Frontend Lead | Dashboard, Onboarding, Routing |
| [Name 3] | Full Stack | Entry-System, XP-Logic, Testing |
| [Name 4] | Design/Frontend | Pixel-Art, Statistiken, shadcn/ui |

---

**Letzte Aktualisierung**: 2026-01-24

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu Lessons Learned →](11-Lessons-Learned.md)
