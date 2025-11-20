# Allgemein

- Athentifiziertung wird über E-Mail und Token, der von auth0 automatisch mitgeschickt wird, umgesetzt.

- Passt die E-Mail nicht zum Token, wird ein 403 zurückgegeben.

- Bei internen Fehlern (Datenbankfehler etc.) kommt ein 500 zurück.

- Bei Statuscodes für Fehler (400-500) kommt immer eine Nachricht im JSON-Body mit. 

- bei fehlerhaften Anfragen (falsche Felder im Body etc.) kommt ein 404

```
{
    "message": "user ist schon vorhanden"
}
```