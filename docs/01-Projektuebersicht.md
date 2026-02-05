# 01 - Projektübersicht

[← Zurück zum Wiki](../WIKI.md)

---

## 📋 Kurzbeschreibung

**Trainem** ist eine webbasierte Fitness- und Habit-Tracking-Anwendung, die Gamification-Elemente mit persönlicher Gesundheitsförderung verbindet. Nutzer können individuelle Workouts und tägliche Gewohnheiten (Habits) erstellen, verfolgen und abschließen. Als Belohnung erhalten sie Experience Points (XP), die sich in einem personalisierten Pixel-Art widerspiegeln.

### Vision
Fitness und Selbstverbesserung sollen Spaß machen! Trainem kombiniert klassisches Fitness-Tracking mit spielerischen Elementen, um Nutzer langfristig zu motivieren.

### Kernfunktionen
- ✅ Erstellen und Verwalten von Workout-Plänen
- ✅ Habit-Tracking (täglich & wöchentlich)
- ✅ 50+ vordefinierte Übungen mit Video-Anleitungen
- ✅ XP-System & Level-Progression (67 XP pro Übung, 10 XP pro Habit)
- ✅ Personalisierter Pixel-Art-Avatar (32x32 Grid)
- ✅ Statistiken & Performance-Analytics
- ✅ Streak-Tracking (aufeinanderfolgende Trainingstage)
- ✅ **Gruppen**: Teams erstellen, beitreten, gemeinsam XP sammeln
- ✅ **Pixel Wars**: Kompetitive Battles zwischen Gruppen auf geteiltem Canvas

---

## 🎯 Projektziele

### Primäre Ziele
1. **Langzeitige Motivation durch Gamification**: Nutzer erhalten XP und schalten durch Levelaufstieg weitere Pixel frei
2. **Wettkampf**: Nutzer können in Pixel-Wars gegeneinander antreten
3. **Einfache Bedienung**: Intuitives UI für schnelles Workout-Tracking
4. **Flexibilität**: Eigene Workouts & Habits erstellen, nicht nur vordefinierte Pläne
5. **Visualisierung**: Statistiken und Fortschritt übersichtlich darstellen

---

## 👥 Team & Aufgabenverteilung

| Name | Rolle | Verantwortlichkeiten |
|------|-------|---------------------|
| Julius Dittrich | Backend | API-Entwicklung, Datenbank, Auth0-Integration |
| Leo | Onboarding | OpenAI-Anbindung, Pixel-Art |
| Marlow Mix | Frontend | React-Komponenten, UI/UX, Dashboard |
| Silvija | Design | Onboarding, LandingPage |
| Erwin | Full Stack | Pixel-Wars, Gruppenfunktion |
| Maxi | Full Stack | Features, Testing |

---

## 📚 Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Exercise** | Einzelne Übung (z.B. "Push-Ups", "Squats") mit Sets/Reps/Weight |
| **Workout** | Trainingsplan mit mehreren Übungen (Exercises) |
| **Habit** | Tägliche oder wöchentliche Gewohnheit (z.B. "10 Min Meditation") |
| **Entry** | Abgeschlossener Workout/Habit-Eintrag (z.B. "Workout vom 24.01.2026") |
| **XP (Experience Points)** | Punkte, die durch Workout-Completion verdient werden (67 XP pro Übung, 10 XP pro Habit) |
| **Level** | Berechnet aus XP (Level 1 = 100 XP, Level 2 = 110 XP, etc.) |
| **Pixel** | 12 Startpixel und drei zusätzliche Pixel pro Levelaufstieg |
| **Pixel-Art** | Personalisierter 32x32 Pixel-Canvas, der im Profil angezeigt wird |
| **Streak** | Anzahl aufeinanderfolgender Trainingstage |
| **Onboarding** | 7-Schritte-Prozess für neue Nutzer (Name, Ziele, Trainingserfahrung) |
| **auth0Id** | Eindeutige User-ID von Auth0 (Format: `auth0|...`) |
| **shadcn/ui** | Komponentenbibliothek basierend auf Radix UI + Tailwind CSS |
| **Protected Route** | React-Route, die nur für authentifizierte Nutzer zugänglich ist |
| **Group** | Team von Nutzern, die gemeinsam XP sammeln und an Pixel Wars teilnehmen |
| **Pixel Wars / Battle** | 1v1 Wettbewerb zwischen zwei Gruppen auf einem geteilten Pixel-Canvas |
| **Challenge** | Anfrage einer Gruppe an eine andere für ein Pixel Wars Battle |

---

## 🔗 Links & Zugänge

### Repositories
- **GitLab**: https://gitlab.bht-berlin.de/judi2641/trainem
- **GitHub Deploy**: https://github.com/judi2641/trainem-deploy

### Deployment
- **Website**: https://trainem-deploy.vercel.app/

### Externe Services
- **Auth0**: https://manage.auth0.com/
- **MongoDB Atlas**: https://www.mongodb.com/
- **OpenAI**: https://platform.openai.com/

### Dokumentation
- **Projektwiki**: https://gitlab.bht-berlin.de/judi2641/trainem/-/wikis/home

---

## 🤖 AI-Disclaimer

Bei der Entwicklung von Trainem wurden folgende AI-Tools genutzt:

| Tool | Verwendung |
|------|-----------|
| **Claude Code** | Code-Generierung, Refactoring, Dokumentation |
| **Vercel V0** | Übertragen des neuen Designs auf alte Komponenten |

---

**Letzte Aktualisierung**: 2026-02-05

[← Zurück zum Wiki](../WIKI.md)
