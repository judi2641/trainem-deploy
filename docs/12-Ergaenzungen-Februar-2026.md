# 12 - Ergänzungen zur bestehenden Dokumentation

**Stand**: 2026-02-05

Dieses Dokument ergänzt die bestehende Projektdokumentation um neue Features, Endpoints und architektonische Änderungen, die seit dem letzten Dokumentationsstand (2026-01-30) hinzugekommen sind.

---

## Inhaltsverzeichnis

- [OpenAI-Integration (KI-Workout-Generierung)](#openai-integration-ki-workout-generierung)
- [Invite-Code System für private Gruppen](#invite-code-system-für-private-gruppen)
- [Überarbeitete Pixel/XP-Mechanik in Battles](#überarbeitete-pixelxp-mechanik-in-battles)
- [Aktualisierte Battle-Einstellungen](#aktualisierte-battle-einstellungen)
- [Zusätzliche Konfigurationsoptionen](#zusätzliche-konfigurationsoptionen)
- [Neue Backend-Services & Utilities](#neue-backend-services--utilities)
- [Aktualisierte Frontend-Komponenten](#aktualisierte-frontend-komponenten)
- [Aktualisiertes Datenmodell](#aktualisiertes-datenmodell)
- [Erweiterte Systemarchitektur](#erweiterte-systemarchitektur)
- [Aktualisierte Workflows](#aktualisierte-workflows)

---

## OpenAI-Integration (KI-Workout-Generierung)

### Übersicht

TrainEm nutzt die **OpenAI Responses API** zur automatischen Generierung personalisierter Workout-Pläne basierend auf den Onboarding-Daten des Users. Die Integration verwendet **Function Calling** (Tool Use), um strukturierte JSON-Ausgaben zu erzeugen und die generierten Übungen gegen den bestehenden Übungskatalog zu validieren.

### Architektur

```
[Onboarding-Wizard (Frontend)]
        ↓
[POST /api/workouts/ai { auth0Id, onboarding }]
        ↓
[AiWorkoutService.generateWorkoutsFromOnboarding()]
        ↓
[ExerciseModel.find() → erlaubte Übungen laden]
        ↓
[openai.ts → createOpenAIResponse()]
        ↓ HTTPS POST
[OpenAI API: /v1/responses]
        ↓ Function Call: create_workouts
[JSON-Output parsen & validieren]
        ↓
[WorkoutService.createEmptyWorkout() + addExerciseToWorkout()]
        ↓
[Fertige Workouts in MongoDB gespeichert]
```

### Technische Details

**API-Kommunikation** (`backend/src/utils/openai.ts`):
- Nativer `https`-Client (kein SDK), um Abhängigkeiten minimal zu halten
- Endpoint: `https://api.openai.com/v1/responses` (OpenAI Responses API)
- Authentifizierung via `Authorization: Bearer ${OPENAI_API_KEY}`
- Logging: Jede Anfrage wird mit Model, Statuscode, Dauer und Token-Verbrauch geloggt (Winston)
- Fehlerbehandlung: HTTP-Statuscodes werden ausgewertet, Parse-Fehler abgefangen

**Workout-Generierung** (`backend/src/endpoints/workouts/AiWorkoutService.ts`):
- **Model**: Konfigurierbar via `OPENAI_MODEL` Umgebungsvariable (Default: `gpt-5-nano`)
- **Reasoning Effort**: `minimal` (für schnellere Antwortzeiten)
- **Max Output Tokens**: Dynamisch berechnet: `200 + 180 × Anzahl Workouts` (400-1800)
- **Function Calling**: `create_workouts`-Tool mit JSON Schema für strukturierte Ausgabe
- **Validierung**: Generierte Übungsnamen werden gegen den Übungskatalog abgeglichen (case-insensitive). Unbekannte Übungen werden verworfen.
- **Begrenzung**: 1-6 Workouts mit je 3-10 Übungen

**Onboarding-Input-Felder**:

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `goal` | String | Trainingsziel (z.B. `muscle_gain`, `weight_loss`) |
| `experience` | String | Erfahrungslevel (`beginner`, `intermediate`, `advanced`) |
| `daysPerWeek` | Number | Trainingstage pro Woche (1-6, Default: 3) |
| `minutesPerSession` | Number | Minuten pro Training |
| `equipment` | String | Verfügbares Equipment (`full_gym`, `home`, `bodyweight`) |
| `limitations` | String | Körperliche Einschränkungen |
| `preferredSplit` | String | Bevorzugter Split (`push_pull_legs`, `upper_lower`, `full_body`) |
| `priorities` | String[] | Priorisierte Muskelgruppen |

### API-Endpoint

```http
POST /api/workouts/ai
```

**Request Body**:
```json
{
  "auth0Id": "auth0|123",
  "onboarding": {
    "goal": "muscle_gain",
    "experience": "intermediate",
    "daysPerWeek": 4,
    "minutesPerSession": 45,
    "equipment": "full_gym",
    "limitations": "",
    "preferredSplit": "push_pull_legs",
    "priorities": ["chest", "back"]
  }
}
```

**Response** (201 Created):
```json
[
  {
    "_id": "workout789",
    "auth0Id": "auth0|123",
    "name": "Push Day",
    "description": "Brust, Schultern, Trizeps",
    "exercises": [
      {
        "exercise": { "name": "Push-Ups", "type": "strength", "primaryMuscleGroups": ["chest"] },
        "sets": 4,
        "reps": 12
      }
    ]
  }
]
```

**Fehlerbehandlung**:
- `400`: `auth0Id` oder `onboarding` fehlt; kein Übungskatalog vorhanden
- `500`: OpenAI API nicht erreichbar oder ungültige Antwort

### Bekannte Einschränkungen

- Die Qualität der generierten Workouts hängt vom gewählten Model ab
- Bei fehlerhafter OpenAI-Antwort (kein valides JSON) schlägt der Endpoint fehl
- Nur Übungen aus dem vordefinierten Katalog (50+) werden verwendet
- Keine Retry-Logik bei API-Timeouts implementiert

---

## Invite-Code System für private Gruppen

### Übersicht

Private Gruppen können jetzt über **Invite-Codes** beigetreten werden. Beim Erstellen einer privaten Gruppe wird automatisch ein 8-stelliger alphanumerischer Code generiert. Owner und Admins können den Code jederzeit regenerieren.

### Funktionsweise

```
[Owner erstellt private Gruppe]
        ↓
[Invite-Code wird generiert (z.B. "A1B2C3D4")]
        ↓
[Owner teilt Code mit gewünschten Mitgliedern]
        ↓
[User gibt Code in "Join by Code" Dialog ein]
        ↓
[POST /api/groups/join-by-code { userId, inviteCode }]
        ↓
[GroupService.joinGroupByInviteCode() → Gruppe gefunden → User beitritt]
```

### Code-Generierung

```typescript
// 8 Zeichen, hexadezimal, Großbuchstaben
crypto.randomBytes(4).toString('hex').toUpperCase()
// Beispiel: "A1B2C3D4"
```

- Codes sind **unique** in der Datenbank (sparse index)
- Nur private Gruppen (`isPublic: false`) erhalten automatisch einen Code
- Bestehende private Gruppen ohne Code erhalten beim ersten Regenerieren einen Code

### Neue API-Endpoints

#### Beitritt via Invite-Code

```http
POST /api/groups/join-by-code
```

**Request Body**:
```json
{
  "userId": "auth0|456",
  "inviteCode": "A1B2C3D4"
}
```

**Response** (200 OK): Gruppen-Objekt

**Fehler**:
- `400`: `inviteCode` fehlt oder ungültig
- `404`: Keine Gruppe mit diesem Code
- `400`: User bereits Mitglied oder Gruppe voll

#### Invite-Code regenerieren

```http
POST /api/groups/:groupId/regenerate-code
```

**Request Body**:
```json
{
  "userId": "auth0|123"
}
```

**Response** (200 OK):
```json
{
  "inviteCode": "E5F6G7H8"
}
```

**Fehler**:
- `403`: Nur Owner oder Admin darf Code regenerieren
- `404`: Gruppe existiert nicht

### Frontend-Integration

- **GroupsArea**: Neuer "Join by Code" Button neben dem Gruppen-Browser
- **GroupDetailModal**: Invite-Code wird für Owner/Admin angezeigt mit Copy-Button
- **Mitglieder-Panel**: Links im GroupDetailModal mit Rollen-Icons (Crown/Shield/User)

---

## Überarbeitete Pixel/XP-Mechanik in Battles

### Bisherige Mechanik (bis 2026-02-04)

- Pixel wurden durch **Übungen UND Habits** verdient
- Beide Win Conditions (`pixels` und `xp`) verhielten sich nahezu identisch

### Neue Mechanik (ab 2026-02-05)

Die Pixel- und XP-Vergabe in Battles wurde differenziert:

| Aktion | Pixel verdient | XP zum Battle | User-XP |
|--------|---------------|---------------|---------|
| **Übung abgeschlossen** | 1 Pixel (pro 67 XP) | +67 XP | +67 |
| **Habit abgeschlossen** | 0 Pixel | +10 XP | +10 |

### Auswirkung auf Win Conditions

| Win Condition | Label im UI | Beschreibung |
|---------------|-------------|-------------|
| `pixels` | **Workouts** | Nur abgeschlossene Übungen zählen. Team mit den meisten Pixeln gewinnt. |
| `xp` | **Workouts + Habits** | Übungen UND Habits zählen. Team mit den meisten XP gewinnt. |

### Technische Umsetzung

**BattleService.addBattleXP** (`backend/src/endpoints/pixelwar/BattleService.ts`):

```typescript
static async addBattleXP(
  battleId: string,
  groupId: string,
  userId: string,
  xp: number,
  isExercise: boolean = true  // NEU: unterscheidet Quelle
): Promise<void> {
  // Team XP wird IMMER hinzugefügt (Übungen + Habits)
  participant.totalXP += xp;

  // Pixel nur bei Übungen (nicht bei Habits)
  const pixelsEarned = isExercise ? Math.floor(xp / 67) : 0;
}
```

**EntryService** (`backend/src/endpoints/entries/EntryService.ts`):

```typescript
// Habit-Completion → isExercise: false
await BattleService.addBattleXP(battleId, groupId, userId, 10, false);

// Exercise-Completion → isExercise: true
await BattleService.addBattleXP(battleId, groupId, userId, 67, true);
```

---

## Aktualisierte Battle-Einstellungen

### Grid-Optionen

| Wert | Label | Hinweis |
|------|-------|---------|
| 15 | 15x15 | Klein, schnelle Battles |
| 30 | 30x30 | Standard |
| 50 | 50x50 | Groß, für längere Battles |

Die Option 100x100 wurde entfernt (Performance-Probleme im Frontend-Rendering).

### Dauer-Optionen

| Wert (Minuten) | Label | Beschreibung |
|----------------|-------|-------------|
| 60 | 1h | Sprint-Battle |
| 1440 | 24h | Tages-Challenge |
| 10080 | 7d | Wochen-Battle (Standard) |
| 40320 | 4w | Monats-Battle |

### Win Conditions

| Wert | Label (alt) | Label (neu) | Beschreibung |
|------|-------------|-------------|-------------|
| `pixels` | Most Pixels | Workouts | Nur Übungen zählen |
| `xp` | Most XP | Workouts + Habits | Übungen und Habits zählen |
| ~~`hybrid`~~ | ~~Hybrid~~ | **entfernt** | - |

---

## Zusätzliche Konfigurationsoptionen

### Neue Umgebungsvariablen

Die OpenAI-Integration benötigt eine `.env`-Datei im Backend:

**`backend/.env`**:
```bash
# OpenAI API Key (erforderlich für KI-Workout-Generierung)
OPENAI_API_KEY=sk-...

# OpenAI Model (optional, Default: gpt-5-nano)
OPENAI_MODEL=gpt-5-nano
```

### Verfügbare OpenAI-Modelle

| Model | Geschwindigkeit | Kosten | Empfehlung |
|-------|----------------|--------|------------|
| `gpt-5-nano` | Schnell | Niedrig | Default, gut für Workout-Generierung |
| `gpt-4.1-mini` | Mittel | Mittel | Bessere Workout-Qualität |
| `gpt-4.1` | Langsam | Hoch | Beste Qualität, höhere Latenz |

### Auswirkung auf Setup

Die bisherige Dokumentation (`02-Developer-Setup.md`) gibt an, dass keine `.env`-Datei erforderlich ist. Dies gilt weiterhin für den **Basis-Betrieb** (Auth, CRUD). Für die **KI-Workout-Generierung** wird jedoch die `.env`-Datei mit `OPENAI_API_KEY` benötigt.

Falls kein API Key konfiguriert ist, funktioniert die App normal weiter - lediglich der `POST /api/workouts/ai` Endpoint gibt einen `500`-Fehler zurück.

---

## Neue Backend-Services & Utilities

### openai.ts (Utility)

**Datei**: `backend/src/utils/openai.ts`

Zentraler HTTP-Client für die OpenAI Responses API.

**Exportierte Funktionen**:

| Funktion | Parameter | Beschreibung |
|----------|-----------|-------------|
| `createOpenAIResponse(payload)` | `Record<string, unknown>` | Sendet Request an OpenAI `/v1/responses`, gibt geparstes JSON zurück |
| `extractOutputText(response)` | `OpenAIResponse` | Extrahiert Text aus verschiedenen Antwortformaten (output_text, content, function_call) |

**Interne Hilfsfunktionen**:
- `findWorkoutsObject(value)` - Sucht rekursiv nach `workouts`-Array in verschachtelten Objekten
- `summarizeResponse(response)` - Erzeugt Debug-Summary bei fehlerhaften Antworten

**Logging**:
```
openai response ok model=gpt-5-nano status=200 duration_ms=1234 tokens_in=500 tokens_out=300
```

### AiWorkoutService.ts (Service)

**Datei**: `backend/src/endpoints/workouts/AiWorkoutService.ts`

**Exportierte Funktionen**:

| Funktion | Parameter | Rückgabe | Beschreibung |
|----------|-----------|----------|-------------|
| `generateWorkoutsFromOnboarding(auth0Id, onboarding)` | `string`, `OnboardingInput` | `Promise<Workout[]>` | Generiert Workouts via OpenAI und speichert sie in der Datenbank |

**Interner Ablauf**:
1. Alle Übungsnamen aus dem Katalog laden
2. OpenAI-Payload mit User-Daten und erlaubten Übungen zusammenbauen
3. Function Call `create_workouts` an OpenAI senden
4. JSON-Antwort parsen (Tool Call oder Text)
5. Übungsnamen gegen Katalog validieren (case-insensitive)
6. Workouts via `WorkoutService` erstellen und Übungen hinzufügen

---

## Aktualisierte Frontend-Komponenten

### GroupDetailModal

**Datei**: `frontend/src/components/groups/GroupDetailModal.tsx`

Neue Features:
- **Mitglieder-Panel** (links): Zeigt alle Gruppenmitglieder mit Rollen-Icons
  - Crown-Icon (gelb) = Owner
  - Shield-Icon (blau) = Admin
  - User-Icon (grau) = Member
- **Invite-Code Anzeige** (für Owner/Admin): Code mit Copy-to-Clipboard Button
- Importierte Icons: `Crown`, `Shield`, `User`, `Copy` aus `lucide-react`

### GroupsArea

**Datei**: `frontend/src/components/GroupsArea.tsx`

Neue Features:
- **"Join by Code" Button**: Öffnet modalen Dialog zur Code-Eingabe
- **Join-Code Modal**: Textfeld für Invite-Code + Submit
- Neuer State: `isJoinCodeModalOpen`, `joinCode`

### ChallengeModal

**Datei**: `frontend/src/components/pixelwar/battles/ChallengeModal.tsx`

Änderungen:
- Grid-Optionen: 15x15, 30x30, 50x50 (100x100 entfernt)
- Dauer-Optionen: 1h, 24h, 7d, 4w
- Win Conditions umbenannt:
  - "Workouts" (statt "Most Pixels") mit Hinweis "Only completed exercises earn pixels for your team"
  - "Workouts + Habits" (statt "Most XP") mit Hinweis "Exercises and daily habits both count towards victory"
- Hybrid-Modus entfernt

---

## Aktualisiertes Datenmodell

### Group Model - Neues Feld: inviteCode

**Ergänzung zu** `backend/src/endpoints/groups/GroupModel.ts`:

```typescript
{
  // ... bestehende Felder ...
  inviteCode: {
    type: String,
    unique: true,
    sparse: true   // Index nur wenn Wert vorhanden
  }
}
```

- Wird automatisch bei Erstellung einer privaten Gruppe generiert
- `sparse: true` stellt sicher, dass öffentliche Gruppen (ohne Code) den Unique-Index nicht verletzen
- 8 Zeichen, hexadezimal, Großbuchstaben (z.B. `A1B2C3D4`)

### Battle Model - Aktualisierte Settings

```typescript
settings: {
  duration: Number,      // 60 | 1440 | 10080 | 40320 (Minuten)
  gridSize: Number,      // 15 | 30 | 50
  winCondition: String,  // 'pixels' | 'xp' (hybrid entfernt)
  xpPerPixel: Number,
  allowOverwrite: Boolean
}
```

### BattleService.addBattleXP - Neuer Parameter

```typescript
static async addBattleXP(
  battleId: string,
  groupId: string,
  userId: string,
  xp: number,
  isExercise: boolean = true  // NEU
): Promise<void>
```

- `isExercise: true` → Pixel werden verdient (1 pro 67 XP)
- `isExercise: false` → Nur XP, keine Pixel (für Habits)

---

## Erweiterte Systemarchitektur

### Aktualisiertes Architektur-Diagramm

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│   React App     │  HTTP   │   Express API    │  CRUD   │    MongoDB      │
│   (Vite)        │ ◄─────► │   (Node.js)      │ ◄─────► │   (Docker)      │
│                 │  REST   │                  │         │                 │
│  Port: 5173     │         │  Port: 3000      │         │  Port: 27017    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │
        │                            │
        └────────────────────────────┘
                   Auth0 JWT
           (Token Validation)

                                     │
                                     │ HTTPS (Function Calling)
                                     ▼
                            ┌──────────────────┐
                            │   OpenAI API     │
                            │  (Responses API) │
                            │  gpt-5-nano      │
                            └──────────────────┘
```

### Erweiterte Component-Übersicht

| Layer | Technologie | Verantwortung |
|-------|-------------|---------------|
| **Frontend** | React 19 + Vite | UI/UX, State Management, Routing |
| **Backend** | Express.js 5 | REST API, Business Logic, Validation |
| **Database** | MongoDB 8 | Data Persistence |
| **Auth** | Auth0 | User Authentication & Authorization |
| **AI** | OpenAI API | Personalisierte Workout-Generierung |
| **Build** | TypeScript 5.9 | Type Safety, Compilation |

### Neue Backend-Dateien (Projektstruktur-Ergänzung)

```
backend/src/
├── endpoints/
│   ├── workouts/
│   │   ├── AiWorkoutService.ts    # NEU: OpenAI Workout-Generierung
│   │   └── ...
│   ├── groups/
│   │   ├── GroupModel.ts          # ERWEITERT: inviteCode Feld
│   │   ├── GroupService.ts        # ERWEITERT: joinByCode, regenerateCode
│   │   └── GroupRoute.ts          # ERWEITERT: 2 neue Endpoints
│   └── pixelwar/
│       ├── BattleService.ts       # ERWEITERT: isExercise Parameter
│       └── ...
└── utils/
    ├── openai.ts                  # NEU: OpenAI HTTP-Client
    └── ...
```

---

## Aktualisierte Workflows

### KI-Workout-Generierung (Onboarding)

```
[User registriert sich via Auth0]
        ↓
[6-Schritt Onboarding-Wizard]
        ↓
[Schritt 6: Trainingsplan-Generierung]
        ↓
[POST /api/workouts/ai { auth0Id, onboarding }]
        ↓
[AiWorkoutService → OpenAI Responses API]
        ↓
[Function Call: create_workouts → JSON mit Workout-Plänen]
        ↓
[Validierung gegen Übungskatalog (50+ Übungen)]
        ↓
[1-6 Workouts in MongoDB gespeichert]
        ↓
[User wird zum Dashboard weitergeleitet]
```

### Privater Gruppen-Beitritt via Invite-Code

```
[Owner erstellt private Gruppe → Invite-Code generiert]
        ↓
[Owner teilt Code (z.B. via Chat, E-Mail)]
        ↓
[Eingeladener User öffnet Groups-Seite]
        ↓
[Klick auf "Join by Code" Button]
        ↓
[Eingabe des 8-stelligen Codes]
        ↓
[POST /api/groups/join-by-code { userId, inviteCode }]
        ↓
[GroupService findet Gruppe anhand Code]
        ↓
[User wird als Member hinzugefügt]
```

### Battle XP/Pixel-Vergabe (aktualisiert)

```
[User schließt Übung ab]
        ↓
[EntryService.updateEntry() → score += 67, User.points += 67]
        ↓
[Für jede Gruppe des Users:]
  ├── PixelWarService.grantPixelRights(groupId, userId, 67)
  ├── GroupService.addGroupXP(groupId, userId, 67)
  └── Für jedes aktive Battle der Gruppe:
      └── BattleService.addBattleXP(battleId, groupId, userId, 67, true)
          ├── participant.totalXP += 67
          └── pixelsEarned = Math.floor(67 / 67) = 1  ← Pixel verdient

[User schließt Habit ab]
        ↓
[EntryService.createEntry() → score = 10, User.points += 10]
        ↓
[Für jede Gruppe des Users:]
  ├── PixelWarService.grantPixelRights(groupId, userId, 10)
  ├── GroupService.addGroupXP(groupId, userId, 10)
  └── Für jedes aktive Battle der Gruppe:
      └── BattleService.addBattleXP(battleId, groupId, userId, 10, false)
          ├── participant.totalXP += 10
          └── pixelsEarned = 0  ← KEINE Pixel für Habits
```

---

## Edge Cases & bekannte Einschränkungen

### OpenAI-Integration

- **Kein API Key**: App funktioniert normal, nur `/api/workouts/ai` gibt 500 zurück
- **Rate Limits**: OpenAI hat eigene Rate Limits; keine clientseitige Retry-Logik
- **Antwortformat**: Falls OpenAI kein valides JSON liefert (selten), schlägt der Endpoint fehl
- **Übungsvalidierung**: Wenn OpenAI Übungen generiert, die nicht im Katalog sind, werden diese still verworfen. Ein leeres Workout (ohne gültige Übungen) wird übersprungen.

### Invite-Codes

- **Uniqueness**: Codes sind datenbankweit unique. Bei Kollision (extrem unwahrscheinlich bei 4 Byte Entropie = 4.3 Mrd. Kombinationen) schlägt die Erstellung fehl.
- **Öffentliche Gruppen**: Haben keinen Invite-Code. `sparse: true` Index verhindert Konflikte.
- **Code-Regenerierung**: Der alte Code wird sofort ungültig. Bestehende Mitglieder sind nicht betroffen.

### Pixel/XP-Mechanik

- **Rückwärtskompatibilität**: Bestehende Battles mit `winCondition: 'hybrid'` in der Datenbank funktionieren weiterhin, können aber nicht mehr neu erstellt werden.
- **Pixel-Berechnung**: `Math.floor(xp / 67)` → Bei 67 XP (1 Übung) = exakt 1 Pixel. Bei Habits (10 XP) = 0 Pixel.
- **Gruppen-XP vs. Battle-XP**: Gruppen-XP (`GroupService.addGroupXP`) zählt weiterhin sowohl Übungen als auch Habits. Die Differenzierung betrifft nur die Battle-Pixel-Vergabe.

---

**Letzte Aktualisierung**: 2026-02-05
