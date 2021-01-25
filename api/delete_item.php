<?php

include "autoryzacja.php";
include "config.php";


if ($_DEBUG_MODE_) {    // defined in config.php
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
                            
            $query = "DELETE FROM ".$_GET['category']." WHERE ".$_GET['category'].".id = '".$_GET['id']."';";
            $result = mysqli_query($conn, $query);

            if (mysqli_affected_rows($conn) <= 0) {
                http_response_code(404);
            } else {
                http_response_code(200);
            }
        } else {
                // Bad Request: 
                http_response_code(400);  
        }         
    } else {
        http_response_code(400);   
    }
} 
else {
    // Method Not Allowed:
    http_response_code(405);
}

mysqli_close($conn);


?>

