# Backend

## Messaging system

Sunt statusuri pe care poate sa il aiba un mesaj:
```
{
    "status": "Success",
    "message": "This is a success message"
}
```

```
{
    "status": "Invalid",
    "message": "This is an invalid message"
}
```

```
{
    "status": "Error",
    "message": "This is an error message"
}
```
Pentru cazuri speciale de mesaje se vor denumi si field-urile

Pentru request-urile de tip ``POST`` se asteapta ca body sa fie un singur JSON 

## API Endpoints

### Register

```
/api/v1/register
```

```
    Method: GET

    /api/v1/register?email=somebody@email.com - Verifica email-ul pentru duplicate si valididate trimite un mesaj cu status "invalid", in cazul in care email-ul e valid serverul nu intoarce nimic.  
    /api/v1/register?username=somebody        - Verifica username-ul pentru duplicate si trimit un mesaj cu status "invalid" daca e deja luat  
    
```


```
    Method: POST
    
    /api/v1/register
    
    Se foloseste ca methoda de inregistrare a unui utilizator primind in body un JSON 
```

Inregistrare student:
```
    Method: POST

    /api/v1/register
    
    body: {
        "type": "student",
        "email": "studentsilitor@email.com",
        "username": "studentSilitor",
        "name": "Student Silitor Full Name",
        "password": "parola clear text",
    }
```

Inregistrare profesor:
```
    Method: POST

    /api/v1/register
    
    body: {
        "type": "teacher",
        "email": "teachersilitor@email.com",
        "username": "profesorSilitor",
        "name": "Profesor Silitor Full Name",
        "password": "parola clear text",
        "school": "Institut de invatamant",
    }
```

Inregistrare admin: ```
    Method: POST

    /api/v1/register
    
    body: {
        "type": "admin",
        "email": "adminsilitor@email.com",
        "username": "adminSilitor",
        "name": "Admin Silitor Full Name",
        "password": "parola clear text",
        "secret_code": "cod secret din php",
    }
```

```
    Inregistrararea va returna pentru username luat:
    {
        "status": "Invalid",
        "message": "The username is already taken",
    }
    
    Inregistrararea va returna pentru email luat:
    {
        "status": "Invalid",
        "message": "The email is already taken",
    }

    Inregistrararea va returna pentru eroare la insertie:
    {
        "status": "Error",
        "message": "Failed to register user.",
    }
    
    Inregistrararea va returna pentru succes:
    {
        "status": "Success",
        "message": "User registered successfully!",
    }
    
```



### Login

```
    /api/v1/login
```

```
    Method: POST

    /api/v1/login

    body: {
        "username": "username_sau_email",
        "password": "parola clear text"
    }

```
    Va returna succes: 
    {
        "status": "Success",
        "token": "JWT token", // <- Trebuie salvat in memoria locala
        "message": "Login successful",
    }

    Va returna invalid:
    {
        "status": "Invalid",
        "message": "Login failed",
    }
```
