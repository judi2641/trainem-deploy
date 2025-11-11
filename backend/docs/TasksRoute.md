# Tasks Endpoint

Der Enpoint /tasks ist unter http://localhost:3000/api/tasks erreichbar.

## Create Task

**Postman-Request mit Beispielwerten um Task zu erstellen**

POST http://localhost:3000/api/tasks
Content-Type: application/json

{

    "user_id": "juliusdittrich", 
    "day": "Monday",
    "name": "Kniebeugen",
}

**Erfolgreiche Erstellung:**
- Erstelltes Task-Objekt wird im Body zurückgeben (siehe TaskInDatabase in Types-Verzeichnis) 
- HTTP-Status 201

**Fehlerhafte Erstellung**
- Fehlermeldung im Body
- HTTP-Status 500


