# In-form-atiX

Situl de probleme de informatica.

Static generated site at: https://valeudoamne.github.io/In-form-atiX/


Pentru a rula local trebuie instalat `docker` si `docker-compose`

## Building
Pornit docker daemon:
```
systemctl start docker
```

In directorul proiectului se ruleza:
```
docker-compose build
```

## Running

```
docker-compose up -d
```
Optiunea `-d` pentru rularea containerelor in background

## About

La adresa `http://localhost` se afla site-ul web unde modificarile din directorul `frontend` se vor vedea in timp real.

La adresa `http://localhost:8000` se afla API-ul REST al paginii.

Membri:
* Alexa Constantin-Cosmin (@ValeuDoamne)
* Grasu Ioan (@lGnyte)
* Niță Alexandru (@Allexor)
