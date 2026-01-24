# 09 - Testing

[← Zurück zum Wiki](../WIKI.md)

---

## 🧪 Test-Setup

### Backend (Jest)

**Framework**: Jest 29.7.0
**Config**: `backend/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
};
```

### Frontend (Geplant)

**Framework**: Vitest + React Testing Library
**Status**: Noch nicht implementiert

---

## 🔬 Backend Tests

### Test-Struktur

```
backend/__tests__/
├── user.test.ts
├── workout.test.ts
├── entry.test.ts
└── habit.test.ts
```

### Beispiel: User Tests

```typescript
// __tests__/user.test.ts
import { UserService } from '../src/endpoints/users/UserService';

describe('UserService', () => {
  it('should create user', async () => {
    const user = await UserService.createInitialUser({
      email: 'test@test.com',
      auth0Id: 'auth0|123'
    });
    
    expect(user.email).toBe('test@test.com');
    expect(user.points).toBe(0);
    expect(user.streak).toBe(0);
  });
  
  it('should not create duplicate user', async () => {
    await expect(
      UserService.createInitialUser({
        email: 'test@test.com',
        auth0Id: 'auth0|123'
      })
    ).rejects.toThrow();
  });
});
```

### Tests ausführen

```bash
cd backend
npm test              # Alle Tests
npm test -- --watch   # Watch Mode
npm test -- --coverage # Code Coverage
```

---

## 📊 Code Coverage

**Aktuell**: ~30% (nur wenige Tests vorhanden)
**Ziel**: >80%

```bash
# Coverage Report generieren
cd backend
npm test -- --coverage
```

**Output**:
```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
All files           |   32.5  |    18.2  |   28.3  |   31.8
 UserService.ts     |   85.7  |    75.0  |   80.0  |   84.6
 WorkoutService.ts  |   42.1  |    25.0  |   40.0  |   41.9
 EntryService.ts    |   15.3  |     5.2  |   12.5  |   14.8
```

---

## 🐛 Known Issues

### Kritische Bugs

**Keine kritischen Bugs bekannt** (Stand: 2026-01-24)

### Minor Bugs

1. **Streak-Reset bei Zeitumstellung**
   - Status: Open
   - Priorität: Low
   - Fix geplant: Version 1.1

2. **Pixel-Art: Langsames Rendering bei großen Grids**
   - Status: Open
   - Priorität: Medium
   - Workaround: Grid-Size max. 64x64

### Technische Schulden (Tech Debt)

1. **Fehlende Frontend-Tests**
   - Impact: Hoch
   - Aufwand: Hoch
   - Geplant: Nach MVP-Launch

2. **Keine Error Boundaries in React**
   - Impact: Medium
   - Aufwand: Niedrig
   - Geplant: Version 1.1

3. **Keine Rate Limiting im Backend**
   - Impact: Hoch (Production)
   - Aufwand: Niedrig
   - Geplant: Vor Production-Launch

4. **MongoDB Indizes nicht optimiert**
   - Impact: Medium
   - Aufwand: Niedrig
   - Geplant: Version 1.1

5. **Auth0 Callback-Handling fehleranfällig**
   - Impact: Hoch
   - Aufwand: Medium
   - Workaround: MockAuth0Provider im Dev-Mode
   - Fix: Auth0 Dashboard konfigurieren

---

## 📝 Test-Checkliste

### Vor jedem Commit

- [ ] `npm run lint` ohne Fehler
- [ ] Backend: `npm test` erfolgreich
- [ ] Frontend: Build erfolgreich (`npm run build`)
- [ ] Manuelle Tests: Core-Features funktionieren

### Vor Merge Request

- [ ] Alle Tests erfolgreich
- [ ] Code Coverage >= 30%
- [ ] Keine ESLint Warnings
- [ ] Manuelle Tests auf Dev-Umgebung

### Vor Production Deploy

- [ ] Alle Tests erfolgreich
- [ ] E2E Tests (manuell)
- [ ] Auth0 Production konfiguriert
- [ ] MongoDB Atlas bereit
- [ ] Monitoring aktiviert

---

## 🔄 Test-Automatisierung (GitLab CI)

Siehe [08-Deployment.md](08-Deployment.md#cicd-mit-gitlab-ci)

**Tests laufen automatisch**:
- Bei jedem Commit auf `main`
- Bei jedem Merge Request

---

## 🚀 Zukünftige Tests

### Geplant für Version 1.1

**Backend**:
- [ ] Integration Tests mit Test-Datenbank
- [ ] API-Endpoint Tests (Supertest)
- [ ] Auth0 Mock-Tests

**Frontend**:
- [ ] Component Tests (React Testing Library)
- [ ] Hook Tests (@testing-library/react-hooks)
- [ ] Integration Tests (Cypress/Playwright)

**E2E**:
- [ ] User-Flow Tests (Onboarding → Workout → Stats)
- [ ] Cross-Browser Tests

---

**Letzte Aktualisierung**: 2026-01-24

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu Prozess & Meilensteine →](10-Prozess-Meilensteine.md)
