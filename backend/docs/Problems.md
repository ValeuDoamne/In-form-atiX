# Problems Controller Endpoint

# Endpoint:
```
/api/v1/problems
Methode acceptate: GET, POST, DELETE
API-ul este autorizat avand nevoie de JWT.
Fiind nevoie sa fie setat header-ul 'Authorization: Bearer ${jwtToken}' pentru orice request

```

## GET

```
/api/v1/problems/all

Explicatie:
Returneaza toate id-urile si numele problemelor din baza de date.  

Returnare:
{"status": "Success", "problems": [{"id": `int`, "nume": `string`}, {"id": `int2`, "nume": `string2`}]}
Exemplu:
{"status":"Success","problems":[{"id":2,"name":"Mul"},{"id":3,"name":"Regine"}]}
```

```
/api/v1/problems/${id}
Unde id e id-ul unei probleme, de ex: `/api/v1/problems/23`


Explicatie:
Returneaza toate id-ul, numele, descrierea, problemei, solutia oficiala si data crearii problemei

Returnare:

{"status":"Invalid","message":"Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista

Daca utilizatorul este student/profesor si nu are o submisie cu un score de 100 de puncte nu va putea vizualiza solutia oficiala,
mesajul returnat fiind:
{"status": "Success", "problem": {"id": `int`, "name": `string`, "description": `string`, "date_submitted": `string`}}

Altfel daca utilizator are 100 de puncte ca solutie sau este admin va fi returnat:
{"status": "Success", "problem": {"id": `int`, "name": `string`, "description": `string`, "solution": `string`, "programming_language": `string`, "date_submitted": `string`}}

Exemplu:
{
  "status": "Success",
  "problem": {
    "id": 2,
    "name": "Mul",
    "description": "Dat doua numere a si b de la tastatura sa se faca inmultirea lor",
    "solution": "#include <iostream>\nint main()\n{\n\tint a,b;\n\tstd::cin >> a >> b;\n\tstd::cout << a * b;}",
    "programming_language": "C/C++",
    "date_submitted": "2023-06-12 20:48:53.418738"
  }
}

```

```
/api/v1/problems/all/tags

Explicatie:
Returneaza toate tag-urile din baza de date.

Returnare:
{"status": "Success", "tags": ["string1", "string2"]}
Exemplu:
{"status":"Success","tags":["clasa a 9a", "backtracking", "programare dinamica"]}
```

```
/api/v1/problems/${id}/tags

Explicatie:
Returneaza toate tag-urile asociate unei probleme.

Returnare:
{"status":"Invalid","message":"Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista

{"status":"Succes","tags":["usoara","clasa X"]}
```

```
/api/v1/problems/${id}/raport

Explicatie:
Returneaza statistici asupra unei probleme(numarul de submisii totale si numarul de submisii corecte(100 pct cough cough)) 

Returnare:
{"status":"Invalid","message":"Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista

{"status":"Succes","raport":{"total_submissions":`int`,"successful_submissions":`int`}}
```

```
/api/v1/problems/${id}/submissions

Explicatie:
Returneza toate submissile facute de utilizator catre problema data de id

(Non related FYI: extrage user_id-ul din JWT.)

Returnare:
{"status":"Invalid","message":"Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista

{"status": "Success", "submissions": [{"submission_id": `int, 
                                       "solution": `string`, 
                                       "programming_language": `string`,
                                       "score": `int sau null`,
                                       "date_submitted": `string`}]}

Exemplu:
{
  "status": "Success",
  "submissions": [
    {
      "submission_id": 1,
      "solution": "cod sursa cool",
      "programming_language": "Rust",
      "score": 20,
      "date_submitted": "2023-06-12 22:42:18.037622"
    },
    {
      "submission_id": 2,
      "solution": "cod sursdsfsdfsd;ljglkfda cool",
      "programming_language": "Rust",
      "score": null,
      "date_submitted": "2023-06-12 22:45:54.220846"
    }
  ]
}
```

```
/api/v1/problems/${id}/comments

Explicatie:
Returneaza toate comentariile asociate unei probleme.

Returnare:
{"status":"Invalid","message":"Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista

{"status": "Success", "comments": [{"comment_id": `int`, 
                                     "comment_text": `string`,
                                     "username": `string`, 
                                     "date_submitted": `string`}]}
Exemplu:
{
  "status": "Success",
  "comments": [
    {
      "comment_id": 1,
      "comment_text": "Comentariu 1",
      "username": "admin",
      "date_submitted": "2023-06-12 22:42:18.037622"
    },
    {
      "comment_id": 2,
      "comment_text": "Comentariu 2",
      "username": "student",
      "date_submitted": "2023-06-12 22:45:54.220846"
    }
  ]
}
```

## POST

```
/api/v1/problems/${id}/tags

Body: {
    "tag": `string` // numele tag-ului care va fi pui problemei
}

Endpoint-ul e autorizat doar pentru admin si profesori.
Explicatie:
Foloste un Post Request pentru a adauga o relatie dintre o problema si un tag, daca tag-ul nu exista acesta va fi pus in baza de date.

Returneaza:
{"status": "Invalid", "message": "Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista
{"status": "Invalid", "message": "Not authorized"} <-- daca utilizatoru are un JWT de student.
{"status":"Error","message":"Could not tag problem with id ${id}"} <-- cazul in care se incearca sa se puna un tag deja existent unei probleme 
{"status": "Success", "message": "Succesfully tagged problem with id ${id}"}
```

```
/api/v1/problems/${id}/submit

Body: {
    "source_code: `string` // sursa trimisa catre evaluare 
    "programming_language: `string` // numele limbjalui de programare folosit 
}

Endpoint-ul e autorizat pentru toata lumea. 
Explicatie:
Trimite o solutie a unei probleme catre evaluare.

Returneaza:
{"status": "Invalid", "message": "Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista
{"status": "Invalid", "message": "No such programming language"} <-- daca limbajul de programare nu exista in db
{"status": "Error", message: "The submmision could not be saved for problem with id ${id}"}
{"status": "Success", "message": "Successfully submitted solution to problem with id ${id}"}
```

```
/api/v1/problems/${id}/comments

Body: {
    "comment": `string` // comentariul care va fi pus problemei
}

Endpoint-ul e autorizat pentru toata lumea.
Explicatie:
Adauga un comentariu unei probleme.

Returneaza:
{"status": "Invalid", "message": "Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista
{"status": "Error", "message": "Could not add comment to problem with id ${id}"} <-- cazul in care nu se poate adauga comentariul
{"status": "Success", "message": "Successfully added comment to problem with id ${id}"}
```


## DELETE
```
/api/v1/problems/${id}

Body: <-- este ignorate/nu transmite nimic

Endpoint-ul e autorizat pentru admini. 
Explicatie:
Sterge o problema dupa un id.

Returneaza:
{"status": "Invalid", "message": "Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista
{"status": "Invalid", "message": "Not authorized"} <-- daca utilizatoru are un JWT de student sau profesor
{"status": "Error", "message": "Could not delete problem with id ${id}""} <-- cazul in care id-ul problemei nu exista
{"status": "Success", "message": "Succesfully deleted problem with id ${id}"}
```

```
/api/v1/problems/${id}/tags

Body: {
    "tag": `string` <-- tag-ul va rupe relatia de asociere cu problema
} 

Endpoint-ul e autorizat pentru admini si profesori. 
Explicatie:
Sterge un tag al unei probleme

Returneaza:
{"status": "Invalid", "message": "Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista
{"status": "Invalid", "message": "Not authorized"} <-- daca utilizatoru are un JWT de student
{"status": "Invalid", "message": "There is no problem with id ${id} and '${tag}'"} <-- daca tag-ul nu este asociat sau nu exista 
{"status": "Success", "message": "Succesfully deleted tag '${tag}' from problem with id ${id}"}
```

```
/api/v1/problems/all/tags

Body: {
    "tag": `string` <-- tag-ul va rupe relatia de asociere cu problema
} 

Endpoint-ul e autorizat pentru admini si profesori. 
Explicatie:
Sterge un tag din baza de date impreuna cu relatiile de asociere ale problemelor

Returneaza:
{"status": "Invalid", "message": "Not authorized"} <-- daca utilizatoru are un JWT de student
{"status": "Invalid", "message": "There is no tag '${tag}' in the database"} <-- daca tag-ul nu exista 
{"status": "Success", "message": "Succesfully deleted tag '${tag}' from database"}
```

```
/api/v1/problems/${id}/comments

Body: {
    "comment_id": `int` <-- id-ul comentariului care va fi sters
}

Endpoint-ul e autorizat pentru admini si user-ul care a postat comentariul.
Explicatie:
Sterge un comentariu postat unei probleme.

Returneaza:
{"status": "Invalid", "message": "Problem with id ${id} does not exist"} <-- cazul in care id-ul problemei nu exista
{"status": "Invalid", "message": "Not authorized"} <-- daca utilizatoru are un JWT de admin si nu este autorul comentariului
{"status": "Invalid", "message": "There is no comment with id ${commentId} in problem with id ${id}"} <-- daca id-ul comentariului nu exista
{"status": "Success", "message": "Succesfully deleted comment with id ${commentId} from problem with id ${id}"}
```
