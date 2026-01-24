# 08 - Deployment

[← Zurück zum Wiki](../WIKI.md)

---

## 🚀 Deployment-Optionen

Trainem kann auf verschiedenen Plattformen deployed werden:

### Frontend
- **Vercel** (empfohlen) - Zero-Config Deployment für Vite/React
- **Netlify** - Alternative mit CI/CD
- **GitHub Pages** - Kostenlos für statische Sites

### Backend
- **Railway** (empfohlen) - Modern PaaS, kostenloser Tier
- **Heroku** - Klassische PaaS-Lösung
- **Render** - Alternative zu Heroku
- **DigitalOcean** - VPS mit mehr Kontrolle

### Datenbank
- **MongoDB Atlas** (empfohlen) - Managed MongoDB in der Cloud
- **Selbst gehostet** - Docker Container auf VPS

---

## 📦 Frontend Deployment (Vercel)

### 1. Vorbereitung

```bash
# Build testen
cd frontend
npm run build

# Preview
npm run preview
```

### 2. Vercel Deployment

```bash
# Vercel CLI installieren
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel
```

### 3. Environment Variables in Vercel

```env
VITE_API_URL=https://your-backend.railway.app
VITE_AUTH0_DOMAIN=dev-wmcuuu42i1iqwc5e.us.auth0.com
VITE_AUTH0_CLIENT_ID=g8BoaEXH4lB7gRMqRc8F0ruGLvy9OXkD
```

---

## 🔧 Backend Deployment (Railway)

### 1. Vorbereitung

```bash
# Build testen
cd backend
npm run build
```

### 2. Railway Setup

1. Gehe zu [railway.app](https://railway.app)
2. Erstelle neues Projekt
3. Verbinde GitLab/GitHub Repository
4. Wähle `/backend` als Root Directory
5. Railway erkennt automatisch Node.js

### 3. Environment Variables

```env
NODE_ENV=production
PORT=3000
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/trainem
AUTH0_DOMAIN=dev-wmcuuu42i1iqwc5e.us.auth0.com
AUTH0_AUDIENCE=https://trainem.authentication
```

### 4. Start Command

```json
{
  "scripts": {
    "start": "node dist/Server.js"
  }
}
```

---

## 🗄️ Datenbank Deployment (MongoDB Atlas)

### 1. Cluster erstellen

1. Gehe zu [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Erstelle kostenlosen M0 Cluster (512 MB)
3. Wähle Region (z.B. Frankfurt)
4. Cluster-Name: `trainem-cluster`

### 2. Database User erstellen

1. Database Access → Add New Database User
2. Username: `trainem-user`
3. Password: [Sicheres Passwort generieren]
4. Rolle: Read & Write

### 3. Network Access

1. Network Access → Add IP Address
2. Wähle "Allow Access from Anywhere" (0.0.0.0/0)
   - **Nur für Entwicklung!**
   - **Production**: Spezifische IPs (Railway, Vercel)

### 4. Connection String

```
mongodb+srv://trainem-user:<password>@trainem-cluster.abc123.mongodb.net/trainem?retryWrites=true&w=majority
```

Verwende in `backend/config/production.json`:
```json
{
  "database": {
    "uri": "mongodb+srv://trainem-user:PASSWORD@trainem-cluster.abc123.mongodb.net/trainem"
  }
}
```

---

## 🔄 CI/CD mit GitLab CI

### `.gitlab-ci.yml` (Root)

```yaml
stages:
  - test
  - build
  - deploy

# Frontend Tests
frontend-test:
  stage: test
  image: node:20
  script:
    - cd frontend
    - npm install
    - npm run lint
  only:
    - main
    - merge_requests

# Backend Tests
backend-test:
  stage: test
  image: node:20
  script:
    - cd backend
    - npm install
    - npm test
  only:
    - main
    - merge_requests

# Frontend Build
frontend-build:
  stage: build
  image: node:20
  script:
    - cd frontend
    - npm install
    - npm run build
  artifacts:
    paths:
      - frontend/dist
  only:
    - main

# Backend Build
backend-build:
  stage: build
  image: node:20
  script:
    - cd backend
    - npm install
    - npm run build
  artifacts:
    paths:
      - backend/dist
  only:
    - main

# Deploy to Vercel (Frontend)
deploy-frontend:
  stage: deploy
  image: node:20
  script:
    - npm install -g vercel
    - cd frontend
    - vercel --prod --token=$VERCEL_TOKEN
  only:
    - main
  when: manual

# Deploy to Railway (Backend)
deploy-backend:
  stage: deploy
  image: node:20
  script:
    - echo "Railway deploys automatically via Git push"
  only:
    - main
  when: manual
```

---

## 🔐 Auth0 Production Setup

### 1. Callback URLs hinzufügen

In Auth0 Dashboard → Application Settings:

**Allowed Callback URLs**:
```
https://your-app.vercel.app/callback,
http://localhost:5173/callback
```

**Allowed Logout URLs**:
```
https://your-app.vercel.app,
http://localhost:5173
```

**Allowed Web Origins**:
```
https://your-app.vercel.app,
http://localhost:5173
```

### 2. CORS konfigurieren

Backend `Server.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'
  ],
  credentials: true
}));
```

---

## 📊 Health Checks

### Backend Health Endpoint

```typescript
// backend/src/Server.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
```

**Monitoring**: Railway & Vercel haben integrierte Health Checks

---

## 🛡️ Security Checklist

- [ ] Environment Variables nicht im Code
- [ ] HTTPS aktiviert (Vercel/Railway Standard)
- [ ] MongoDB Atlas: Nur spezifische IPs erlauben
- [ ] Auth0: Production Credentials separiert
- [ ] CORS richtig konfiguriert
- [ ] Rate Limiting aktiviert (geplant)
- [ ] Secrets in GitLab CI/CD Variables

---

## 📈 Monitoring (Optional)

**Empfohlene Tools**:
- **Sentry** - Error Tracking
- **LogRocket** - Session Replay
- **Datadog** - APM & Logging
- **Uptime Robot** - Uptime Monitoring

---

**Letzte Aktualisierung**: 2026-01-24

[← Zurück zum Wiki](../WIKI.md) | [Weiter zu Testing →](09-Testing.md)
