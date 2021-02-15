<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include "autoryzacja.php";
include "config.php";
include "queries.php";

/**
 * 
 * Skrypt sprawdza czy w $_POST została zdefiniowana 
 * kategoria usuwanego obiektu, oraz jego id - 
 * jeśli tak, wykonuje zapytanie SELECT na odpowiedniej
 * tabeli i zwraca obiekt rekordu dopasowanego po id
 * w formacie JSON. W przypadku nie znalezienia pasującego
 * rekordu zwraca kod http 404.
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

if($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['category']) && isset($_GET['id'])) {          
        $category = $_GET['category'];
        $id = $_GET['id'];
                                    
        switch ($category) {
            case "songs":
                $query = $_GET_SONG; break;
            case "artists":
                $query = $_GET_ARTIST; break;
            case "albums":    
                $query = $_GET_ALBUM; break;
            default:
                http_response_code(400);
        }
        $selectStatement = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($selectStatement, "s", $id);
        mysqli_stmt_execute($selectStatement);

        $result = mysqli_stmt_get_result($selectStatement);   
        $item = mysqli_fetch_assoc($result);
        
        if (mysqli_stmt_affected_rows($selectStatement) <= 0) {
            http_response_code(404);
        } else {
            echo json_encode($item);
        }       
    } else {
        http_response_code(400);   
    }
} 
else {
    http_response_code(405);
}

mysqli_close($conn);


?>

