## CREATE
- na próbę stworzenia piosenki serwer odpowiada 400 ( problem jest przy dodawaniu wykonawców do niej)
- na próbę stworzenia albumu serwer odpowiada 400
- na próbę stworzenia artysty serwer odpowiada 400 ale tworzy wykonawce
     ( co ciekawe potem nie da się go usunąć xd - prawdopodobnie
     id nie jest wstrzykiwane poprawnie )

## READ
- przy albumie nie wyświetla się wykonawca
- kraj pochodzenia chyba w ogóle się nie zapisuje
- W select search o kategorii artyści jakoś to dziwnie działa
- W select search o kategorii artyści pojawia się wykonawca o wartości undefined
- tonacja itp chyba nie wstrzykuje się do formularza

## UPDATE
- Na edycje piosenki odpowiada 400 ( id jest null - ale tylko te stworzone po zjebaniu)
- Na próbę edycji albumu serwer odpowiada 200 i jest git tylko nie pojawiają się artyści
- Na próbę edycji artysty serwer odpowiada 200 tylko kraj się nie zapisuje

## DELETE
- Wszystko działa