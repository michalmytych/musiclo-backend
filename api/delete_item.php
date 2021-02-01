<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include "autoryzacja.php";
include "config.php";

/**
 * 
 * Skrypt sprawdza czy w $_POST została zdefiniowana 
 * kategoria usuwanego obiektu, oraz jego id - 
 * jeśli tak, wykonuje zapytanie DELETE na odpowiedniej
 * tabeli i zwraca kod 200 jeśli zapytanie powiodło się.
 * W przeciwnym razie zwraca 404.
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

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['category']) && isset($_GET['id'])) {        
        if ($_GET['category'] === 'songs' 
            || $_GET['category'] === 'artists' 
                || $_GET['category'] === 'albums') {    

            $category = $_GET['category'];
            $id = $_GET['id'];
                                        
            switch ($category) {
                case "songs":
                    $query = "DELETE FROM songs WHERE songs.id = ?"; break;
                case "artists":
                    $query = "DELETE FROM artists WHERE artists.id = ?"; break;
                case "albums":    
                    $query = "DELETE FROM albums WHERE albums.id = ?"; break;
                default:
                    http_response_code(400);
            }

            $deleteStatement = mysqli_prepare($conn, $query);
            mysqli_stmt_bind_param($deleteStatement, "s", $id);
            mysqli_stmt_execute($deleteStatement);

            if (mysqli_stmt_affected_rows($deleteStatement) <= 0) {
                http_response_code(404);
            } else {
                http_response_code(200);
            }
        } else {
                http_response_code(400);  
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

