<?php

header("Access-Control-Allow-Origin: https://wierzba.wzks.uj.edu.pl/");

include "autoryzacja.php";
include "config.php";
include "queries.php";

/**
 * 
 * Skrypt zwraca liczbę rekordów dla tabel
 * songs, albums oraz artists.
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
    $query = $_COUNT_RECORDS;
    
    $result = mysqli_query($conn, $_COUNT_RECORDS);

    $arr = array();
    
    while($row = mysqli_fetch_assoc($result))
    {      
        $arr[] = $row;
    }
    
    echo json_encode($arr);    
} 
else {
    http_response_code(405);
}

mysqli_close($conn);


?>

