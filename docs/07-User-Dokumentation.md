# 07 - User-Dokumentation

[← Zurück zum Wiki](../WIKI.md)

---

## 🎯 Für wen ist Trainem?

Trainem ist eine Fitness- und Habit-Tracking-App für alle, die:
- Ihre Workouts und Gewohnheiten systematisch verfolgen wollen
- Gamification-Elemente (XP, Level, Pixel-Avatar) motivierend finden
- Flexibilität bei der Trainingsplanung schätzen
- Ihre Fortschritte visuell sehen möchten

---

## 💻 Systemanforderungen

### Desktop
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Bildschirmauflösung**: mind. 1280x720
- **Internet**: Stabile Verbindung (min. 1 Mbps)

### Mobile
- **Browser**: Safari (iOS 14+), Chrome (Android 8+)
- **Bildschirmgröße**: mind. 360x640
- Responsive Design für Smartphones & Tablets

---

## 📥 Installation & Start

### Online-Version (empfohlen)
1. Gehe zu [Production URL hier einfügen]
2. Klicke auf "Sign Up"
3. Registriere dich via Auth0 (Email/Social Login)
4. Durchlaufe das Onboarding (7 Schritte)
5. Fertig! Du bist auf dem Dashboard

### Lokale Installation (für Entwickler)
Siehe [02-Developer-Setup.md](02-Developer-Setup.md)

---

## 🚀 Erste Schritte

### 1. Registrierung & Onboarding

Nach der Registrierung durchläufst du 7 Schritte:

1. **Landing**: Willkommen bei Trainem
2. **Intro**: Kurze Einführung
3. **Basic Info**: Name, Geburtsdatum, Geschlecht
4. **Experience**: Trainingserfahrung (Anfänger, Fortgeschritten, Profi)
5. **Goals**: Trainingsziel (Muskelaufbau, Gewicht senken, etc.)
6. **Schedule**: An welchen Wochentagen trainierst du?
7. **Character Color**: Wähle eine Farbe für deinen Pixel-Avatar

### 2. Dashboard erkunden

Nach dem Onboarding siehst du:
- **Pixel-Character**: Dein Avatar mit Level & XP
- **Quick Stats**: Streak, Total XP, Level
- **Upcoming Workouts**: Geplante Workouts
- **Weekly Progress**: Diese Woche absolvierte Trainings

### 3. Ersten Workout erstellen

1. Gehe zu **Workouts** (Sidebar)
2. Klicke "New Workout"
3. Gib Namen & Beschreibung ein
4. Füge Übungen hinzu:
   - Wähle aus 50+ vordefinierten Übungen
   - Setze Sets, Reps, Weight
5. Speichere den Workout

### 4. Workout ausführen

1. Gehe zu **Dashboard**
2. Klicke auf einen Workout
3. Klicke "Start"
4. Hake jede absolvierte Übung ab → **+67 XP pro Übung**
5. Workout abschließen

### 5. Habits erstellen

1. Gehe zu **Habits**
2. Klicke "New Habit"
3. Wähle:
   - **Daily** (täglich) oder
   - **Weekly** (bestimmter Wochentag)
4. Gib Namen & Beschreibung ein
5. Speichere

### 6. Statistiken ansehen

1. Gehe zu **Statistics**
2. Siehst du:
   - XP Progress (Verlauf über Zeit)
   - Plan Completion Rate
   - Weekday Performance
   - Streak & Average Tasks per Week

---

## 📚 Features & Workflows

### Workouts

**Workout erstellen**:
- Workouts → New Workout → Name, Description → Add Exercises → Save

**Workout bearbeiten**:
- Workouts → Klick auf Workout → Edit → Änderungen → Save

**Workout löschen**:
- Workouts → Klick auf Workout → Delete → Confirm

**Workout ausführen**:
- Dashboard → Klick auf Workout → Start → Übungen abhaken → Finish

### Habits

**Daily Habit**:
- Habits → New Habit → Type: Daily → Name → Save
- Jeden Tag: Habit abhaken → **+10 XP**

**Weekly Habit**:
- Habits → New Habit → Type: Weekly → Wochentag wählen → Save
- Am gewählten Tag: Habit abhaken → **+10 XP**

### XP & Leveling

**XP sammeln**:
- Workout-Übung abschließen: **+67 XP**
- Habit abschließen: **+10 XP**

**Level berechnen**:
- Level 1: 0-99 XP
- Level 2: 100-109 XP
- Level 3: 110-119 XP
- Jedes Level: +10 XP mehr

**Level anzeigen**:
- Dashboard → Pixel-Character zeigt aktuelles Level

### Pixel-Art Avatar

**Avatar anpassen**:
- Pixel-Art → Farbe wählen → Pixel setzen → Save
- Avatar wird im Dashboard & Profil angezeigt

**Grid-Size**: 32x32 Pixel

### Streak

**Streak erhöhen**:
- Trainiere jeden Tag → Streak +1
- Verpasse einen Tag → Streak setzt auf 0 zurück

**Streak sehen**:
- Dashboard → Quick Stats → "🔥 Streak: X Tage"

---

## ❓ FAQ

**Q: Kann ich Workouts mit Freunden teilen?**
A: Aktuell nicht, geplant für zukünftige Versionen.

**Q: Werden meine Daten in der Cloud gespeichert?**
A: Ja, in MongoDB (verschlüsselt).

**Q: Kann ich offline trainieren?**
A: Nein, Internet-Verbindung erforderlich.

**Q: Kann ich meinen Avatar ändern?**
A: Ja, unter Pixel-Art kannst du ihn jederzeit anpassen.

**Q: Was passiert, wenn ich XP verliere?**
A: XP gehen nie verloren! Auch abgebrochene Workouts behalten verdiente XP.

**Q: Kann ich vergangene Workouts sehen?**
A: Ja, unter Calendar siehst du alle vergangenen Entries.

**Q: Gibt es eine Mobile App?**
A: Nein, aber die Webapp ist responsiv und funktioniert auf Smartphones.

---

## 🐛 Troubleshooting

**Problem: Ich kann mich nicht einloggen**
Lösung: Prüfe Email/Passwort, ggf. "Forgot Password" nutzen

**Problem: Workout-Übung wird nicht gespeichert**
Lösung: Prüfe Internet-Verbindung, Seite neu laden

**Problem: XP werden nicht angezeigt**
Lösung: Seite neu laden (F5), Browser-Cache leeren

**Problem: Pixel-Avatar lädt nicht**
Lösung: Browser-Cache leeren, ggf. anderen Browser testen

**Problem: Statistiken sind leer**
Lösung: Du musst mindestens 1 Workout abgeschlossen haben

---

## 📞 Support

**Bei Fragen oder Problemen**:
- Email: [support@trainem.app]
- Issues: [GitLab Issue Tracker]
- FAQ: [Siehe oben]

---

**Letzte Aktualisierung**: 2026-01-24

[← Zurück zum Wiki](../WIKI.md)
