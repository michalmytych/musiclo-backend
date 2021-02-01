<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include "autoryzacja.php";
include "config.php";

/**
 * 
 * Skrypt sprawdza czy w $_POST zostało zdefiniowane
 * id będące identyfikatorem albumu.
 * Jeśli parametr został podany, skrypt zwraca
 * listę piosenek powiązanych relacją z albumem
 * określonym przez wartość z parametru id.
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

mysqli_query($conn, 'SET NAMES utf-8');

if($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {                        
        $album_id = $_GET['id'];        

        $query = "SELECT * FROM songs WHERE songs.album_id = ?";
        
        $selectStatement = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($selectStatement, "s", $album_id);
        mysqli_stmt_execute($selectStatement);

        $result = mysqli_stmt_get_result($selectStatement);                  
        $arr = array();
        
        while($row = mysqli_fetch_assoc($result))
        {
            $row = array_map('utf8_encode', $row);
            
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