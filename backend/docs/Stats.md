# Stats Endpoint Documentatie

Endpoint:
```
/api/v1/stats

Este destinat doar pentru admini pentru a returna statistici despre aplicatia web.
```

## GET

```
/api/v1/stats/all

Explicatie:
Returneaza numarul de: utilizatori, probleme, probleme unreleased, clase, submisii, scoli, comentarii si rating-uri.

Returneaza:
{"status": "Success", "data": {
        "users": `int`,
        "problems": `int`,
        "new_problems": `int`,
        "classrooms": `int`,
        "submissions": `int`,
        "schools": `int`,
        "comments": `int`,
        "ratings": `int`
    }
}
```

```
/api/v1/stats/{users, problems, new_problems, classrooms, submissions, schools, comments, ratings}

Explicatie:
Returneaza un numar individual.

Returneaza:
{"status": "Success", "data": `int`}
```

