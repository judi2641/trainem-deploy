# 03 - API-Dokumentation

[← Zurück zum Wiki](../WIKI.md)

---

## 📋 Inhaltsverzeichnis

- [Base URL](#base-url)
- [Authentifizierung](#authentifizierung)
- [User Endpoints](#user-endpoints)
- [Workout Endpoints](#workout-endpoints)
- [Habit Endpoints](#habit-endpoints)
- [Entry Endpoints](#entry-endpoints)
- [Exercise Endpoints](#exercise-endpoints)
- [PixelArt Endpoints](#pixelart-endpoints)
- [Group Endpoints](#group-endpoints)
- [PixelWar Endpoints](#pixelwar-endpoints)
- [Battle Endpoints (Pixel Wars 1v1)](#-battle-endpoints-pixel-wars-1v1)
- [Error Handling](#error-handling)

---

## 🌐 Base URL

**Development**: `http://localhost:3000`
**Production**: `[URL hier einfügen]`

Alle Endpoints beginnen mit `/api`.

---

## 🔐 Authentifizierung

Die API nutzt **Auth0 JWT Bearer Tokens**.

### Header Format

Alle geschützten Endpoints benötigen:

```http
Authorization: Bearer <your-jwt-token>
```

### Token erhalten

**Im Frontend**:
```typescript
const { getAccessTokenSilently } = useAuth0();
const token = await getAccessTokenSilently();

fetch('http://localhost:3000/api/user/auth0|123', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Ungeschützte Endpoints

- `GET /api/exercises` - Übungskatalog (öffentlich)

---

## 👤 User Endpoints

### 1. Initialen User erstellen

Erstellt einen User nach Auth0-Registrierung.

```http
POST /api/user
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "auth0Id": "auth0|64f5e1234567890abcdef"
}
```

**Response** (201 Created):
```json
{
  "_id": "6789abcdef123456",
  "email": "user@example.com",
  "auth0Id": "auth0|64f5e1234567890abcdef",
  "points": 0,
  "streak": 0,
  "onboardingCompleted": false,
  "createdAt": "2026-01-24T10:00:00.000Z",
  "updatedAt": "2026-01-24T10:00:00.000Z"
}
```

**Errors**:
- `400 Bad Request` - Email oder auth0Id fehlt
- `409 Conflict` - User existiert bereits

---

### 2. User-Daten abrufen

```http
GET /api/user/:auth0Id
```

**Path Parameters**:
- `auth0Id` - Auth0 User ID (z.B. `auth0|123`)

**Response** (200 OK):
```json
{
  "_id": "6789abcdef123456",
  "email": "user@example.com",
  "auth0Id": "auth0|64f5e1234567890abcdef",
  "firstName": "Max",
  "lastName": "Mustermann",
  "birthDate": "2000-01-15T00:00:00.000Z",
  "points": 1340,
  "streak": 5,
  "lastActiveDate": "2026-01-24T10:00:00.000Z",
  "onboardingCompleted": true,
  "pixels": [...],
  "canvas": {
    "width": 32,
    "height": 32,
    "pixels": [...]
  }
}
```

**Errors**:
- `404 Not Found` - User existiert nicht

---

### 3. Basic Info speichern (Onboarding)

Speichert Name, Geburtsdatum, Gender aus Onboarding.

```http
POST /api/user/:auth0Id/basic
```

**Request Body**:
```json
{
  "firstname": "Max",
  "lastname": "Mustermann",
  "birthDate": "2000-01-15",
  "gender": "Male",
  "img": "https://example.com/avatar.jpg"
}
```

**Response** (200 OK):
```json
{
  "_id": "6789abcdef123456",
  "firstName": "Max",
  "lastName": "Mustermann",
  "birthDate": "2000-01-15T00:00:00.000Z",
  ...
}
```

---

## 💪 Workout Endpoints

### 1. Alle Workouts eines Users

```http
GET /api/workouts/:auth0Id
```

**Response** (200 OK):
```json
[
  {
    "_id": "workout123",
    "auth0Id": "auth0|123",
    "name": "Leg Day",
    "description": "Beintraining für Fortgeschrittene",
    "exercises": [
      {
        "exercise": {
          "name": "Squats",
          "type": "strength",
          "primaryMuscleGroups": ["legs", "glutes"],
          "executionInstructions": "...",
          "videoUrl": "https://youtube.com/..."
        },
        "sets": 4,
        "reps": 12,
        "weight": 80
      }
    ],
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
]
```

---

### 2. Leeren Workout erstellen

```http
POST /api/workouts
```

**Request Body**:
```json
{
  "auth0Id": "auth0|123",
  "name": "Mein neuer Workout",
  "description": "Beschreibung (optional)"
}
```

**Response** (201 Created):
```json
{
  "_id": "workout456",
  "auth0Id": "auth0|123",
  "name": "Mein neuer Workout",
  "description": "Beschreibung",
  "exercises": [],
  "createdAt": "2026-01-24T12:00:00.000Z"
}
```

---

### 3. Onboarding-Workout erstellen

Spezielle Route für initiales Workout im Onboarding.

```http
POST /api/workouts/onboarding
```

**Request Body**:
```json
{
  "auth0Id": "auth0|123",
  "name": "onboarding workout",
  "description": "created in onboarding"
}
```

**Response**: Wie bei POST /api/workouts

---

### 4. Übung zu Workout hinzufügen

```http
POST /api/workouts/:workoutId/exercises
```

**Path Parameters**:
- `workoutId` - Workout MongoDB ObjectId

**Request Body**:
```json
{
  "exerciseName": "Push-Ups",
  "sets": 3,
  "reps": 15,
  "duration": 0
}
```

**Response** (200 OK):
```json
{
  "_id": "workout123",
  "exercises": [
    // ... alle Übungen inkl. der neuen
  ]
}
```

**Errors**:
- `404 Not Found` - Workout existiert nicht

---

### 5. Workout aktualisieren

```http
PUT /api/workouts/:workoutId
```

**Request Body**:
```json
{
  "auth0Id": "auth0|123",
  "name": "Neuer Name",
  "description": "Neue Beschreibung"
}
```

**Response** (200 OK): Aktualisiertes Workout

**Errors**:
- `403 Forbidden` - Nicht autorisiert
- `404 Not Found` - Workout existiert nicht

---

### 6. Workout löschen

```http
DELETE /api/workouts/:workoutId
```

**Request Body**:
```json
{
  "auth0Id": "auth0|123"
}
```

**Response** (204 No Content)

**Errors**:
- `403 Forbidden` - Nicht autorisiert
- `404 Not Found` - Workout existiert nicht

---

### 7. Übung aus Workout entfernen

```http
DELETE /api/workouts/:workoutId/exercises/:exerciseIndex
```

**Path Parameters**:
- `workoutId` - Workout MongoDB ObjectId
- `exerciseIndex` - Index der Übung (0-basiert)

**Request Body**:
```json
{
  "auth0Id": "auth0|123"
}
```

**Response** (200 OK): Aktualisiertes Workout

---

## 🎯 Habit Endpoints

### 1. Alle Habits eines Users

```http
GET /api/habits/:auth0Id
```

**Response** (200 OK):
```json
[
  {
    "_id": "habit123",
    "auth0Id": "auth0|123",
    "name": "10 Min Meditation",
    "type": "daily",
    "description": "Täglich meditieren",
    "createdAt": "2026-01-20T10:00:00.000Z"
  },
  {
    "_id": "habit456",
    "auth0Id": "auth0|123",
    "name": "Joggen",
    "type": "weekly",
    "weekday": 1,  // 0=Sonntag, 1=Montag, ...
    "description": "Montags 30 Min joggen",
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
]
```

---

### 2. Habit erstellen

```http
POST /api/habits
```

**Request Body** (Daily Habit):
```json
{
  "auth0Id": "auth0|123",
  "name": "Wasser trinken",
  "type": "daily",
  "description": "2L Wasser täglich"
}
```

**Request Body** (Weekly Habit):
```json
{
  "auth0Id": "auth0|123",
  "name": "Schwimmen",
  "type": "weekly",
  "weekday": 3,  // Mittwoch
  "description": "Mittwochs schwimmen"
}
```

**Response** (201 Created):
```json
{
  "_id": "habit789",
  "auth0Id": "auth0|123",
  "name": "Wasser trinken",
  "type": "daily",
  ...
}
```

**Validation**:
- `type` muss `daily` oder `weekly` sein
- `weekday` nur bei `type: "weekly"` (0-6)

---

### 3. Habit aktualisieren

```http
PUT /api/habits/:habitId
```

**Request Body**:
```json
{
  "auth0Id": "auth0|123",
  "name": "Neuer Name",
  "description": "Neue Beschreibung",
  "type": "weekly",
  "weekday": 2
}
```

**Response** (200 OK): Aktualisiertes Habit

**Errors**:
- `403 Forbidden` - Nicht autorisiert
- `404 Not Found` - Habit existiert nicht

---

### 4. Habit löschen

```http
DELETE /api/habits/:habitId
```

**Request Body**:
```json
{
  "auth0Id": "auth0|123"
}
```

**Response** (204 No Content)

**Errors**:
- `403 Forbidden` - Nicht autorisiert
- `404 Not Found` - Habit existiert nicht

---

## 📝 Entry Endpoints

Entries sind abgeschlossene Workouts oder Habits.

### 1. Alle Entries eines Users

```http
GET /api/entries/:auth0Id
```

**Response** (200 OK):
```json
[
  {
    "_id": "entry123",
    "auth0Id": "auth0|123",
    "date": "2026-01-24T10:00:00.000Z",
    "workoutId": "workout123",
    "plannedExercises": [
      {
        "exercise": { "name": "Squats", ... },
        "sets": 4,
        "reps": 12
      }
    ],
    "completed_exercises": [],
    "completed": false,
    "score": 0
  },
  {
    "_id": "entry456",
    "auth0Id": "auth0|123",
    "date": "2026-01-23T10:00:00.000Z",
    "habitId": "habit123",
    "completed": true,
    "score": 10
  }
]
```

---

### 2. Entry erstellen (Workout/Habit starten)

```http
POST /api/entries
```

**Request Body** (Workout Entry):
```json
{
  "auth0Id": "auth0|123",
  "workoutId": "workout123",
  "plannedExercises": [
    {
      "exercise": { "name": "Squats", ... },
      "sets": 4,
      "reps": 12,
      "weight": 80
    }
  ]
}
```

**Request Body** (Habit Entry):
```json
{
  "auth0Id": "auth0|123",
  "habitId": "habit123"
}
```

**Response** (201 Created):
```json
{
  "_id": "entry789",
  "auth0Id": "auth0|123",
  "date": "2026-01-24T12:00:00.000Z",
  "workoutId": "workout123",
  "plannedExercises": [...],
  "completed_exercises": [],
  "completed": false,
  "score": 0
}
```

---

### 3. Übung als abgeschlossen markieren

```http
PATCH /api/entries/:entryId/complete-exercise
```

**Path Parameters**:
- `entryId` - Entry MongoDB ObjectId

**Request Body**:
```json
{
  "exerciseName": "Squats"
}
```

**Response** (200 OK):
```json
{
  "_id": "entry789",
  "plannedExercises": [],  // Squats entfernt
  "completed_exercises": [
    {
      "exercise": { "name": "Squats", ... },
      "sets": 4,
      "reps": 12
    }
  ],
  "score": 67,  // +67 XP
  "completed": false
}
```

**Logic**:
1. Übung von `plannedExercises` zu `completed_exercises` verschieben
2. `score` += 67
3. User `points` += 67
4. Wenn `plannedExercises` leer → `completed: true`

**Errors**:
- `404 Not Found` - Übung nicht in plannedExercises

---

### 4. Entry abbrechen

```http
PATCH /api/entries/:entryId/abort
```

**Response** (200 OK):
```json
{
  "_id": "entry789",
  "completed": false,
  "score": 67,  // Bereits verdiente XP bleiben
  "aborted": true  // (falls implementiert)
}
```

**Logic**:
- Entry wird als abgebrochen markiert
- Bereits verdiente XP bleiben erhalten

---

### 5. Entry löschen

```http
DELETE /api/entries/:entryId
```

**Request Body**:
```json
{
  "auth0Id": "auth0|123"
}
```

**Response** (204 No Content)

**Errors**:
- `403 Forbidden` - Nicht autorisiert
- `404 Not Found` - Entry existiert nicht

---

## 🏋️ Exercise Endpoints

### 1. Alle verfügbaren Übungen

```http
GET /api/exercises
```

**Response** (200 OK):
```json
[
  {
    "_id": "ex123",
    "name": "Squats",
    "type": "strength",
    "primaryMuscleGroups": ["legs", "glutes"],
    "executionInstructions": "Füße schulterbreit, Knie nicht über Zehenspitzen, ...",
    "videoUrl": "https://youtube.com/watch?v=aClxtDcdpsQ",
    "imageUrl": "https://example.com/squats.jpg"
  },
  {
    "_id": "ex456",
    "name": "Burpees",
    "type": "cardio",
    "primaryMuscleGroups": ["fullbody"],
    "executionInstructions": "...",
    "videoUrl": "https://youtube.com/..."
  }
  // ... 50+ Übungen
]
```

**Exercise Categories**:
- **Legs & Glutes**: Squats, Lunges, Glute Bridges, Bulgarian Split Squats, ...
- **Core**: Plank, Crunches, Russian Twists, Bicycle Crunches, ...
- **Chest/Shoulders/Triceps**: Push-Ups, Dips, Pike Push-Ups, ...
- **Back/Biceps**: Rows, Pull-Ups, Superman, ...
- **Full Body Cardio**: Burpees, Jumping Jacks, Mountain Climbers, ...

---

## 🎨 PixelArt Endpoints

### 1. Pixel-Art laden

```http
GET /api/pixel-art/:auth0ID
```

**Response** (200 OK):
```json
{
  "_id": "pixel123",
  "auth0ID": "auth0|123",
  "gridSize": 32,
  "pixels": [
    { "x": 10, "y": 15, "color": "#FF5733" },
    { "x": 11, "y": 15, "color": "#FF5733" },
    { "x": 12, "y": 15, "color": "#33FF57" }
    // ... weitere Pixel
  ],
  "createdAt": "2026-01-24T10:00:00.000Z"
}
```

**Errors**:
- `404 Not Found` - Noch kein Pixel-Art erstellt

---

### 2. Pixel-Art speichern

```http
POST /api/pixel-art/:auth0ID
```

**Request Body**:
```json
{
  "gridSize": 32,
  "pixels": [
    { "x": 10, "y": 15, "color": "#FF5733" },
    { "x": 11, "y": 15, "color": "#FF5733" }
  ]
}
```

**Response** (201 Created):
```json
{
  "_id": "pixel123",
  "auth0ID": "auth0|123",
  "gridSize": 32,
  "pixels": [...],
  "createdAt": "2026-01-24T12:00:00.000Z"
}
```

**Validation**:
- `gridSize`: 1-128
- `pixels`: Array mit `x`, `y` (Number), `color` (Hex String)

---

## 👥 Group Endpoints

### 1. Gruppe erstellen

```http
POST /api/groups
```

**Request Body**:
```json
{
  "name": "Team Awesome",
  "description": "Best training group ever",
  "color": "#FF6B6B",
  "ownerId": "auth0|123",
  "isPublic": true,
  "maxMembers": 20
}
```

**Response** (201 Created):
```json
{
  "_id": "group123",
  "name": "Team Awesome",
  "description": "Best training group ever",
  "color": "#FF6B6B",
  "members": [
    {
      "userId": "auth0|123",
      "role": "owner",
      "joinedAt": "2026-01-24T10:00:00.000Z",
      "contributedXP": 0
    }
  ],
  "isPublic": true,
  "maxMembers": 20,
  "totalXP": 0,
  "currentSeasonXP": 0,
  "createdAt": "2026-01-24T10:00:00.000Z"
}
```

---

### 2. Öffentliche Gruppen abrufen

```http
GET /api/groups/public?limit=50&skip=0
```

**Query Parameters**:
- `limit` (optional): Anzahl der Gruppen (default: 50)
- `skip` (optional): Offset für Pagination (default: 0)

**Response** (200 OK):
```json
[
  {
    "_id": "group123",
    "name": "Team Awesome",
    "color": "#FF6B6B",
    "members": [...],
    "totalXP": 15000,
    "currentSeasonXP": 5000
  }
]
```

---

### 3. Gruppen eines Users

```http
GET /api/groups/user/:userId
```

**Response** (200 OK): Array von Gruppen

---

### 4. Gruppe nach ID

```http
GET /api/groups/:groupId
```

---

### 5. Gruppe beitreten

```http
POST /api/groups/:groupId/join
```

**Request Body**:
```json
{
  "userId": "auth0|456"
}
```

**Errors**:
- `400 Bad Request`: User ist bereits Mitglied oder Gruppe ist voll
- `403 Forbidden`: Gruppe ist privat

---

### 6. Gruppe verlassen

```http
POST /api/groups/:groupId/leave
```

**Request Body**:
```json
{
  "userId": "auth0|456"
}
```

**Errors**:
- `400 Bad Request`: Owner kann Gruppe nicht verlassen

---

### 7. Gruppe löschen

```http
DELETE /api/groups/:groupId
```

**Request Body**:
```json
{
  "userId": "auth0|123"
}
```

**Errors**:
- `403 Forbidden`: Nur Owner kann Gruppe löschen

---

### 8. Member-Rolle ändern

```http
PATCH /api/groups/:groupId/members/:targetUserId/role
```

**Request Body**:
```json
{
  "requesterId": "auth0|123",
  "newRole": "admin"
}
```

**Allowed roles**: `admin`, `member`

---

### 9. Gruppen-Canvas Info abrufen

```http
GET /api/groups/:groupId/pixel-art
```

**Response** (200 OK):
```json
{
  "gridSize": 16,
  "pixels": [
    {
      "x": 5,
      "y": 3,
      "color": "#FF6B6B",
      "placedBy": "auth0|123",
      "placedAt": "2026-01-30T10:00:00.000Z"
    }
  ],
  "usedPixels": 1,
  "unlockedPixels": 3,
  "availablePixels": 2
}
```

**Felder**:
- `gridSize`: Canvas-Größe (16x16)
- `usedPixels`: Bereits platzierte Pixel
- `unlockedPixels`: Durch Battle-Siege freigeschaltete Pixel
- `availablePixels`: Noch platzierbare Pixel (`unlockedPixels - usedPixels`)

---

### 10. Pixel auf Gruppen-Canvas platzieren

```http
POST /api/groups/:groupId/pixel-art
```

**Request Body**:
```json
{
  "userId": "auth0|123",
  "x": 5,
  "y": 3,
  "color": "#FF6B6B"
}
```

**Response** (200 OK):
```json
{
  "gridSize": 16,
  "pixels": [...],
  "usedPixels": 2,
  "unlockedPixels": 3,
  "availablePixels": 1,
  "wins": 3,
  "losses": 1
}
```

**Logik**:
- User muss Mitglied der Gruppe sein
- Gruppe muss `availablePixels > 0` haben
- Existierende Pixel können überschrieben werden (zählt nicht als neuer Pixel)
- Pro Battle-Sieg wird `unlockedPixels` um 1 erhöht

**Errors**:
- `400 Bad Request`: Keine Pixel verfügbar, ungültige Koordinaten/Farbe
- `403 Forbidden`: User ist kein Gruppenmitglied
- `404 Not Found`: Gruppe existiert nicht

---

## 🎮 PixelWar Endpoints

### 1. Season erstellen

```http
POST /api/pixelwar/seasons
```

**Request Body**:
```json
{
  "name": "Winter Championship 2026",
  "description": "First pixel war season",
  "mode": "territory_control",
  "startDate": "2026-02-01T00:00:00.000Z",
  "endDate": "2026-03-01T00:00:00.000Z",
  "gridWidth": 200,
  "gridHeight": 200
}
```

**Modes**:
- `territory_control`: Pixel-Besitz zählt
- `xp_battle`: Nur XP zählt
- `hybrid`: Beides kombiniert

**Response** (201 Created):
```json
{
  "_id": "season123",
  "name": "Winter Championship 2026",
  "mode": "territory_control",
  "status": "upcoming",
  "participatingGroups": [],
  "leaderboard": [],
  "gridWidth": 200,
  "gridHeight": 200
}
```

---

### 2. Aktive Season abrufen

```http
GET /api/pixelwar/seasons/active
```

**Response** (200 OK): Season Object

**Errors**:
- `404 Not Found`: Keine aktive Season

---

### 3. Season nach ID

```http
GET /api/pixelwar/seasons/:seasonId
```

---

### 4. Season beitreten

```http
POST /api/pixelwar/seasons/:seasonId/join
```

**Request Body**:
```json
{
  "groupId": "group123"
}
```

---

### 5. PixelBoard abrufen

```http
GET /api/pixelwar/seasons/:seasonId/board
```

**Response** (200 OK):
```json
{
  "_id": "board123",
  "seasonId": "season123",
  "gridWidth": 200,
  "gridHeight": 200,
  "pixels": [
    {
      "x": 10,
      "y": 15,
      "color": "#FF6B6B",
      "groupId": "group123",
      "lastUpdatedBy": "auth0|123",
      "lastUpdatedAt": "2026-01-24T10:00:00.000Z",
      "conquestCount": 1
    }
  ]
}
```

---

### 6. Pixel setzen

```http
POST /api/pixelwar/seasons/:seasonId/pixels
```

**Request Body**:
```json
{
  "groupId": "group123",
  "userId": "auth0|123",
  "coordinates": [
    { "x": 10, "y": 15 },
    { "x": 11, "y": 15 }
  ]
}
```

**Logic**:
- User muss Mitglied der Gruppe sein
- Season muss aktiv sein
- Prüft Cooldown und tägliche Limits
- Updated Leaderboard automatisch

---

### 7. Leaderboard abrufen

```http
GET /api/pixelwar/seasons/:seasonId/leaderboard
```

**Response** (200 OK):
```json
[
  {
    "groupId": "group123",
    "groupName": "Team Awesome",
    "score": 1500,
    "pixelCount": 250
  }
]
```

---

### 8. Season beenden

```http
POST /api/pixelwar/seasons/:seasonId/complete
```

**Response** (200 OK): Updated Season mit `status: "completed"`

---

## ⚔️ Battle Endpoints (Pixel Wars 1v1)

Battles sind 1v1 Duelle zwischen zwei Gruppen auf einem geteilten Canvas.

### 1. Challenge erstellen

```http
POST /api/pixelwar/battles
```

**Request Body**:
```json
{
  "challengerGroupId": "group123",
  "opponentGroupId": "group456",
  "challengerUserId": "auth0|123",
  "name": "Epic Battle",
  "settings": {
    "duration": 1440,
    "gridSize": 50,
    "winCondition": "pixels"
  }
}
```

**Settings**:
- `duration`: Dauer in Minuten (60-10080)
- `gridSize`: Canvas-Größe (20-200)
- `winCondition`: `pixels` | `xp` | `hybrid`

**Response** (201 Created):
```json
{
  "_id": "battle123",
  "name": "Epic Battle",
  "challenger": {
    "groupId": "group123",
    "groupName": "Team A",
    "color": "#FF6B6B",
    "pixelsOwned": 0,
    "totalXP": 0
  },
  "opponent": {
    "groupId": "group456",
    "groupName": "Team B",
    "color": "#4ECDC4",
    "pixelsOwned": 0,
    "totalXP": 0
  },
  "status": "pending",
  "settings": {...}
}
```

---

### 2. Battles eines Users abrufen

```http
GET /api/pixelwar/battles?userId=auth0|123
```

**Response** (200 OK): Array von Battles

---

### 3. Aktive Battles

```http
GET /api/pixelwar/battles/active?userId=auth0|123
```

---

### 4. Ausstehende Challenges

```http
GET /api/pixelwar/battles/pending?userId=auth0|123
```

Gibt Challenges zurück, wo Gruppen des Users Opponent sind.

---

### 5. Battle Details

```http
GET /api/pixelwar/battles/:battleId
```

---

### 6. Challenge annehmen

```http
POST /api/pixelwar/battles/:battleId/accept
```

**Request Body**:
```json
{
  "userId": "auth0|456"
}
```

**Logic**:
- Erstellt PixelBoard für das Battle
- Setzt Status auf `active`
- Berechnet `endDate` basierend auf `duration`

---

### 7. Challenge ablehnen

```http
POST /api/pixelwar/battles/:battleId/decline
```

**Request Body**:
```json
{
  "userId": "auth0|456"
}
```

---

### 8. Challenge abbrechen

```http
POST /api/pixelwar/battles/:battleId/cancel
```

Nur vom Challenger vor Accept möglich.

---

### 9. Aufgeben (Surrender)

```http
POST /api/pixelwar/battles/:battleId/surrender
```

**Request Body**:
```json
{
  "groupId": "group123",
  "userId": "auth0|123"
}
```

---

### 10. Battle PixelBoard abrufen

```http
GET /api/pixelwar/battles/:battleId/board
```

**Response** (200 OK):
```json
{
  "_id": "board456",
  "gridWidth": 50,
  "gridHeight": 50,
  "pixels": [
    {
      "x": 10,
      "y": 15,
      "color": "#FF6B6B",
      "groupId": "group123",
      "conquestCount": 3
    }
  ]
}
```

---

### 11. Pixel im Battle setzen

```http
POST /api/pixelwar/battles/:battleId/pixels
```

**Request Body**:
```json
{
  "groupId": "group123",
  "userId": "auth0|123",
  "coordinates": [
    { "x": 10, "y": 15 },
    { "x": 11, "y": 15 }
  ]
}
```

**Logic**:
- Battle muss aktiv sein
- User muss Mitglied der Gruppe sein
- Pixel können überschrieben werden (wenn `allowOverwrite: true`)

---

### 12. Live-Score abrufen

```http
GET /api/pixelwar/battles/:battleId/score
```

**Response** (200 OK):
```json
{
  "challenger": {
    "pixels": 150,
    "xp": 2010,
    "percentage": 45.5
  },
  "opponent": {
    "pixels": 180,
    "xp": 1870,
    "percentage": 54.5
  },
  "timeRemaining": 3600,
  "status": "active"
}
```

---

### 13. Battle manuell beenden

```http
POST /api/pixelwar/battles/:battleId/end
```

**Response** (200 OK): Battle mit `status: "completed"` und `winnerId`

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "error": {
    "message": "Resource not found",
    "statusCode": 404,
    "details": "User with auth0Id 'auth0|invalid' not found"
  }
}
```

### HTTP Status Codes

| Code | Bedeutung | Beispiel |
|------|-----------|----------|
| **200** | OK | GET erfolgreich |
| **201** | Created | POST erfolgreich, Resource erstellt |
| **400** | Bad Request | Validation Error, fehlende Parameter |
| **401** | Unauthorized | Kein/ungültiger Auth Token |
| **403** | Forbidden | Keine Berechtigung |
| **404** | Not Found | Resource existiert nicht |
| **409** | Conflict | Resource existiert bereits (z.B. duplicate User) |
| **500** | Internal Server Error | Server-Fehler |

### Validation Errors

```json
{
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": {
      "email": "Email ist erforderlich",
      "auth0Id": "auth0Id muss mit 'auth0|' beginnen"
    }
  }
}
```

---

## 📊 Rate Limiting

Aktuell **keine Rate Limits** implementiert.

**Geplant** (für Production):
- 100 Requests / Minute pro IP
- 1000 Requests / Stunde pro User

---

## 🧪 API Testing

### Postman Collection

[Falls vorhanden: Link zu Postman Collection]

### Beispiel cURL

```bash
# User abrufen
curl -X GET http://localhost:3000/api/user/auth0|123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Workout erstellen
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "auth0Id": "auth0|123",
    "name": "Full Body Workout",
    "description": "Ganzkörper-Training"
  }'

# Exercises abrufen (ungeschützt)
curl -X GET http://localhost:3000/api/exercises
```

---

## 🔄 Changelog

| Version | Datum | Änderungen |
|---------|-------|-----------|
| **1.3** | 2026-01-30 | Gruppen-Canvas Feature (Pixel Art pro Battle-Sieg) |
| **1.2** | 2026-01-29 | CRUD-Operationen für Habits/Workouts/Entries, Gruppen-XP |
| **1.1** | 2026-01-25 | Pixel Wars Battle Endpoints hinzugefügt (1v1 Duelle) |
| **1.0** | 2026-01-24 | Initial API Release |

---

**Letzte Aktualisierung**: 2026-01-30

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu Architektur & Design →](04-Architektur-Design.md)
