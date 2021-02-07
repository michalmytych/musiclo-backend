<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include "autoryzacja.php";
include "config.php";

/**
 * 
 * Skrypt zwraca listę krajów z której każdy element
 * jest obiektem json zawierajcym kod iso kraju i jego nazwę.
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

mysqli_query($conn, 'SET NAMES utf-8');

if($_SERVER['REQUEST_METHOD'] === 'GET') {                       
    $query = "SELECT * FROM countries ORDER BY countries.name ASC";
    
    $result = mysqli_query($conn, $query);             
    $arr = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
        $row = array_map('utf8_encode', $row);            
        $arr[] = $row;
    }
    
    echo json_encode($arr);
} else {
    http_response_code(405);
}

mysqli_close($conn);

?>