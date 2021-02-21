<?php

header("Access-Control-Allow-Origin: https://wierzba.wzks.uj.edu.pl/");

include "autoryzacja.php";
include "config.php";
include "queries.php";

/**
 * 
 * Skrypt sprawdza czy w $_POST zostały zdefiniowane:
 * category - kategoria zwracanych obiektów (nazwa tabeli)
 * phrase   - fraza wyszukiwana przez użytkownika
 * 
 * Jeśli wszystkie parametry zostały podane, skrypt zwraca
 * listę obiektów z danej kategorii będącą wynikiem działania
 * dwóch połączonych SELECTÓW - pierwszy podaje tylko wyniki
 * rozpoczynające się na daną frazę, drugi zaś te które frazę
 * jedynie w sobie zawierają. Ilość zwracanych wyników jest 
 * określona stałym limitem wynoszącym 50 rekordów.
 * 
 */

if ($_DEBUG_MODE_) {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
} else {
    error_reporting(0);
}

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname)
    or die('Błąd połączenia z serwerem bazy danych: '.mysqli_connect_error());

if (!mysqli_set_charset($conn, "utf8")) {
    printf("Error loading character set utf8: %s\n", mysqli_error($conn));
    exit();
}

mysqli_query($conn, 'SET NAMES utf8');


if($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['category']) && isset($_GET['phrase'])) {                
        
        $table = $_GET['category'];        
        $phrase = $_GET['phrase'];
        $prefix_phrase = "$phrase%";
        $contains_phrase = "%$phrase%";

        switch ($_GET['category']) {
            case 'songs':
                $query = $_SEARCH_SONG;
                break;         
            case 'albums':
                $query = $_SEARCH_ALBUM;
                break;
            case 'artists':
                $query = $_SEARCH_ARTIST;
                break;
            default:
                http_response_code(400);
        }
        
        $searchStatement = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($searchStatement, "ss", $prefix_phrase, $contains_phrase);
        mysqli_stmt_execute($searchStatement);

        $result = mysqli_stmt_get_result($searchStatement);                  

        $arr = array();        
        while($row = mysqli_fetch_assoc($result))
        {
            $row = array_map(function($value) {
                return $value === "" ? NULL : $value;
            }, $row);

            $arr[] = $row;
        }        

        echo json_encode($arr);
    } else {
        // Bad Request:
        http_response_code(400);
    }
} else {
    // Method Not Allowed:
    http_response_code(405);
}

mysqli_close($conn);

?>