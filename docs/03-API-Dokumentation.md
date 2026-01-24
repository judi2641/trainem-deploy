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
  "exercise": {
    "name": "Push-Ups",
    "type": "strength",
    "primaryMuscleGroups": ["chest", "triceps"],
    "executionInstructions": "...",
    "videoUrl": "https://youtube.com/..."
  },
  "sets": 3,
  "reps": 15,
  "weight": 0,
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
| **1.0** | 2026-01-24 | Initial API Release |

---

**Letzte Aktualisierung**: 2026-01-24

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu Architektur & Design →](04-Architektur-Design.md)
