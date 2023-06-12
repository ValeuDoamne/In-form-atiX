# Login Endpoint Documentatie

Endpoint:
```
/api/v1/login
Metode acceptate: POST
```

Pentru a loga un user trebuie facut un Post request

```
Method: POST
Endpoint: /api/v1/login
Body: {
        "username": "usernameSAUemail",
        "password": "parolaDeLogare"
    }

Returnare:
{"status": "Invalid", "message": "Login failed"}
{"status": "Error", "message": "User could not be logged in!"}
{"status": "Success", "message": "Login successful", "token": "JWT Token" }

```
