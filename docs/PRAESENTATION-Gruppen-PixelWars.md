# Abschlussprasentation: Gruppen & PixelWars

---

## 1. Ubersicht - Was habe ich gemacht?

Mein Bereich umfasst zwei zusammenhangende Features:

| Feature | Beschreibung |
|---------|-------------|
| **Gruppen** | Komplettes Gruppensystem mit Rollen, Invite-Codes, Pixel-Canvas |
| **PixelWars** | 1v1-Battle-System zwischen Gruppen auf einem gemeinsamen Pixel-Canvas |

**Dateien-Ubersicht:**

### Backend (6 Dateien)
| Datei | Zeilen | Aufgabe |
|-------|--------|---------|
| `GroupModel.ts` | 156 | Mongoose-Schema fur Gruppen |
| `GroupService.ts` | 310 | Business-Logik fur Gruppen |
| `GroupRoute.ts` | 342 | 12 REST-Endpoints fur Gruppen |
| `BattleModel.ts` | 179 | Mongoose-Schema fur Battles |
| `BattleService.ts` | 725 | Business-Logik fur Battles |
| `BattleRoute.ts` | 358 | 13 REST-Endpoints fur Battles |

### Frontend (5 Dateien)
| Datei | Zeilen | Aufgabe |
|-------|--------|---------|
| `GroupsArea.tsx` | 379 | Hauptseite fur Gruppen (My Groups, Public Groups, Join by Code) |
| `GroupDetailModal.tsx` | 429 | Detail-Ansicht einer Gruppe mit Canvas und Members |
| `ChallengeModal.tsx` | 239 | Modal zum Erstellen einer Challenge |
| `BattleArena.tsx` | 468 | Haupt-Kampf-Canvas mit Live-Score |
| `PixelBoard.tsx` | 235 | Season-basiertes Pixel-Board |

### Integration (1 Datei)
| Datei | Zeilen | Aufgabe |
|-------|--------|---------|
| `EntryService.ts` | Zeilen 58-75, 144-162 | Verbindung Training -> PixelWars (XP/Pixel-Vergabe) |

**Gesamt: ca. 3.820 Zeilen Code**

---

## 2. Gruppen-Feature

### 2.1 Datenmodell (GroupModel.ts)

```
Group
  +-- name (String, 3-50 Zeichen)
  +-- description (optional, max 500)
  +-- color (Hex, z.B. #FF5733) --> wird fur Pixel-Farbe in Battles verwendet
  +-- isPublic (Boolean)
  +-- maxMembers (2-100, default 20)
  +-- inviteCode (8-Zeichen Hex, unique, sparse index)
  +-- members[] --> Array von GroupMember
  |     +-- userId (auth0Id)
  |     +-- role ('owner' | 'admin' | 'member')
  |     +-- joinedAt (Date)
  |     +-- contributedXP (Number)
  +-- totalXP, currentSeasonXP
  +-- wins, losses
  +-- unlockedPixels (default: 10)
  +-- pixelArt --> eingebettetes Gruppen-Pixelbild
        +-- gridSize (16x16)
        +-- pixels[] --> { x, y, color, placedBy, placedAt }
```

**Wichtige Design-Entscheidungen:**
- `inviteCode` hat einen **sparse Index** -> nur indiziert wenn vorhanden (spart Speicher)
- `members` ist ein **Array im Dokument** (kein separates Collection) -> schnellere Reads, da alles in einem Dokument
- `pixelArt` ist **eingebettet** -> direkt im Group-Dokument, kein extra Query notig
- Jede Gruppe startet mit **10 freigeschalteten Pixeln** fur den Canvas

### 2.2 Invite-Code System

```typescript
// Generierung: crypto.randomBytes(4) -> 8 Hex-Zeichen
function generateInviteCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}
// Beispiel: "A1B2C3D4"
```

**Flow:**
1. Beim **Erstellen einer Gruppe** wird automatisch ein Code generiert
2. Owner/Admin kann den Code im **GroupDetailModal** sehen und kopieren
3. Andere User klicken "Join by Code" und geben den Code ein
4. `joinGroupByInviteCode()` sucht die Gruppe via Code (case-insensitive mit `.toUpperCase()`)
5. Owner/Admin kann den Code **regenerieren** (alter Code wird ungultig)

**Sicherheit:**
- Nur Owner/Admin sehen den Code
- Nur Owner/Admin konnen regenerieren
- Private Gruppen konnen NUR uber Code betreten werden (nicht uber "Join" Button)
- 8 Hex-Zeichen = 4.294.967.296 mogliche Codes (Brute-Force praktisch unmoglich)

### 2.3 Rollen-System

| Rolle | Darf |
|-------|------|
| **Owner** | Alles + Gruppe loschen |
| **Admin** | Challenges erstellen/annehmen, Invite-Code sehen/regenerieren, Rollen andern |
| **Member** | Beitreten, Pixel setzen, trainieren |

**Einschrankungen:**
- Owner kann Gruppe nicht verlassen (muss loschen)
- Owner-Rolle kann nicht geandert werden
- Nur Owner kann Gruppe loschen

### 2.4 Gruppen-Canvas (Pixel-Art)

Jede Gruppe hat einen eigenen 16x16 Canvas:
- Startet mit **10 freigeschalteten Pixeln**
- Pro **gewonnenem Battle** gibt es **+1 Pixel** dazu
- Alle Mitglieder konnen Pixel setzen
- 9 vordefinierte Farben zur Auswahl
- Uberschreiben eines bestehenden Pixels verbraucht **keinen** neuen Pixel

### 2.5 API-Endpoints (GroupRoute.ts)

| Method | Route | Beschreibung |
|--------|-------|-------------|
| POST | `/api/groups` | Gruppe erstellen |
| GET | `/api/groups/public` | Offentliche Gruppen (paginiert) |
| GET | `/api/groups/user/:userId` | User's Gruppen |
| GET | `/api/groups/:groupId` | Gruppe nach ID |
| POST | `/api/groups/:groupId/join` | Offentlicher Gruppe beitreten |
| POST | `/api/groups/join-by-code` | Per Invite-Code beitreten |
| POST | `/api/groups/:groupId/regenerate-code` | Code neu generieren |
| POST | `/api/groups/:groupId/leave` | Gruppe verlassen |
| DELETE | `/api/groups/:groupId` | Gruppe loschen (nur Owner) |
| PATCH | `/api/groups/:groupId/members/:targetUserId/role` | Rolle andern |
| GET | `/api/groups/:groupId/pixel-art` | Canvas-Info abrufen |
| POST | `/api/groups/:groupId/pixel-art` | Pixel auf Canvas setzen |

**Sicherheits-Features in den Routes:**
- `isValidObjectId()` -> Verhindert MongoDB Injection
- `sanitizeString()` -> Entfernt `<>` Tags (XSS-Schutz)
- `isValidColor()` -> Nur Hex-Farben erlaubt
- Limit-Sanitization bei `getPublicGroups` (max 100, verhindert DoS)

---

## 3. PixelWars-Feature

### 3.1 Datenmodell (BattleModel.ts)

```
Battle
  +-- name ("Team A vs Team B")
  +-- status: 'pending' | 'active' | 'completed' | 'declined' | 'cancelled'
  +-- challenger: BattleParticipant
  |     +-- groupId, groupName, color
  |     +-- pixelsOwned (gesetzte Pixel auf dem Board)
  |     +-- totalXP
  |     +-- members[] --> { userId, contributedXP, pixelsPlaced, pixelsAvailable }
  +-- opponent: BattleParticipant (gleiche Struktur)
  +-- settings:
  |     +-- duration (Minuten: 60, 1440, 10080, 40320)
  |     +-- gridSize (15, 30, 50)
  |     +-- winCondition ('pixels' oder 'xp')
  |     +-- allowOverwrite (Boolean)
  |     +-- xpPerPixel (67)
  +-- winnerId (GroupId)
  +-- pixelBoardId (Referenz zum PixelBoard)
  +-- Timestamps (challengedAt, acceptedAt, startDate, endDate)
```

```
PixelBoard
  +-- seasonId (wird fur battleId genutzt)
  +-- gridWidth, gridHeight
  +-- pixels[]
        +-- x, y, color
        +-- groupId (welche Gruppe den Pixel besitzt)
        +-- lastUpdatedBy (userId)
        +-- conquestCount (wie oft der Pixel erobert wurde)
```

### 3.2 Battle-Lifecycle

```
1. PENDING    --> Challenger erstellt Challenge
       |
       v
2. ACTIVE     --> Opponent akzeptiert (PixelBoard wird erstellt, Timer startet)
       |
       v
3. COMPLETED  --> Timer lauft ab ODER manuelles Ende ODER Aufgabe (Surrender)

Alternative Pfade:
1. PENDING --> DECLINED  (Opponent lehnt ab)
1. PENDING --> CANCELLED (Challenger zieht zuruck)
```

**Akzeptieren einer Challenge (acceptChallenge):**
1. Prüfe ob User Admin/Owner der Opponent-Gruppe ist
2. Erstelle ein neues `PixelBoard` mit der konfigurierten Grid-Grose
3. Setze Status auf `'active'`
4. Berechne `endDate = now + duration * 60 * 1000`
5. Speichere `pixelBoardId` im Battle

### 3.3 Die zwei Spielmodi

Das ist der **Kernmechanismus** - was die beiden Modi unterscheidet:

#### Modus "Workouts" (winCondition: 'pixels')
- **Gewinnkriterium:** Wer mehr Pixel auf dem Board besitzt
- Pixel bekommt man **NUR durch abgeschlossene Ubungen**
- Habits geben zwar XP fur die Gruppe, aber **keine Pixel**
- Der Canvas ist hier das zentrale Element

#### Modus "Workouts + Habits" (winCondition: 'xp')
- **Gewinnkriterium:** Wer mehr Total-XP gesammelt hat
- **Ubungen UND Habits** zahlen beide
- Der Canvas ist hier eher Dekoration - der XP-Vergleich entscheidet

### 3.4 Pixel/XP-Mechanik (addBattleXP - Kernfunktion)

```typescript
static async addBattleXP(battleId, groupId, userId, xp, isExercise = true) {
    // XP wird IMMER addiert (Übungen + Habits)
    participant.totalXP += xp;

    // Pixel NUR für Übungen
    const pixelsEarned = isExercise ? Math.floor(xp / 67) : 0;
    //                                 67 XP pro Übung = 1 Pixel
}
```

**Integration mit EntryService.ts:**

| Aktion | XP | isExercise | Pixel |
|--------|-----|-----------|-------|
| Habit abgeschlossen | 10 | false | 0 |
| Übung abgeschlossen | 67 | true | 1 (= 67/67) |

**Flow: User schliesst eine Ubung ab:**
1. `EntryService.updateEntry()` wird aufgerufen
2. User bekommt 67 Punkte
3. Fur jede Gruppe des Users:
   - `GroupService.addGroupXP()` -> +67 Gruppen-XP
   - Fur jedes aktive Battle der Gruppe:
     - `BattleService.addBattleXP(battleId, groupId, userId, 67, true)`
     - -> Team-XP +67, User bekommt 1 Pixel zum Setzen

### 3.5 Pixel setzen im Battle (setPixelsInBattle)

**Validierungen:**
1. Battle muss `'active'` sein
2. Prufe ob Battle abgelaufen -> automatisch beenden
3. User muss Mitglied der Gruppe sein
4. User muss mindestens 1 `pixelsAvailable` haben
5. Koordinaten mussen innerhalb des Grids liegen
6. Bei `allowOverwrite: false` -> kann gegnerische Pixel nicht uberschreiben

**Nach dem Setzen:**
- `pixelsAvailable` des Users wird reduziert
- `pixelsPlaced` wird erhoht
- `updateBattleStats()` zahlt alle Pixel pro Gruppe auf dem Board

### 3.6 Gewinner-Bestimmung (determineWinner)

```typescript
if (winCondition === 'pixels') {
    // Vergleiche pixelsOwned (Pixel auf dem Board)
    challengerScore = challenger.pixelsOwned;
    opponentScore = opponent.pixelsOwned;
} else if (winCondition === 'xp') {
    // Vergleiche totalXP
    challengerScore = challenger.totalXP;
    opponentScore = opponent.totalXP;
}
// Bei Gleichstand: kein Gewinner (Unentschieden)
```

**Nach dem Battle:**
- **Gewinner:** +1 Win, +1 unlockedPixel fur den Gruppen-Canvas
- **Verlierer:** +1 Loss
- **Unentschieden:** keine Anderungen

### 3.7 API-Endpoints (BattleRoute.ts)

| Method | Route | Beschreibung |
|--------|-------|-------------|
| POST | `/api/pixelwar/battles` | Challenge erstellen |
| GET | `/api/pixelwar/battles?userId=` | Alle Battles eines Users |
| GET | `/api/pixelwar/battles/active?userId=` | Aktive Battles |
| GET | `/api/pixelwar/battles/pending?userId=` | Ausstehende Challenges |
| GET | `/api/pixelwar/battles/:battleId` | Battle-Details |
| POST | `/api/pixelwar/battles/:battleId/accept` | Annehmen |
| POST | `/api/pixelwar/battles/:battleId/decline` | Ablehnen |
| POST | `/api/pixelwar/battles/:battleId/cancel` | Abbrechen |
| POST | `/api/pixelwar/battles/:battleId/surrender` | Aufgeben |
| GET | `/api/pixelwar/battles/:battleId/board` | PixelBoard abrufen |
| POST | `/api/pixelwar/battles/:battleId/pixels` | Pixel setzen |
| GET | `/api/pixelwar/battles/:battleId/score` | Live-Score |
| POST | `/api/pixelwar/battles/:battleId/end` | Manuell beenden |

**Sicherheit:**
- Max 50 Koordinaten pro Request (DoS-Schutz)
- Integer-Validierung fur Koordinaten
- ObjectId-Validierung

---

## 4. Frontend - Wichtige Komponenten

### 4.1 GroupsArea.tsx (Hauptseite)

**Layout:** 2-Spalten Grid
- Links: "My Groups" (Gruppen wo User Mitglied ist)
- Rechts: "Public Groups" (alle offenen Gruppen ohne eigene)

**Buttons:**
- "Create Group" -> offnet CreateGroupModal
- "Join by Code" -> offnet Join-Code Dialog (8-Zeichen Input, uppercase, mono font)

**State Management:**
- `fetchGroups()` ladt beides parallel (User-Gruppen + Public)
- Public Groups filtert eigene Gruppen raus
- Updates nach Join/Leave/Create/Delete

### 4.2 GroupDetailModal.tsx (Detail-Ansicht)

**Layout:** 2-Panel Dialog
- **Links:** Members-Panel (sortiert nach Rolle: Owner > Admin > Member)
  - Icons: Crown (Owner), Shield (Admin), User (Member)
- **Rechts:** Gruppen-Info + Canvas

**Features:**
- Stats: Members, Wins, XP, Pixel-Counter
- Invite-Code Anzeige (nur fur Owner/Admin) mit Copy-Button
- Interaktiver Pixel-Canvas (CSS Grid mit `<button>` Elementen)
- Farbpalette mit 9 Farben
- Progress-Bar fur genutzte/freigeschaltete Pixel
- Delete-Button (nur Owner, mit Bestatigungsdialog)

### 4.3 ChallengeModal.tsx (Challenge erstellen)

**Einstellungen:**
| Setting | Optionen |
|---------|---------|
| Duration | 1h, 24h, 7d, 4w |
| Grid Size | 15x15, 30x30, 50x50 |
| Win Condition | "Workouts" (nur Ubungen) oder "Workouts + Habits" (beides) |

Jede Win-Condition hat eine **Beschreibung** die dem User erklart, was der Modus bedeutet.

### 4.4 BattleArena.tsx (Kampf-Canvas)

**Technologie:** HTML `<canvas>` API (nicht CSS Grid wie beim Gruppen-Canvas)
- Performanter fur grose Grids (bis 50x50 = 2.500 Pixel)
- `imageRendering: 'pixelated'` fur scharfe Kanten

**Live-Features:**
- **Polling alle 5 Sekunden:** Board, Score, Battle-Daten
- **Score-Bar:** Farbige Fortschrittsbalken mit Prozentanzeige
- **Timer:** Countdown im HH:MM:SS Format
- **User-Panel:** Zeigt verfugbare Pixel + Farbpalette
- **Zoom-Controls:** 1x bis 10x

**Canvas-Rendering:**
```typescript
// Grid zeichnen
for (let x = 0; x <= board.gridWidth; x++) { ... }
// Pixel zeichnen
for (const pixel of board.pixels) {
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x * zoom, pixel.y * zoom, zoom, zoom);
}
```

**Klick-Handling:**
```typescript
const x = Math.floor((e.clientX - rect.left) / zoom);
const y = Math.floor((e.clientY - rect.top) / zoom);
// -> POST /api/pixelwar/battles/:id/pixels
```

**Battle-Ende Overlay:**
- Zeigt "Battle Ended!" mit Gewinner-Name
- Canvas wird nicht mehr klickbar (status !== 'active' check)

---

## 5. Architektur-Pattern

### Model-Service-Route Pattern (Backend)

```
Route (GroupRoute.ts)      -> Validierung, HTTP, Sanitization
  |
  v
Service (GroupService.ts)  -> Business-Logik, Fehlerbehandlung
  |
  v
Model (GroupModel.ts)      -> Mongoose Schema, Datenbank
```

- **Route:** Input-Validierung, HTTP-Status-Codes, Sanitization (XSS-Schutz)
- **Service:** Reine Business-Logik, wirft `HttpError` mit Status-Code
- **Model:** Schema-Definition, Indizes, Validatoren

### Frontend-Pattern

```
GroupsArea.tsx (Page-Level)
  |-- GroupList.tsx (Liste)
  |-- CreateGroupModal.tsx (Dialog)
  |-- GroupDetailModal.tsx (Detail + Canvas)
```

```
PixelWarsPage/BattlesTab
  |-- ChallengeModal.tsx (Challenge erstellen)
  |-- BattleArena.tsx (Kampf-Ansicht mit Canvas)
```

---

## 6. Zusammenspiel der Features

```
User schliesst Ubung ab
         |
         v
  EntryService.updateEntry()
         |
         +---> GroupService.addGroupXP() --> Gruppen-XP steigt
         |
         +---> BattleService.addBattleXP(isExercise: true)
                    |
                    +---> Team-XP +67
                    +---> User bekommt 1 Pixel
                              |
                              v
                    User offnet BattleArena
                              |
                              v
                    Klickt auf Canvas -> Pixel wird gesetzt
                              |
                              v
                    Board-Stats werden aktualisiert
                              |
                              v
                    Timer lauft ab -> determineWinner()
                              |
                              +---> Gewinner: +1 Win, +1 unlockedPixel
                              +---> Verlierer: +1 Loss
                              |
                              v
                    Gewinner-Gruppe hat jetzt mehr Pixel
                    fur ihren Gruppen-Canvas!
```

---

## 7. Technische Highlights zum Erwahnen

1. **Sparse Index fur Invite-Codes** - MongoDB indiziert nur Dokumente wo inviteCode existiert
2. **crypto.randomBytes()** - Kryptografisch sichere Zufallszahlen fur Codes
3. **Zwei verschiedene Canvas-Technologien:**
   - Gruppen-Canvas: CSS Grid mit `<button>` (interaktiv, Hover-Effekte)
   - Battle-Canvas: HTML Canvas API (performant fur grose Grids)
4. **Live-Polling (5s)** fur Echtzeit-Battle-Updates
5. **conquestCount** auf Pixeln - trackt wie oft ein Pixel erobert wurde
6. **XSS-Schutz** in allen Routes durch `sanitizeString()`
7. **DoS-Schutz** durch Limits (max 50 Koordinaten, max 100 Gruppen pro Query)
8. **Automatische Battle-Beendigung** wenn Timer ablauft (lazy check bei Pixel-Platzierung + Cron-Job Methode vorhanden)

---

## 8. Mogliche Pruferfragen & Antworten

**F: Warum zwei verschiedene Canvas-Technologien?**
A: Der Gruppen-Canvas ist klein (16x16 = 256 Zellen) -> CSS Grid mit Buttons ist einfacher und ermoglicht native Hover-Effekte und Accessibility. Der Battle-Canvas kann bis 50x50 = 2.500 Pixel haben -> HTML Canvas API ist deutlich performanter bei grosen Grids.

**F: Wie werden die Pixel verdient?**
A: Durch abgeschlossene Ubungen. Eine Ubung gibt 67 XP und 67/67 = 1 Pixel. Habits geben 10 XP aber 0 Pixel (Math.floor(10/67) = 0). So sind die beiden Modi "Workouts" und "Workouts + Habits" wirklich unterschiedlich.

**F: Was passiert wenn das Battle ablauft?**
A: Beim nachsten API-Zugriff (z.B. Pixel setzen) wird gepruft ob endDate uberschritten ist. Wenn ja, wird `completeBattle()` aufgerufen. Es gibt auch `checkAndCompleteExpiredBattles()` fur einen Cron-Job.

**F: Kann man Pixel uberschreiben?**
A: Ja, standardmasig ist `allowOverwrite: true`. Bei der Challenge-Erstellung kann man das einstellen. Wenn deaktiviert, kann man nur eigene Pixel uberschreiben.

**F: Warum Invite-Codes statt z.B. Link-Sharing?**
A: Invite-Codes sind einfacher zu teilen (z.B. mundlich, in Chats) und erfordern kein URL-Handling. 8 Hex-Zeichen = 4 Milliarden mogliche Codes, was Brute-Force verhindert.

**F: Warum members als Array im Group-Dokument und nicht als separate Collection?**
A: Da wir maxMembers auf 100 begrenzen, bleibt das Dokument klein genug. Der Vorteil ist, dass wir mit einem einzigen Query alle Gruppeninfos inkl. Members laden konnen, ohne Joins/Populates.
