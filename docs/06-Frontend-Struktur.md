# 06 - Frontend-Struktur

[← Zurück zum Wiki](../WIKI.md)

---

## ⚛️ Technologie-Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7  
- **Router**: React Router DOM 7.9.5
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Styling**: Tailwind CSS 4.1.16
- **Charts**: Recharts 2.15.4
- **State**: React Context API
- **Auth**: Auth0 React 2.8.0 (Dev: MockAuth0Provider)

---

## 📁 Ordnerstruktur

```
frontend/src/
├── components/
│   ├── ui/                    # 40+ shadcn/ui Components
│   ├── dashboardkacheln/     # Dashboard Widgets
│   ├── statistiken/          # Charts & Analytics
│   ├── trainingsplan/        # Workout Components
│   ├── pixel/                # Pixel-Art Components
│   ├── groups/              # Groups Components
│   │   ├── GroupList.tsx
│   │   └── CreateGroupModal.tsx
│   ├── pixelwar/            # Pixel Wars Components
│   │   ├── PixelWarsArea.tsx
│   │   ├── PixelBoard.tsx
│   │   └── battles/
│   │       ├── BattleList.tsx
│   │       ├── BattleCard.tsx
│   │       ├── BattleArena.tsx
│   │       ├── ChallengeModal.tsx
│   │       └── PendingChallenges.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── EntryArea.tsx         # Workout Execution
│   ├── WorkoutsArea.tsx
│   ├── HabitsArea.tsx
│   ├── GroupsArea.tsx        # Gruppen-Übersicht
│   └── ...
├── pages/
│   ├── OnboardingSteps/      # 7 Onboarding Steps
│   ├── Dashboard.tsx
│   ├── Workouts.tsx
│   ├── Habits.tsx
│   ├── Statistics.tsx
│   ├── PixelArt.tsx
│   ├── Calendar.tsx
│   ├── Settings.tsx
│   ├── Groups.tsx            # Gruppen-Verwaltung
│   ├── PixelWars.tsx         # Pixel Wars Battles
│   ├── LandingPage.tsx
│   └── Onboarding.tsx
├── context/
│   ├── AppContext.tsx        # Global State
│   └── OnboardingContext.tsx # Onboarding State
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── util/
│   ├── level.ts              # XP → Level Calculation
│   ├── statsHelpers.ts       # Streak, Stats, etc.
│   ├── theme.ts              # Dark/Light Mode
│   └── stringToColor.tsx
├── lib/                       # Utilities
├── App.tsx                    # Router & Routes
├── main.tsx                   # Entry Point
└── MockAuth0Provider.tsx      # Dev Auth Mock
```

---

## 🧩 Komponenten-Übersicht

### Dashboard-Kacheln

| Komponente | Beschreibung |
|------------|--------------|
| `PixelCharacter` | Zeigt Pixel-Avatar mit Level & XP-Progress |
| `QuickStats` | Streak, Total XP, Level |
| `UpcomingWorkouts` | Liste nächster geplanter Workouts |
| `ActiveWorkout` | Aktuell laufendes Workout |
| `WeeklyProgress` | Workouts diese Woche |
| `RecentActivity` | Letzte abgeschlossene Entries |

### Statistiken

| Komponente | Chart-Type |
|------------|-----------|
| `XPProgressChart` | Line Chart (XP over Time) |
| `PlanCompletionChart` | Pie Chart (Completed vs. Incomplete) |
| `WeekdayPerformanceChart` | Bar Chart (Workouts per Weekday) |
| `DifficultyDistributionChart` | Pie Chart |
| `PerformanceOverview` | Card with Stats |

### shadcn/ui Components

**40+ Components** (Copy-Paste Library):
- Button, Input, Card, Dialog, Dropdown, Select, Checkbox, Switch
- Calendar, DatePicker, Table, Tabs, Toast, Tooltip, Progress
- Avatar, Badge, Alert, Separator, Skeleton, Slider, etc.

**Location**: `frontend/src/components/ui/`

---

## 🗺️ Routing

### Route-Struktur

```typescript
// App.tsx
<Routes>
  {/* Public */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/callback" element={<Callback />} />
  
  {/* Protected */}
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
  <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
  <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
  <Route path="/pixel-art" element={<ProtectedRoute><PixelArt /></ProtectedRoute>} />
  <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
  <Route path="/pixel-wars" element={<ProtectedRoute><PixelWars /></ProtectedRoute>} />
  
  {/* Onboarding (Nested Routes) */}
  <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>}>
    <Route index element={<Landing />} />
    <Route path="basic" element={<BasicInfo />} />
    <Route path="experience" element={<Experience />} />
    <Route path="goals" element={<Goals />} />
    <Route path="schedule" element={<Schedule />} />
    <Route path="CharacterColor" element={<CharacterColor />} />
    <Route path="intro" element={<Intro />} />
  </Route>
</Routes>
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
```

---

## 🌍 State Management

### AppContext (Global State)

```typescript
// AppContext.tsx
const AppContext = createContext({
  // User
  user: User | null,
  setUser: (user: User) => void,
  
  // Workouts
  workouts: Workout[],
  setWorkouts: (workouts: Workout[]) => void,
  
  // Entries
  entries: Entry[],
  setEntries: (entries: Entry[]) => void,
  
  // Habits
  habits: Habit[],
  setHabits: (habits: Habit[]) => void,
  
  // PixelArt
  pixelArt: PixelArt | null,
  setPixelArt: (pixelArt: PixelArt) => void,
});

// Usage
const { user, setUser } = useMyContext();
```

### OnboardingContext

Sammelt Daten während Onboarding:
- `userData`: { firstname, lastname, birthDate, gender, img }
- `planData`: { goal, experience, trainingDays, weight, height }
- `submitUserData()`: POST /api/user/:id/basic
- `submitPlanData()`: POST /api/trainingsplan/:id

---

## 🎨 Styling

### Tailwind CSS

**Config**: `tailwind.config.js`

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
```

### Theme System

```typescript
// util/theme.ts
export const loadStoredInvertTheme = () => {
  const inverted = localStorage.getItem('theme-inverted') === 'true';
  if (inverted) {
    document.documentElement.classList.add('dark');
  }
};

// Toggle in Settings
const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme-inverted', isDark.toString());
};
```

---

## 📊 Utility Functions

### Level Calculation

```typescript
// util/level.ts
export function getLevelFromScore(score: number): number {
  if (score < 100) return 1;
  return Math.floor((score - 100) / 10) + 1;
}

// Level 1 = 0-99 XP
// Level 2 = 100-109 XP  
// Level 3 = 110-119 XP
// ...
```

### Stats Helpers

```typescript
// util/statsHelpers.ts
export const calculateStreak = (entries: Entry[]): number => {
  // Berechnet aufeinanderfolgende Trainingstage
};

export const getWeeklyXP = (entries: Entry[]): number => {
  // Summiert XP der letzten 7 Tage
};
```

---

## 🔧 Hooks

### use-mobile

```typescript
// hooks/use-mobile.tsx
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}
```

### use-toast

```typescript
// hooks/use-toast.ts
export const useToast = () => {
  const { toast } = useSonner();
  
  const showSuccess = (message: string) => {
    toast.success(message);
  };
  
  const showError = (message: string) => {
    toast.error(message);
  };
  
  return { showSuccess, showError };
};
```

---

**Letzte Aktualisierung**: 2026-01-29

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu User-Dokumentation →](07-User-Dokumentation.md)
