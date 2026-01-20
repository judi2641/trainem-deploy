# COMPLETED TASKS

Eine Completed_Task hat folgende Attribute:

- <span style="color: red">email oder user_id?</span>
- completed_task_id (mongoose)
- task_id
- done_at
- difficulty

```GET```
-

- gibt alle Completed Task eines Users zurück
- suche erfolgt über email 

```
GET http://localhost:3000/api/completedTasks/{email}
```

**Statuscodes**

- 200 -> Liste aller Completed Tasks in JSON-Array

```POST```
-

- lege eine Completed Task an
- Daten werden im JSON-Body übertagen
- done_at wird zunächst immer auf den Zeitpunkt des Requests gesetzt

```
POST http://localhost:3000/api/completedTasks/{email}/{task_id}
```

**Statuscodes**

- 200 -> erstelltes Completed Task Objekt im JSON-Body
- 404 -> task wurde nicht gefunden/ task ist schon completed

