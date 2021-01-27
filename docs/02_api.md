# __Back-end__
### __REST API__
- ## __items_list.php__ _category_, _limit_, _page_
    Zwraca listę obiektów konkretnej kategorii określonej parametrem _category_. Długość listy jest ograniczona parametrem _limit_. Parametr _page_ jest numerem aktualnie pobieranej porcji danych. Jeśli _limit=7_ a _page=0_, zapytanie zwróci pierwsze 7 rekordów z tabeli.
    - 200 - (Zwraca listę piosenek, albumów lub artystów)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 405 - Method Not Allowed - inna niż GET
    > __GET__ _https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/items_list.php?category=artists&limit=7&page=0_
    ```javascript
        [
            {
                "id": "002i8VgAnGnaTmZnwJvPaX",
                "name": "Happy Children Song",
                "explicit": "0",
                "key": "10",
                "mode": "0",
                "danceability": "0.74",
                "energy": "0.11",
                "acousticness": "0.74",
                "instrumentalness": "0.81",
                "release_date": "1999-01-15",
                "valence": "0.61",
                "spotify_link": "https://open.spotify.com/embed/track/002i8VgAnGnaTmZnwJvPaX",
                "_artists_names": "[\"Carlos Garnett\"]",   // wynik działania JSON_ARRAYAGG()
                "_albums_names": "[\"Under Nubian Skies\"]"
            },
            {
                "id": "002tmI3PRmV3FXzczFdEto",
                "name": "Equilibrium",
                "explicit": "0",
                "key": "2",
                "mode": "1",
                "danceability": "0.1",
                "energy": "0.86",
                "acousticness": "0",
                "instrumentalness": "0.02",
                "release_date": "2003-02-11",
                "valence": "0.13",
                "spotify_link": "https://open.spotify.com/embed/track/002tmI3PRmV3FXzczFdEto",
                "_artists_names": "[\"Crowbar\", \"Crowbar\"]",
                "_albums_names": "[\"Equilibrium\", \"Sonic Excess In Its Purest Form\"]"
            },
            // ...
        ]
    ```

<div style="page-break-after: always;"></div>

- ## __create_item.php__ _category_, _item_ 
    Akceptuje metodę POST. Parametr url _category_ musi być zdefiniowany, w innym przypadku skrypt zwraca kod 400. Dodatkowo wymagane pole _name_ obiektu przesyłanego w ciele rządania jest walidowana funkcją __empty()__. Jeśli _name_ ma nieprawidłową wartość - np. jest puste, skrypt odrzuca request z kodem odpowiedzi HTTP _400 Bad Request_.
    - 201 - Created (OK)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 405 - Method Not Allowed - inna niż POST
    1. ### __Tworzenie nowych piosenek:__
    > __POST__ _https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/items_list.php?category=songs_
    ```javascript
        // Przykładowe ciało rządania POST wysłanego w celu stworzenia rekordu z kategorii songs
        {
            "name"              : "Space Song",
            "album_id"          : "00NABajpGsPCObfcl4LJsM",
            "explicit"          : 1,
            "danceability"      : null,
            "energy"            : null,
            "key"               : null,
            "mode"              : 1,
            "acousticness"      : null,
            "instrumentalness"  : 0.12,
            "liveness"          : 0.35,
            "valence"           : 0.50,
            "release_date"      : "2004-08-07",
            "spotify_link"      : "https://open.spotify.com/embed/track/1ZgMsA55GIY7ICkQh5MILA",    
            "artists_ids"       : [
                "00qD0cbhihCnqMboaFKhUt",
                "00SOiqZ0YGY2JhjSPxZMZg",
                "00SxQuOxbtwHhEx03WKBrl"
            ]
        }
    ```

<div style="page-break-after: always;"></div>

- ### __Tworzenie nowych artystów:__
    > __POST__ _https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/items_list.php?category=artists_
    ```javascript
        // Przykładowe ciało rządania POST wysłanego w celu stworzenia rekordu z kategorii artists
        {
            // id jest generowane przez skrypt php tak jak poprzednio
            "name" : "John Doe",
            "description" : "Some regular Johnny.",
            "country" : "US",
            "spotify_link" : "https://open.spotify.com/track/5th3rj1nW25bm5iSLiK3i9?si=pZDDS2R5S36hFNGalRQ04g",
            "albums_ids" : [
                "00NABajpGsPCObfcl4LJsM", 
                "02IWlpaz5c17t21cs0PW9L", 
                "02OrTuXLp4AT6uGFiEVYeB"
            ],
            "songs_ids" : [
                "007jkmP3FVDCWMoWt1eVQl", 
                "00CV3dIppTIFv6VxodP7u5", 
                "00DBaAr5Y1ITn5KrYinFfl", 
                "00dqr0jrD9Z1wUNGQHZF56", 
                "00EbeXG3twN0gW6XAlQskB"
            ]
        }
    ```

<div style="page-break-after: always;"></div>

  -  ### Tworzenie nowych albumów
    > __POST__ _https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/items_list.php?category=albums_
    ```javascript
        // Przykładowe ciało rządania POST wysłanego w celu stworzenia rekordu z kategorii albums
        {   
            // jak poprzednio id jest generowane przez php
            "name" : "Madvillainy",
            "release_date" : "2003-04-23",
            "spotify_link" : "https://open.spotify.com/album/01FCoGEQ3NFWF4fHJzdiax?si=YI7VVUs2RYWrNvFXCQtNXw",
            "artists_ids" : [],
            "songs_ids" : [
                "438qB0NxSDg6FMFTP1GN87",
                "58q1WGzLfPb8ZORUbpzjIN",
                "5J1JJpheiX9GiPs1tfTUcF",
                "7eBrrgwSlvftLCwcVk4AHU",
                "21Mq0NzFoVRvOmLTOnJjng",
                "7ubhNObSLGKIazr3ObgNNQ"
            ]
        }
    ```

<div style="page-break-after: always;"></div>

- ## __update_item.php__ _category_, _item_, _id_
    - 200 - OK (Updated)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 204 - No contend - nie ma zasobu o tym id
    - 405 - Method Not Allowed - inna niż PUT/POST

<div style="page-break-after: always;"></div> 

- ## __delete_item.php__ _category_, _item_, _id_
    - 200 - OK (Deleted)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 204 - No contend - nie ma zasobu o tym id
    - 405 - Method Not Allowed - inna niż DELETE/POST

<div style="page-break-after: always;"></div>

- ## __search_item.php__ _category_, _phrase_
    - 200 - OK (Znaleziono rekordy lub zwrócono pustą listę)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 405 - Method Not Allowed - inna niż GET

<div style="page-break-after: always;"></div>

- ## __countries_list.php__ 
    Skrypt akceptuje metodę GET i zwraca listę obiektów zawierających nazwę kraju _name_ i jednoznacznie identyfikujący je _iso_code_.
    - 200 - OK
    - 405 - Method Not Allowed - inna niż GET
    > __GET__ _https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/countries_list.php_
    ```javascript
        [
            {
                "iso_code": "AD",
                "name": "Andorra"
            },
            {
                "iso_code": "AE",
                "name": "United Arab Emirates (the)"
            },
            {
                "iso_code": "AF",
                "name": "Afghanistan"
            },
            // ...
        ]
    ```
    

