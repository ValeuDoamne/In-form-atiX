# AdminPost Endpoint Documentatie

Endpoint:
```
/api/v1/announcements

Anunturile de luat sunt publice dar de create/sters are nevoie e privilegii de admin.
```

## GET

```
/api/v1/announcements

Explicatie:
Returneaza post-urile adminilor din baza de date

Returneaza:
{"status": "Success", "announcements": [{"id": `int`, "title": `string`, "content": `string`, "username": `string`, "date_created":`string`}]}

Exemplu:
{
  "status": "Success",
  "announcements": [
    {
      "id": 1,
      "title": "Welcome",
      "content": "This is our first post hope you will enjoy",
      "username": "admin",
      "date_created": "2023-06-15 01:03:19.744262"
    },
    {
      "id": "4",
      "title": "Test again",
      "content": "This is the most intense test\n\n\n&lt;script&gt;alert(1);&lt;/script&gt;",
      "username": "admin",
      "date_created": "2023-06-15 01:46:03.254953"
    }
  ]
}
```

## POST

```
/api/v1/announcements

Endpoint-ul este autorizat si accepta doar tokene de admin

Body: {
        "title": `string`,
        "content": `string`
    }

Explicatie:
Insereaza un nou post in baza de date.

Returneaza:
{"status": "Success", "message": "Successfully inserted new post"} 
{"status": "Error", "message": "Could not insert new post"}
{"status": "Invalid", "message": "Title cannot be empty"} <-- title === ""
{"status": "Invalid", "message": "Content cannot be empty"} <-- content === ""
```

## DELETE

```
/api/v1/announcements

Endpoint-ul este autorizat si accepta doar tokene de admin

Body: {
        "id": `int`
    }

Explicatie:
Sterge un post din baza de date.

Returneaza:
{"status": "Success", "message": "Successfully deleted post"} 
{"status": "Error", "message": "Could not delete post"}
{"status": "Invalid", "message": "No such id ${id}"}

```
