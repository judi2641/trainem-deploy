# 04 - Architektur & Design

[← Zurück zum Wiki](../WIKI.md)

---

## 🏛️ Systemarchitektur

### MERN-Stack Architektur

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
```

### Component-Übersicht

| Layer | Technologie | Verantwortung |
|-------|-------------|---------------|
| **Frontend** | React 19 + Vite | UI/UX, State Management, Routing |
| **Backend** | Express.js 5 | REST API, Business Logic, Validation |
| **Database** | MongoDB 8 | Data Persistence |
| **Auth** | Auth0 | User Authentication & Authorization |
| **Build** | TypeScript 5.9 | Type Safety, Compilation |

---

## 🔧 Backend-Pattern

### MVC-ähnliche Struktur

```
endpoints/users/
├── UserModel.ts      # Mongoose Schema (Data Layer)
├── UserService.ts    # Business Logic (Service Layer)
└── UserRoute.ts      # Express Routes (Controller Layer)
```

### Datenfluss (Request → Response)

```
1. Client Request (React)
   ↓
2. Express Route (/api/user/:id)
   ↓
3. Auth0 JWT Middleware (checkAuth0Token)
   ↓
4. Service Layer (UserService.getUserByAuth0id)
   ↓
5. Mongoose Model (UserModel.findOne)
   ↓
6. MongoDB Query
   ↓
7. Service Response
   ↓
8. Express Response (JSON)
   ↓
9. Client State Update (Context API)
```

### Error Handling

```typescript
// Custom Error Class
class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Usage in Service
if (!user) {
  throw new HttpError('User not found', 404);
}

// Global Error Handler (Express Middleware)
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.statusCode || 500).json({
    error: { message: err.message, statusCode: err.statusCode }
  });
});
```

---

## ⚛️ Frontend-Pattern

### Context API für Global State

```typescript
// AppContext.tsx
const AppContext = createContext({
  user: null,
  workouts: [],
  entries: [],
  habits: [],
  pixelArt: null,
  setUser: () => {},
  setWorkouts: () => {},
  // ...
});

// Usage in Component
const { user, setUser } = useMyContext();
```

### Protected Routes

```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// App.tsx
<Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
```

### Component-Hierarchie

```
App.tsx (Router)
├── LandingPage (Public)
├── Onboarding (Protected)
│   ├── Landing
│   ├── BasicInfo
│   ├── Experience
│   ├── Goals
│   ├── Schedule
│   └── CharacterColor
├── Dashboard (Protected)
│   ├── Header + Sidebar
│   └── DashboardKacheln
│       ├── PixelCharacter
│       ├── QuickStats
│       ├── UpcomingWorkouts
│       └── WeeklyProgress
├── Workouts (Protected)
├── Habits (Protected)
└── Statistics (Protected)
```

---

## 🔐 Auth Flow

### 1. Registration & Login

```
User → Auth0 Universal Login → JWT Token → Frontend
  ↓
POST /api/user (create initial user in MongoDB)
  ↓
Onboarding Flow (7 Steps)
  ↓
POST /api/user/:auth0Id/basic (save onboarding data)
  ↓
Redirect to /dashboard
```

### 2. Token Validation (Backend)

```typescript
// checkAuth0Token.ts (Middleware)
import { auth } from 'express-oauth2-jwt-bearer';

export const checkJwt = auth({
  audience: 'https://trainem.authentication',
  issuerBaseURL: 'https://dev-wmcuuu42i1iqwc5e.us.auth0.com',
});

// Usage in Route
router.get('/api/user/:auth0Id', checkJwt, UserService.getUserByAuth0id);
```

### 3. Dev Mode: Mock Auth

```typescript
// MockAuth0Provider.tsx
export const MockAuth0Provider = ({ children }) => {
  const mockValue = {
    isAuthenticated: true,
    user: {
      sub: 'mock-user-123',
      name: 'Test User',
      email: 'test@example.com'
    },
    getAccessTokenSilently: async () => 'mock-token'
  };
  return <MockAuth0Context.Provider value={mockValue}>{children}</MockAuth0Context.Provider>;
};
```

---

## 🎮 Gamification Flow

### XP-System

```
User completes Exercise → +67 XP
User completes Habit → +10 XP
  ↓
User.points updated in MongoDB
  ↓
Frontend calculates Level from points
  ↓
Level = Math.floor((points - 100) / 10) + 1
  ↓
Display in PixelCharacter Component
```

### Entry Lifecycle

```
1. User startet Workout
   POST /api/entries { workoutId, plannedExercises }

2. User completed Übung
   PATCH /api/entries/:id/complete-exercise { exerciseName }
   → Übung von planned → completed
   → Entry.score += 67
   → User.points += 67

3. Alle Übungen completed
   → Entry.completed = true
   → Streak +1 (falls heute noch nicht trainiert)

4. User bricht ab
   PATCH /api/entries/:id/abort
   → Entry bleibt incomplete, aber verdiente XP bleiben
```

---

## 🎨 Design-Entscheidungen

### 1. Warum MongoDB statt SQL?

**Pro MongoDB**:
- Flexible Schema für Pixel-Art (Array of {x, y, color})
- Variable Workout-Strukturen (unterschiedliche Anzahl Exercises)
- JSON-ähnliche Daten perfekt für REST API
- Schnelle Prototyping

**Contra**:
- Keine starken Relationen (aber wenige Joins nötig)
- Daten-Integrität manuell sicherstellen

**Entscheidung**: MongoDB passt zu schneller Entwicklung & flexiblen Datenstrukturen

---

### 2. Warum Context API statt Redux?

**Pro Context**:
- Einfacher für kleines Projekt
- Kein Boilerplate (Actions, Reducers, etc.)
- React-native

**Contra**:
- Keine Dev Tools
- Bei vielen Updates langsamer

**Entscheidung**: Für Trainem (< 10 State-Slices) ausreichend

---

### 3. Warum shadcn/ui statt Material-UI?

**Pro shadcn**:
- Tailwind CSS Integration
- Copy-Paste → volle Kontrolle über Code
- Modern Design (nicht "Material Look")
- Kleineres Bundle (nur importierte Components)

**Contra**:
- Weniger fertige Components
- Mehr manuelle Arbeit

**Entscheidung**: Design-Flexibilität wichtiger als Geschwindigkeit

---

### 4. Warum TypeScript?

**Pro TypeScript**:
- Type Safety (weniger Bugs)
- Shared Types (Frontend ↔ Backend)
- Bessere IDE-Support
- Dokumentation im Code

**Contra**:
- Learning Curve
- Mehr Setup

**Entscheidung**: Langfristig weniger Bugs wichtiger als schnelle Entwicklung

---

## 📊 Datenfluss-Diagramme

### Workout-Ausführung

```
[User klickt "Start Workout"]
        ↓
[POST /api/entries]
        ↓
[Entry mit plannedExercises erstellt]
        ↓
[User sieht EntryArea mit Exercise-Liste]
        ↓
[User klickt "Complete" bei Exercise]
        ↓
[PATCH /api/entries/:id/complete-exercise]
        ↓
[Exercise → completed_exercises, +67 XP]
        ↓
[Frontend aktualisiert Entry & User.points]
        ↓
[PixelCharacter zeigt neues Level]
```

### Onboarding-Flow

```
[New User registriert via Auth0]
        ↓
[POST /api/user (initial user)]
        ↓
[Redirect to /onboarding]
        ↓
[7 Schritte: Landing → Intro → BasicInfo → Experience → Goals → Schedule → Color]
        ↓
[POST /api/user/:id/basic (save data)]
        ↓
[POST /api/trainingsplan/:id (create plan)]
        ↓
[user.onboardingCompleted = true]
        ↓
[Redirect to /dashboard]
```

---

## 🧪 Testing-Architektur

### Backend Tests (Jest)

```
__tests__/
├── user.test.ts
├── workout.test.ts
└── entry.test.ts

// Beispiel
describe('UserService', () => {
  it('should create user', async () => {
    const user = await UserService.createInitialUser({
      email: 'test@test.com',
      auth0Id: 'auth0|123'
    });
    expect(user.email).toBe('test@test.com');
  });
});
```

### Frontend Tests

**Aktuell**: Keine Tests
**Geplant**: React Testing Library + Vitest

---

## 📦 Deployment-Architektur

### Development

```
Local Machine
├── MongoDB Docker Container (Port 27017)
├── Backend (Port 3000) - nodemon
└── Frontend (Port 5173) - vite dev server
```

### Production (geplant)

```
[Cloud Provider]
├── Frontend (Vercel/Netlify)
│   └── Static React Build
├── Backend (Heroku/Railway)
│   └── Node.js Server
└── Database (MongoDB Atlas)
    └── Cloud MongoDB Cluster
```

---

**Letzte Aktualisierung**: 2026-01-24

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu Datenmodelle →](05-Datenmodelle.md)
