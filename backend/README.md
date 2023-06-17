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

### [Register](docs/Register.md)

### [Login](docs/Login.md)

### [Problems](docs/Problems.md)

### [Unreleased Problems](docs/UnreleasedProblems.md)

### [Users](docs/Users.md)

### [Stats](docs/Stats.md)

### [Classrooms](docs/Classrooms.md)

### [Homework](docs/Homework.md)