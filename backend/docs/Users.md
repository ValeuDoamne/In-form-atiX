# Users Controller Endpoint

Endpoint:
```
/api/v1/users
Methode acceptate: GET, POST, DELETE
API-ul este autorizat avand nevoie de JWT.
Fiind nevoie sa fie setat header-ul 'Authorization: Bearer ${jwtToken}' pentru orice request

```

## GET

```
/api/v1/users/me

Endpoint-ul e autorizat pentru utiliatorul curent trebuie trimis JWT.
Explicatie:
Returneaza id, username, email, numele utiliatorul, user_type, data creearii a utilizatorului care face requestul

Returnare:
{"status":"Invalid","message":"Not Authorized"} 
{
  "status": "Success",
  "user": {
    "id": 2,
    "username": "teacher",
    "email": "georgi@gmail.com",
    "name": "Dobrescu George",
    "user_type": "teacher",
    "date_created": "2023-06-13 19:41:19.848624"
  }
}
```

```
/api/v1/users/all

Endpoint-ul e autorizat pentru admini.
Explicatie:
Returneaza toate id-urile si username-urile utilizatorilor din baza de date.  

Returnare:
{"status":"Invalid","message":"Not Authorized"} <-- nu are privilegii de admin
{"status": "Success", "users": [{"id": `int`, "username": `string`}, {"id": `int`, "username": `string`}]}
Exemplu:
{
  "status": "Success",
  "users": [
    {
      "id": 1,
      "username": "admin"
    },
    {
      "id": 2,
      "username": "teacher"
    }
  ]
}

```

```
/api/v1/users/${user_id}

Endpoint-ul e autorizat doar pentru admini.
Explicatie:
Returneaza datele din ``/api/v1/users/me`` doar ca pentru orice user. 

Returnare:
{"status":"Invalid","message":"Not Authorized"} <-- nu are privilegii de admin
{"status":"Error", "message": "The user id provided ${user_id} is invalid"} <-- id invalid
Exemplu:
{
  "status": "Success",
  "user": {
    "id": 2,
    "username": "teacher",
    "email": "georgi@gmail.com",
    "name": "Dobrescu George",
    "user_type": "teacher",
    "date_created": "2023-06-13 19:41:19.848624"
  }
}
```

## POST

```
/api/v1/users/me/email

Body: {
        "email": "adresademail@valida.com"
    }

Endpoint-ul e autorizat pentru utilizatorul curent.
Explicatie:
Utilizatorul poate sa isi schimbe adresa de email.

Returnare:
{"status":"Error","message":"Invalid email address provided"}
{"status":"Error","message":"The email is already in use"} <-- email-ul deja il are un utilizator in baza de date
{"status":"Error", "message": "Could not update email address"}
{"status":"Success", "message": "Successfuly updated email address"}
```

```
/api/v1/users/me/password

Body: {
        "password": "parolaSecreta"
    }

Endpoint-ul e autorizat pentru utilizatorul curent.
Explicatie:
Utilizatorul poate sa isi schimbe parola.

Returnare:
{"status":"Error", "message": "Could not update password"}
{"status":"Success", "message": "Successfuly updated password"}
```

```
/api/v1/users/me/name

Body: {
        "name": "Nume Cool"
    }

Endpoint-ul e autorizat pentru utilizatorul curent.
Explicatie:
Utilizatorul poate sa isi schimbe numele afisat la full name.

Returnare:
{"status":"Error", "message": "Could not update password"}
{"status":"Success", "message": "Successfuly updated password"}
```

```
/api/v1/users/me/name

Body: {
        "name": "Nume Cool"
    }

Endpoint-ul e autorizat pentru utilizatorul curent.
Explicatie:
Utilizatorul poate sa isi schimbe numele afisat la full name.

Returnare:
{"status":"Error", "message": "Could not update password"}
{"status":"Success", "message": "Successfuly updated password"}
```

```
/api/v1/${user_id}/{email, password, name}

Sunt disponibile doar pentru admini.

Returneaza aditional:
{"status":"Error", "message": "The user id provided ${user_id} is invalid"} <-- id invalid

```

```
/api/v1/users/${user_id}/username

Body: {
    "username": "username_cool_pe_care_voiam"
    }

Disponibil doar pentru admini.

Explicatie:
Admin-ul poate schimba username-ul unui utilizator

Returneaza aditional:
{"status":"Error", "message": "The user id provided ${user_id} is invalid"} <-- id invalid
{"status":"Error", "message": "Could not update username"}
{"status":"Success", "message": "Sucessfuly updated username"}
```

```
/api/v1/users/${user_id}/user_type

Body: {
        "user_type": "admin"
    }
SAU
Body: {
        "user_type": "student"
    }
SAU
Body: {
        "user_type": "teacher"
    }

Disponibil doar pentru admini.

Explicatie:
Admin-ul poate promova un utilizator la admin sau sa il depromoveze la  

Returneaza aditional:
{"status":"Error", "message": "The user id provided ${user_id} is invalid"} <-- id invalid
{"status":"Error", "message": "Could not update user_type"}
{"status":"Success", "message": "Sucessfuly updated user_type"}
```

# DELETE
```
/api/v1/users/me

Body: <-- NU trebuie pus nimic

Disponibil pentru orice utilizator logat. 

Explicatie:
Utilizatorul se poate sterge singur din baza de date.

Returneaza aditional:
{"status":"Error", "message": "The user id provided ${user_id} is invalid"} <-- id invalid
{"status":"Error", "message": "Could not delete user with id ${user_id}"}
{"status":"Success", "message": "Sucessfuly deleted user with id ${user_id}"}
```

```
/api/v1/users/${user_id}

Body: <-- NU trebuie pus nimic

Disponibil doar pentru admini.

Explicatie:
Admin-ul poate sterge un utilizator din baza de date. 

Returneaza aditional:
{"status":"Error", "message": "The user id provided ${user_id} is invalid"} <-- id invalid
{"status":"Error", "message": "Could not delete user with id ${user_id}"}
{"status":"Success", "message": "Sucessfuly deleted user with id ${user_id}"}
```
