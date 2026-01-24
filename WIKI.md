# Trainem – Projektdokumentation Wiki

> **Trainem** ist eine MERN-basierte Webapp für Fitness- und Habit-Tracking mit einem spielerischen Pixel-Art-Avatar-System.

---

## 📚 Inhaltsverzeichnis

### 🎯 Projektübersicht
- **[01 - Projektübersicht](docs/01-Projektuebersicht.md)**
  - Kurzbeschreibung, Vision & Ziele
  - Team & Aufgabenverteilung
  - Technologie-Stack
  - Quellen & AI-Disclaimer
  - Glossar

### 👨‍💻 Developer-Dokumentation
- **[02 - Developer Setup](docs/02-Developer-Setup.md)**
  - Voraussetzungen & Tools
  - Installation & Setup
  - Entwicklungs-Workflow
  - Build & Scripts
  - Projektstruktur (Ordnerübersicht)

- **[03 - API-Dokumentation](docs/03-API-Dokumentation.md)**
  - User-Endpoints
  - Workout-Endpoints
  - Habit-Endpoints
  - Entry-Endpoints
  - Exercise-Endpoints
  - PixelArt-Endpoints
  - Request/Response-Beispiele

- **[04 - Architektur & Design](docs/04-Architektur-Design.md)**
  - Systemarchitektur (MERN)
  - Backend-Pattern (MVC)
  - Frontend-Pattern (Context API, Protected Routes)
  - Auth Flow (Auth0)
  - Gamification Flow
  - Design-Entscheidungen

- **[05 - Datenmodelle](docs/05-Datenmodelle.md)**
  - User-Model
  - Workout-Model
  - Habit-Model
  - Entry-Model
  - Exercise-Model
  - PixelArt-Model
  - ER-Diagramme & Beziehungen

- **[06 - Frontend-Struktur](docs/06-Frontend-Struktur.md)**
  - Komponenten-Übersicht
  - Pages & Routing
  - Context & State Management
  - UI-Library (shadcn/ui)
  - Styling (Tailwind CSS)

### 🚀 Deployment & Testing
- **[08 - Deployment](docs/08-Deployment.md)**
  - Deployment-Anleitung
  - Environment-Variablen
  - Docker-Setup
  - CI/CD (GitLab CI)

- **[09 - Testing](docs/09-Testing.md)**
  - Test-Setup (Jest)
  - Unit Tests
  - Integration Tests
  - Known Issues & Tech Debt

### 📖 User-Dokumentation
- **[07 - User-Dokumentation](docs/07-User-Dokumentation.md)**
  - Systemanforderungen
  - Installation & Start
  - Erste Schritte (Onboarding)
  - Features & Workflows
  - FAQ & Troubleshooting

### 📊 Prozess & Projektmanagement
- **[10 - Prozess & Meilensteine](docs/10-Prozess-Meilensteine.md)**
  - Projektplan & Zeitplan
  - Sprint-Übersicht
  - Meetingprotokolle
  - Entscheidungslog

- **[11 - Lessons Learned & Retrospektive](docs/11-Lessons-Learned.md)**
  - Was lief gut?
  - Was lief schlecht?
  - Technische Herausforderungen
  - Verbesserungsvorschläge
  - Playtest-Feedback

---

## 🏃 Quick Start

### Für Entwickler
```bash
# 1. Repository klonen
git clone <repository-url>

# 2. Dependencies installieren
npm run install:all

# 3. MongoDB starten
cd backend && docker compose up -d

# 4. App starten
cd .. && npm run dev
```

Siehe [02 - Developer Setup](docs/02-Developer-Setup.md) für Details.

### Für User
1. Installiere Node.js und Docker
2. Folge der Anleitung in [07 - User-Dokumentation](docs/07-User-Dokumentation.md)

---

## 📞 Kontakt & Support

- **Repository**: [GitLab Link hier einfügen]
- **Issues**: [Issue Tracker]
- **Team**: Siehe [01 - Projektübersicht](docs/01-Projektuebersicht.md#team)

---

## 📝 Dokumentationsstatus

| Dokument | Status | Zuletzt aktualisiert | Verantwortlich |
|----------|--------|---------------------|----------------|
| 01 - Projektübersicht | ✅ Vollständig | 2026-01-24 | - |
| 02 - Developer Setup | ✅ Vollständig | 2026-01-24 | - |
| 03 - API-Dokumentation | ✅ Vollständig | 2026-01-24 | - |
| 04 - Architektur & Design | ✅ Vollständig | 2026-01-24 | - |
| 05 - Datenmodelle | ✅ Vollständig | 2026-01-24 | - |
| 06 - Frontend-Struktur | ✅ Vollständig | 2026-01-24 | - |
| 07 - User-Dokumentation | ✅ Vollständig | 2026-01-24 | - |
| 08 - Deployment | ✅ Vollständig | 2026-01-24 | - |
| 09 - Testing | ✅ Vollständig | 2026-01-24 | - |
| 10 - Prozess & Meilensteine | 🟡 Zu vervollständigen | 2026-01-24 | Team |
| 11 - Lessons Learned | 🟡 Zu vervollständigen | 2026-01-24 | Team |

---

## 🤖 AI-Disclaimer

Teile dieser Dokumentation wurden mit Unterstützung von AI-Tools (Claude Code) erstellt und von Menschen überprüft und angepasst.

---

**Letzte Aktualisierung**: 2026-01-24
**Version**: 1.0.0
