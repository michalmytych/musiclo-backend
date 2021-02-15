<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include "autoryzacja.php";
include "config.php";
include "queries.php";

/**
 * 
 * Skrypt sprawdza czy w $_POST zostały zdefiniowane:
 * limit    - limit rekordów zwracanych na jedną opowiedź
 * page     - numer porcji rekordów zwracanych w odpowiedzi
 * category - kategoria zwracanych obiektów (nazwa tabeli)
 * 
 * Jeśli wszystkie parametry zostały podane, skrypt zwraca
 * listę obiektów z danej kategorii.
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
    if (isset($_GET['category']) && isset($_GET['limit']) && isset($_GET['page'])) {                
        
        $table = $_GET['category'];        
        $page = intval($_GET['page']);
        $limit = intval($_GET['limit']);
        $page_start = $limit * $page;

        switch ($_GET['category']) {
            case 'songs':
                $query = $_GET_SONGS_LIST;                                            
                break;         
            case 'albums':
                $query = $_GET_ALBUMS_LIST;
                break;
            case 'artists':
                $query = $_GET_ARTISTS_LIST;
                break;
            default:
                http_response_code(400);
        }

        $selectStatement = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($selectStatement, "ii", $page, $limit);
        mysqli_stmt_execute($selectStatement);

        $result = mysqli_stmt_get_result($selectStatement);                  
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
        http_response_code(400);
    }
} else {
    http_response_code(405);
}

mysqli_close($conn);

?>