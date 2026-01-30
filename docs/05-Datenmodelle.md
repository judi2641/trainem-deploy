# 05 - Datenmodelle

[← Zurück zum Wiki](../WIKI.md)

---

## 📊 Übersicht

Trainem nutzt **MongoDB** mit **Mongoose ODM** für die Datenpersistenz. Alle Models befinden sich in `/backend/src/endpoints/*/Model.ts`.

---

## 👤 User Model

**Datei**: `backend/src/endpoints/users/UserModel.ts`

```typescript
{
  email: String (required, unique)
  auth0Id: String (required, unique)
  firstName: String
  lastName: String
  birthDate: Date
  gender: String
  img: String  // Avatar URL
  
  // Gamification
  points: Number (default: 0)
  streak: Number (default: 0)
  lastActiveDate: Date
  
  // Pixel-Art
  pixels: [{ x: Number, y: Number, color: String }]
  canvas: {
    width: Number (default: 32)
    height: Number (default: 32)
    pixels: [Pixel]
  }
  
  onboardingCompleted: Boolean (default: false)
  
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indizes**:
- `auth0Id` (unique)
- `email` (unique)

---

## 💪 Workout Model

**Datei**: `backend/src/endpoints/workouts/WorkoutModel.ts`

```typescript
{
  auth0Id: String (required, indexed)
  name: String (required)
  description: String
  exercises: [{
    exercise: {
      name: String (required)
      type: 'strength' | 'cardio'
      primaryMuscleGroups: [String]
      executionInstructions: String
      videoUrl: String
      imageUrl: String
    }
    sets: Number
    reps: Number
    duration: Number  // in Sekunden
    weight: Number    // in kg
  }]
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Beispiel-Dokument**:
```json
{
  "_id": "6789abc...",
  "auth0Id": "auth0|123",
  "name": "Leg Day",
  "description": "Beintraining",
  "exercises": [
    {
      "exercise": {
        "name": "Squats",
        "type": "strength",
        "primaryMuscleGroups": ["legs", "glutes"]
      },
      "sets": 4,
      "reps": 12,
      "weight": 80
    }
  ]
}
```

---

## 🎯 Habit Model

**Datei**: `backend/src/endpoints/habits/HabitModel.ts`

```typescript
{
  auth0Id: String (required, indexed)
  name: String (required)
  type: 'daily' | 'weekly' (required)
  weekday: Number  // 0-6, nur bei type='weekly'
  description: String
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Validation**:
- `weekday` nur gesetzt wenn `type === 'weekly'`
- `weekday` 0 = Sonntag, 1 = Montag, ..., 6 = Samstag

---

## 📝 Entry Model

**Datei**: `backend/src/endpoints/entries/EntryModel.ts`

```typescript
{
  auth0Id: String (required, indexed)
  date: Date (required, default: Date.now)
  
  // Workout Entry
  workoutId: ObjectId (ref: 'Workout')
  plannedExercises: [WorkoutExercise]
  completed_exercises: [WorkoutExercise]
  
  // Habit Entry
  habitId: ObjectId (ref: 'Habit')
  
  completed: Boolean (default: false)
  score: Number (default: 0)  // Verdiente XP
  
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Entry-Lifecycle**:
1. Start: `plannedExercises` voll, `completed_exercises` leer
2. Complete Exercise: Exercise wandert von `planned` zu `completed`, `score` += 67
3. Fertig: `plannedExercises` leer, `completed` = true

---

## 🏋️ Exercise Model

**Datei**: `backend/src/endpoints/exercises/ExerciseModel.ts`

```typescript
{
  name: String (required, unique)
  type: 'strength' | 'cardio' (required)
  primaryMuscleGroups: [String]
  executionInstructions: String
  videoUrl: String  // YouTube Link
  imageUrl: String
}
```

**Kategorien**:
- **Legs & Glutes**: Squats, Lunges, Glute Bridges, ...
- **Core**: Plank, Crunches, Russian Twists, ...
- **Chest/Shoulders/Triceps**: Push-Ups, Dips, ...
- **Back/Biceps**: Rows, Pull-Ups, Superman, ...
- **Full Body Cardio**: Burpees, Jumping Jacks, ...

**Anzahl**: 50+ vordefinierte Übungen

---

## 🎨 PixelArt Model

**Datei**: `backend/src/endpoints/pixelArt/PixelArtModel.ts`

```typescript
{
  auth0ID: String (required, unique)
  gridSize: Number (required, min: 1, max: 128)
  pixels: [{
    x: Number (required, min: 0)
    y: Number (required, min: 0)
    color: String (required, pattern: /^#[0-9A-F]{6}$/i)
  }]
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Validation**:
- `gridSize`: 1-128
- `color`: Hex-Format (#RRGGBB)
- `x, y`: Innerhalb gridSize

---

## 👥 Group Model

**Datei**: `backend/src/endpoints/groups/GroupModel.ts`

```typescript
{
  name: String (required)
  description: String
  color: String (required, hex)
  ownerId: String (required)  // auth0Id des Owners
  isPublic: Boolean (default: true)
  maxMembers: Number (default: 50)

  members: [{
    userId: String (required)
    role: 'owner' | 'admin' | 'member'
    joinedAt: Date
    contributedXP: Number (default: 0)
  }]

  totalXP: Number (default: 0)
  currentSeasonXP: Number (default: 0)

  // Battle Statistiken
  wins: Number (default: 0)
  losses: Number (default: 0)
  unlockedPixels: Number (default: 0)  // +1 pro Battle-Sieg

  // Gruppen-Canvas (Pixel Art)
  pixelArt: {
    gridSize: Number (default: 16)
    pixels: [{
      x: Number (required)
      y: Number (required)
      color: String (required, hex)
      placedBy: String  // auth0Id
      placedAt: Date
    }]
  }

  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Gruppen-Canvas Logik**:
- Pro Battle-Sieg erhält die Gruppe +1 `unlockedPixels`
- Mitglieder können Pixel auf dem Gruppen-Canvas platzieren (solange `availablePixels > 0`)
- `availablePixels = unlockedPixels - usedPixels`

---

## ⚔️ Battle Model (Pixel Wars 1v1)

**Datei**: `backend/src/endpoints/pixelwar/BattleModel.ts`

```typescript
{
  name: String
  description: String

  challenger: {
    groupId: ObjectId (required)
    groupName: String
    color: String
    pixelsOwned: Number (default: 0)
    totalXP: Number (default: 0)
    members: [{ userId: String, contributedXP: Number, pixelsPlaced: Number }]
  }

  opponent: {
    groupId: ObjectId (required)
    groupName: String
    color: String
    pixelsOwned: Number (default: 0)
    totalXP: Number (default: 0)
    members: [...]
  }

  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined' | 'cancelled'

  // Zeitsteuerung
  challengedAt: Date (auto)
  acceptedAt: Date
  startDate: Date
  endDate: Date

  // Einstellungen
  settings: {
    duration: Number (Minuten, 60-10080)
    gridSize: Number (20-200)
    winCondition: 'pixels' | 'xp' | 'hybrid'
    xpPerPixel: Number (default: 10)
    allowOverwrite: Boolean (default: true)
  }

  winnerId: ObjectId
  pixelBoardId: ObjectId (ref: PixelBoard)
}
```

---

## 🔗 Beziehungen (ER-Diagramm)

```
User
├── 1:N → Workouts (via auth0Id)
├── 1:N → Habits (via auth0Id)
├── 1:N → Entries (via auth0Id)
├── 1:1 → PixelArt (via auth0ID)
└── N:N → Groups (via members[].userId)

Entry
├── N:1 → Workout (via workoutId)
└── N:1 → Habit (via habitId)

Workout
└── N:N → Exercises (embedded, nicht referenziert)

Group
├── 1:N → Members (embedded)
└── N:N → Battles (via challenger/opponent.groupId)

Battle
├── N:1 → Challenger Group
├── N:1 → Opponent Group
└── 1:1 → PixelBoard
```

**Embedded vs. Referenced**:
- **Embedded**: Exercises in Workout (schneller Zugriff, keine Joins)
- **Referenced**: Workout/Habit in Entry (Flexibilität, Normalisierung)

---

## 📋 Indizes

| Collection | Index | Type | Zweck |
|------------|-------|------|-------|
| users | auth0Id | unique | User-Lookup |
| users | email | unique | Duplikat-Prävention |
| workouts | auth0Id | standard | User-Workouts laden |
| habits | auth0Id | standard | User-Habits laden |
| entries | auth0Id | standard | User-Entries laden |
| entries | date | standard | Zeitbasierte Queries |
| exercises | name | unique | Duplikat-Prävention |
| pixelart | auth0ID | unique | User-Avatar laden |

---

## 🗄️ Datenbankgröße (Schätzung)

**Annahmen**: 1000 User, je 5 Workouts, 10 Habits, 100 Entries

| Collection | Docs | Avg. Size | Total |
|------------|------|-----------|-------|
| users | 1000 | 2 KB | 2 MB |
| workouts | 5000 | 1 KB | 5 MB |
| habits | 10000 | 0.5 KB | 5 MB |
| entries | 100000 | 1 KB | 100 MB |
| exercises | 50 | 0.5 KB | 25 KB |
| pixelart | 1000 | 10 KB | 10 MB |
| **Total** | - | - | **~122 MB** |

---

**Letzte Aktualisierung**: 2026-01-30

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu Frontend-Struktur →](06-Frontend-Struktur.md)
