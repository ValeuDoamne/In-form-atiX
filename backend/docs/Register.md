# Register Endpoint Documentatie

```
/api/v1/register
Methode Acceptate: GET, POST

```

```
method: GET 

/api/v1/register?email=somebody@email.com - verifica email-ul pentru duplicate si validitate trimite un mesaj cu status "Invalid", in cazul in care email-ul e valid serverul intoarce doar un 200 OK ca raspuns.  
/api/v1/register?username=somebody        - verifica username-ul pentru duplicate si trimit un mesaj cu status "Invalid" daca e deja luat, in cazul in care e valid serverul introarce doar un 200 OK ca raspuns. 
    
```

```
    method: post
    
    /api/v1/register
    
    se foloseste ca methoda de inregistrare a unui utilizator primind in body un json 
```

inregistrare student:
```
    method: POST 

    /api/v1/register
    
    body: {
        "type": "student",
        "email": "studentsilitor@email.com",
        "username": "studentsilitor",
        "name": "student silitor full name",
        "password": "parola clear text",
    }
```

inregistrare profesor:
```
    method: POST 

    /api/v1/register
    
    body: {
        "type": "teacher",
        "email": "teachersilitor@email.com",
        "username": "profesorsilitor",
        "name": "profesor silitor full name",
        "password": "parola clear text",
        "school": "institut de invatamant",
    }
```

inregistrare admin: 
```
    method: POST 

    /api/v1/register
    
    body: {
        "type": "admin",
        "email": "adminsilitor@email.com",
        "username": "adminsilitor",
        "name": "admin silitor full name",
        "password": "parola clear text",
        "secret_code": "cod secret din php",
    }
```

```
inregistrararea va returna pentru username luat:
{
    "status": "Invalid",
    "message": "The username is already taken",
}

inregistrararea va returna pentru email luat:
{
    "status": "Invalid",
    "message": "The email is already taken",
}

inregistrararea va returna pentru eroare la insertie:
{
    "status": "Error",
    "message": "Failed to register user.",
}

inregistrararea va returna pentru succes:
{
    "status": "Success",
    "message": "User registered successfully!",
}
    
```

