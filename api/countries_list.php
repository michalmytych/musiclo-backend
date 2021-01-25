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

mysqli_query($conn, 'SET NAMES utf-8');

if($_SERVER['REQUEST_METHOD'] === 'GET') {                       
    $query = "SELECT * FROM countries;";
    
    $result = mysqli_query($conn, $query);             
    $arr = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
        $row = array_map('utf8_encode', $row);            
        $arr[] = $row;
    }
    
    echo json_encode($arr);
} else {
    // Method Not Allowed:
    http_response_code(405);
}

mysqli_close($conn);

?>