# Unreleased Problems Controller Endpoint

## Endpoint:
```
/api/v1/unreleased_problems
Metode acceptate: GET, POST
API-ul este autorizat, avand nevoie de JWT.
Este nevoie de headerul 'Authorization: Bearer ${jwtToken}' pentru orice request.
```

## GET

```
/api/v1/unreleased_problems/all

Explicatie:
Returneaza toate problemele care nu au fost inca publicate.

Returnare:
{
  status: "Succes", 
  unreleased_problems: [
  {
    id: `int`,
    name: `string`,
    description: `string`,
    solution: `string`,
    author: `string`,
    status: `string`,
    date_submitted: `string`,
    programming_language: `string`,
  }, 
    ...
  ]
}
```

```
/api/v1/unreleased_problems/${id}

Explicatie:
Returneaza o problema, unde $id e id-ul unei probleme, de ex: `/api/v1/unreleased_problems/23`

Returneaza:
{
  status: "Succes", 
  unreleased_problem: {
    id: `int`,
    name: `string`,
    description: `string`,
    solution: `string`,
    author: `string`,
    status: `string`,
    date_submitted: `string`,
    programming_language: `string`,
  }
}

{
  status: "Invalid",
  message: "Unreleased problem with id ${id} does not exist"
}
```

## POST

```
/api/v1/unreleased_problems/propose

Explicatie:
Propune o problema noua. Va fi nevoie de un token de tip admin sau teacher pentru a putea face request-ul.

Body:
{
  name: `string`,
  description: `string`,
  solution: `string`,
  programming_language: `string`,
}

Returneaza:
{
  status: "Succes",
  message: "Problem proposed"
}

{
  status: "Error",
  message: "No such programming language"
}

{
  status: "Invalid",
  message: "Not authorized"
}
```

```
/api/v1/unreleased_problems/${id}

Explicatie:
Accepta, sau refuza o problema noua. Va fi nevoie de un token de tip admin pentru a putea face request-ul.

Body:
{
  verdict: `approve` | `deny`,
}

Returneaza:
{
  status: "Succes",
  message: "Problem with ${id} accepted / rejected"
}

{
  status: "Error",
  message: "Could not accept / reject problem with ${id}"
}

{
  status: "Invalid",
  message: "Invalid action (required: 'approve' | 'deny')"
}

{
  status: "Invalid",
  message: "Not authorized"
}
```