# User Endpoint

Der Endpoint /users ist unter http://localhost:3000/api/users erreichbar.

## CREATE USER IF USER NOT EXISTS IN DATABASE

Registrierung und Anmeldung übernimmt Auth0 https://auth0.com/

Wir müssen nur dafür sorgen, dass der User nach erfolgreicher Registrierung in unserer Datenbank neu angelegt wird.

**Postman-Request um User gegebenfalls in Datenbank anzulegen**

POST http://localhost:3000/api/users
Content-Type: application/json

{
    "email": "juliusdittrich2@gmail.com"
}

**User noch nicht in Datenbank**

- Erstelltes User-Objekt wird im Body zurückgegeben (siehe UserInDatabase in Types-Verzeichnis)
- HTTP-Status 200

**User ist bereits in der Datenbank**

- User-Objekt aus der Datenbank wird im Body zurückgegeben
- HTTP-Status 200

**Fehlerhafte Erstellung**

- Fehlermeldung im Body
- HTTP-Status 500

