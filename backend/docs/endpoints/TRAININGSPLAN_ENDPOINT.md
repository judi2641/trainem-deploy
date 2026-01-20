# TRAININGPLAN ENDPOINT

Eine Trainingsplan hat folgende Attribute:

- _id?: ObjectId;
- userID: ObjectId;
- name: string;
- tasks: ITask[];

```GET```
- 

- gibt alle Pläne eines users zurück
- suche erfolgt über email adresse

```
GET http://localhost:3000/api/trainingsplan/{email}
```

### Statuscodes

- 200 -> Liste aller Pläne in JSON-Array


```POST```
- 

- lege eine neuen Trainingsplan an
- Daten werden im JSON-Body übertragen

```
POST http://localhost:3000/api/trainingsplan/{email}
Content-Type: application/json

{
    name: "mein erster trainingsplan",
    tasks: [
        {
            {

            }
        }
    ]
}
```

### Statuscodes

- 201 -> Erstelltes Task-Objekt im JSON-Body
- <span style="color: red">sollen Duplikate verhindert werden?</span>

```Patch```
-

- verändere weekday oder description, alle anderen Attribute dürfen nicht verändert werden
- zu veränderndes Feld wird im JSON-Body übertragen

```
PATCH http://localhost:3000/api/tasks/{email}
Content-Type: application/json

{
    "weekday": "6",
    "description": "bankdrücken",
}
```

### Statuscodes

- 200 -> Verändertes Task-Objekt im JSON-Body
- 404 -> 0 > weekday > 7
- 401 -> Wenn nicht veränderbare Atttribute geändert werden sollen (email etc.)

```DELETE```
- 

- löscht eine Task
- Suche erfolgt über email adresse und task_id

```
DELETE http://localhost:3000/api/tasks/{email}/{task_id}
```

### Statuscodes

- 204 -> Erfolgreiches Löschen
- 404 -> Task nicht gefunden

