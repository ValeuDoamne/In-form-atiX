# Classrooms Endpoint Documentatie

Endpoint:
```
/api/v1/classrooms

Folosit de studenti si profesori pentru managementul claselor.
Methode: GET, POST, DELETE
```

## GET

```
/api/v1/classrooms/mine

Explicatie: 
Returneaza toate clasele in care se afla un student sau un profesor.

Returneaza:
{"status": "Success",
 "data": [
    {
        "id": `int`, <-- id-ul clasei
        "name": `string`,
        "code": `string`,
        "teacher_id": `int`,
        "teacher_name": `string`,
        "school_name": `string`,
    }
 ]
}

Exemplu:
{
  "status": "Success",
  "data": [
    {
      "id": 3,
      "name": "Clasa a 9a",
      "code": "XuOVkvfn",
      "teacher_id": 3,
      "teacher_name": "Dovelceanu Liliana",
      "school_name": "Colegiul National \"Mihai Eminescu\" Botosani"
    }
  ]
}
```

```
/api/v1/classrooms/${class_id}

Explicatie: 
Returneaza date despre o singura clasa doar daca utilizatorul se afla in clasa respectiva. 

Returneaza:
{"status": "Success",
 "data": {
        "id": `int`, <-- id-ul clasei
        "name": `string`,
        "code": `string`,
        "teacher_id": `int`,
        "teacher_name": `string`,
        "school_name": `string`,
 }
}

Exemplu:
{
  "status": "Success",
  "data": 
    {
      "id": 3,
      "name": "Clasa a 9a",
      "code": "XuOVkvfn",
      "teacher_id": 3,
      "teacher_name": "Dovelceanu Liliana",
      "school_name": "Colegiul National \"Mihai Eminescu\" Botosani"
    }
  
}

```


```

/api/v1/classrooms/colleagues?class_id=${class_id}

Explicatie: 
Returneaza date despre colegii din clasa doar daca utilizatorul se afla in clasa respectiva. 

Returneaza:
{"status": "Success",
 "data": [
    {
      "id": `id`, <-- id-ul studentului
      "username": `string`,
      "name": `string`,
      "email": `string`,
      "problems_solved": `int`,
      "problems_submitted": `int`
    }, 
    {
      "id": `id`, <-- id-ul studentului
      "username": `string`,
      "name": `string`,
      "email": `string`,
      "problems_solved": `int`,
      "problems_submitted": `int`
    }
 ]
}
{"status": "Error", "message": "There is no such class id $classroom_id or you are not in the class"}

Exemplu:
{
  "status": "Success",
  "data": [
    {
      "id": 5,
      "username": "student2",
      "name": "Alexandra Stan",
      "email": "alexandra.stan@gmail.com",
      "problems_solved": 0,
      "problems_submitted": 0
    }
  ]
}
```
## POST

```
/api/v1/classrooms/create

Body: {
    "name": `string`
}

Endpoint autorizat doar pentru profesori.

Explicatie:
Creaza o clasa pentru profesori in care va fi asignata un cod random pentru a da join.

Returneaza:
{"status": "Error", "message": "The name of the class cannot be empty"}
{"status": "Success", "message": "Class created succesfully"}
{"status": "Error", "message": "Could not create class"}
{"status": "Error", "message": "Not authorized"}
```
```
/api/v1/classrooms/change_name

Body: {
    "name": `string`,
    "class_id": `int`
}

Endpoint autorizat doar pentru profesori.

Explicatie:
Profesorul poate schimba numele unei clase de studenti.

Returneaza:
{"status": "Success", "message": "Name of classroom changed successfully"}
{"status": "Error", "message": "Could not change classroom name"}
{"status": "Error", "message":" Not authorized"}
```

```
/api/v1/classrooms/join

Body: {
    "code": `string`
}

Endpoint autorizat doar pentru studenti.

Explicatie:
Studenti dau join unei clase folosind un cod dat de profesor.

Returneaza:
{"status": "Success", "message": "Joined classroom successfully"}
{"status": "Error", "message": "Could not join class"}
{"status": "Error", "message":" Not authorized"}
```

## DELETE 

```
/api/v1/classrooms/${class_id}

Endpoint autorizat doar pentru profesori.

Explicatie:
Sterge o clasa pe ca un profesor o detine.

Returneaza:
{"status": "Success", "message": "Successfully deleted classroom"}
{"status": "Error", "message": "Could not delete classroom"}
{"status": "Error", "message": "There is no such class id $class_id or you are not in the class"}
```

```
/api/v1/classrooms/remove_student

Body: {
    "class_id": `int`,
    "student_id": `int`,
}

Endpoint autorizat doar pentru profesori.

Explicatie:
Sterge un student dintr-o clasa pe ca un profesor o detine.

Returneaza:
{"status": "Success", "message": "Successfully deleted classroom"}
{"status": "Error", "message": "Could not delete classroom"}
{"status": "Error", "message": "There is no such class id $class_id or you are not in the class"}
```
