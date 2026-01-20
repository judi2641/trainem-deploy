# USER ENDPOINT

**Der User hat die Attribute:**

email: string

_id?: ObjectId
userType?: UserType
firstName?: string
lastName?: string
birthDate?: Date
gender?: GenderType
avatar?: string
img?: string

```POST``` 
- 
- lege neuen nutzer an
- user-daten im json body
- User wird nur nach der Registrierung mit Auth0 erzeugt
- User hat erst einmal nur eine E-Mail-Adresse


```
POST http://localhost:3000/api/users
Content-Type: application/json

{
    "email": "juliusdittrich2@gmail.com",
}
```

### Statuscodes

- Erfolgreiche Erstellung -> 201: Erstelltes User-Objekt im JSON-Body
- User schon vorhanden/ fehlerhafte Werte -> 400

```GET```
-
- gibt daten des users zurück
- suche erfolgt über email adresse

```
GET http://localhost:3000/api/users/{email}
```

### Statuscodes

- User gefunden -> 200: User-Daten im JSON-Body
- User nicht gefunden -> 404



```PATCH```
- 
- passe user daten an
- Daten müssen nach der Registrierung kommen

```
PATCH http://localhost:3000/api/users/{email}
Content-Type: application/json

{
    "firstName": "Julius",
    "lastName" : "Dittrich",
    "birthdate": "..."
    ...
}
```

### Statuscodes

- Erfolgreiche Änderung -> 200: verändertes User-Objekt im JSON-Body
- Fehlerhafte Werte -> 400


```DELETE```
-
- user löschen

```
DELETE http://localhost:3000/api/users/{email}
```

### Statuscodes

- Erfolgreiches Löschen -> 204 (No Content)
- User existiert nicht -> 400