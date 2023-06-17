# Homework Controller Endpoint

## Endpoint:
```
/api/v1/homework
Metode acceptate: GET, POST, DELETE
API-ul este autorizat, avand nevoie de JWT.
Este nevoie de headerul 'Authorization: Bearer ${jwtToken}' pentru orice request.
```

## GET

```
/api/v1/homework/{homework_id}

Explicatie:
Returneaza o tema, unde $id e id-ul unei teme, de ex: `/api/v1/homework/23`

Returneaza:
{
    "status": "Success",
    "homework": {
        id: `int`,
        classroom_id: `int`,
        name: `string`,
        time_limit: `string`,
        problems": [`int`, `int`, ...], <-- lista de id-uri de probleme
    }
}

{
    status: "Error",
    message:  "User $user_id is not a valid teacher for $homework_id (not a teacher or not part of the class)" |
              "Homework with id $homework_id does not exist" |
              "Classroom with id $classroom_id does not exist"
}
```

```
/api/v1/homework/given/{classroom_id}

Explicatie:
Returneaza toate temele date unei clase, unde $classroom_id e id-ul unei clase, de ex: `/api/v1/homework/given/23`

Returneaza:
{
    "status": "Success",
    "homework": [
        {
            id: `int`,
            classroom_id: `int`,
            name: `string`,
            time_limit: `string`,
            problems": [`int`, `int`, ...], <-- lista de id-uri de probleme
        },
        ...
    ]
}

{
    status: "Error",
    message:  "User $user_id is not a valid teacher for $classroom_id (not a teacher or not part of the class)" |
              "Classroom with id $classroom_id does not exist"
}
```

```
/api/v1/homework/submissions/{homework_id}

Explicatie:
Returneaza toate solutiile trmise de elevi pentru tema, unde $homework_id e id-ul unei teme, de ex: `/api/v1/homework/submissions/23`

Returneaza:
{
  status: "Success",
  submissions: [
    {
      user_id: `int`,
      solution: `string`,
      problem_id: `int`,
      date_submitted: `string`,
    },
    ...
  ]
}

{
    status: "Error",
    message:  "User $user_id is not a valid teacher for $homework_id (not a teacher or not part of the class)"
}
```

## POST

```
/api/v1/homework/post/{classroom_id}

Explicatie:
Adauga o tema pentru o clasa, unde $classroom_id e id-ul unei clase, de ex: `/api/v1/homework/post/23`

Body:
{
    name: `string`,
    time_limit: `string`,
    problems": [`int`, `int`, ...], <-- lista de id-uri de probleme
}

Returneaza:
{
    status: "Success",
    message: "Homework for class ${classroom_id} posted successfully"
}

{
    status: "Error",
    message: "Classroom with id $classroom_id does not exist"
}
```

## DELETE

```
/api/v1/homework/{homework_id}

Explicatie:
Sterge o tema, unde $homework_id e id-ul unei teme, de ex: `/api/v1/homework/23`

Returneaza:
{
    status: "Success",
    message: "Homework ${homework_id} deleted"
}

{
    status: "Error",
    message: "Homework with id ${homework_id} does not exist"
}
```
