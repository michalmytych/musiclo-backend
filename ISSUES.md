# 1. __Baza Danych__
- Wybrać 50000 rekordów ze spotify_features.
- Zaokrąglić potrzebne wartości, zamienić separatory na |.
- dodać pola z linkiem do spotify do tabel i wypełnić je.
- Wybrać potrzebne pola do tabel.
- dodać brakujące pola.
- Skonstruować tabele i relacje.
- SQL.

# 2. __Back-end__
### __REST API__
- ## __items_list.php__ _category_, _limit_, _page_
    Zwraca listę obiektów konkretnej kategorii określonej parametrem _category_. Długość listy jest ograniczona parametrem _limit_. Parametr _page_ jest numerem aktualnie pobieranej porcji danych. Jeśli _limit=7_ a _page=0_, zapytanie zwróci pierwsze 7 rekordów z tabeli.
    - 200 - OK
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 405 - Method Not Allowed - inna niż GET
    > __GET__ _https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/items_list.php?category=artists&limit=7&page=0_
    ```json
        [
            {
                "iso_code" : "AF",
                "name"     : "Afghanistan"
            },
            ...
        ]
    ```
- ## __create_item.php__ _category_, _item_ 
    - 201 - Created (OK)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 405 - Method Not Allowed - inna niż POST
- ## __update_item.php__ _category_, _item_, _id_
    - 200 - OK (Updated)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 204 - No contend - nie ma zasobu o tym id
    - 405 - Method Not Allowed - inna niż PUT/POST
- ## __delete_item.php__ _category_, _item_, _id_
    - 200 - OK (Deleted)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 204 - No contend - nie ma zasobu o tym id
    - 405 - Method Not Allowed - inna niż DELETE/POST
- ## __search_item.php__ _category_, _phrase_
    - 200 - OK (Znaleziono rekordy lub zwrócono pustą listę)
    - 400 - Bad request (np. brakuje wymaganego parametru)
    - 405 - Method Not Allowed - inna niż GET
- ## __countries_list.php__ 
    - 200 - OK
    - 405 - Method Not Allowed - inna niż GET
    > __GET__ _https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/countries.php_
    ```json
        [
            {
                "iso_code" : "AF",
                "name"     : "Afghanistan"
            },
            ...
        ]
    ```
    

