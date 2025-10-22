### Requirements

- Node.js
- Docker

### SETUP

```bash
# im root verzeichnis: 

cd backend

# installiert mongodb image und startet container
docker compose up

# back to root
cd ..

# installiert alle node_modules aus frontend und backend
npm run install:all 

# startet backend auf port 3000 und frontend auf 5173
npm run dev
````