# Tasks Endpoint

Der Enpoint /tasks ist unter http://localhost:3000/api/tasks erreichbar.

## CREATE TASK

**Postman-Request mit Beispielwerten um Task zu erstellen**
```
POST http://localhost:3000/api/tasks
Content-Type: application/json

{

    "user_id": "juliusdittrich", 
    "day": "Monday",
    "name": "Kniebeugen",
}
```
**Erfolgreiche Erstellung:**
- Erstelltes Task-Objekt wird im Body zurückgeben (siehe TaskInDatabase in Types-Verzeichnis) 
- HTTP-Status 201

**Fehlerhafte Erstellung**
- Fehlermeldung im Body
- HTTP-Status 500

## GET ALL TASKS TO USER ID

**Postman-Request zum Abrufen aller Tasks zu einer UserID

```
GET http://localhost:3000/api/tasks/juliusdittrich
```

Backend liefert alles Tasks in einem JSON-ARRAY. Wenn keine Daten gefunden werden, kommt ein leeres Array zurück.

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 526
ETag: W/"20e-FbC2Lgj64iDjSYkt6NOH2acSzVk"
Date: Tue, 11 Nov 2025 12:12:36 GMT
Connection: close

[
  {
    "_id": "690dd4814d99c7a02ea54192",
    "name": "Kniebeugen",
    "day": "Monday",
    "user_id": "juliusdittrich",
    "__v": 0
  },
  {
    "_id": "690dd4894d99c7a02ea54194",
    "name": "Kniebeugen",
    "day": "Monday",
    "user_id": "juliusdittrich",
    "__v": 0
  }
]

```


