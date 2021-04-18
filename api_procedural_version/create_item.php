<?php

header("Access-Control-Allow-Origin: https://wierzba.wzks.uj.edu.pl/");

include "autoryzacja.php";
include "config.php";
include "create_relations.php";
include "queries.php";

/**
 * 
 * Skrypt sprawdza czy w $_POST została zdefiniowana 
 * kategoria dodawanego obiektu, jeśli tak - 
 * generuje unikalne id i wykonuje INSERT na odpowiedniej
 * tabeli w bazie danych. Listy powiązanych relacjami
 * obiektów z innych tabel które pojawiły się w otrzymanym
 * przez skrypt JSON-ie są przekazywane do funkcji
 * updateManyToMany lub updateOneToMany z pliku
 * update_realtions.php, które aktualizują relacje
 * między tabelami.
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

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET["category"])) {
        $posted_data = file_get_contents("php://input");
        $data = json_decode($posted_data, true);

        $name = $data["name"]; 
        if (empty($name)) {
            http_response_code(400); exit();
        }

        switch ($_GET["category"]) {
            case 'songs':                
                $uid = generateRandomUniqueId();                

                $explicit = $data["explicit"];
                $danceability = $data["danceability"];
                $energy = $data["energy"];
                $key = $data["key"];
                $acousticness = $data["acousticness"];
                $instrumentalness = $data["instrumentalness"];
                $valence = $data["valence"];
                $album_id = $data["album_id"];
                $mode = $data["mode"];
                $release_date = $data["release_date"];
                $spotify_link = $data["spotify_link"];

                $artists_ids = $data["artists_ids"];

                $query = $_CREATE_SONG;                
                            
                $insertStatement = mysqli_prepare($conn, $query);
                mysqli_stmt_bind_param($insertStatement,'ssisddiidddss',
                    $uid,$name,$explicit,$album_id,$danceability,$energy,$key,$mode,
                    $acousticness,$instrumentalness,$valence,$release_date,
                    $spotify_link);                     
                mysqli_stmt_execute($insertStatement);                

                if (mysqli_stmt_affected_rows($insertStatement) <= 0) {                    
                    http_response_code(400);                    
                } else {                    
                    updateManyToMany(
                        $conn, 
                        $uid, 
                        $artists_ids, 
                        "recorded_by",
                        $query = "INSERT INTO recorded_by (`track_id`,`artist_id`) VALUES (?, ?)",
                        false);               
                }                                                                                                                
                break;
            case 'artists':
                $uid = generateRandomUniqueId();
                
                $description = $data["description"];                
                $country = $data["country"];
                $spotify_link = $data["spotify_link"];

                $songs_ids = $data["songs_ids"];
                $albums_ids = $data["albums_ids"];

                $query =  $_CREATE_ARTIST;                                
                
                $insertStatement = mysqli_prepare($conn, $query);
                mysqli_stmt_bind_param($insertStatement,'sssss',
                    $uid,$name,$description,$country,$spotify_link); 
                mysqli_stmt_execute($insertStatement);                            

                if (mysqli_stmt_affected_rows($insertStatement) <= 0) {                    
                    http_response_code(400);
                } else {                    
                    updateManyToMany(
                        $conn, 
                        $uid, 
                        $songs_ids, 
                        "recorded_by",
                        "INSERT INTO recorded_by (`artist_id`, `track_id`) VALUES (?, ?)",
                        false);                                    
                    updateManyToMany(
                        $conn, 
                        $uid, 
                        $albums_ids, 
                        "belongs_to",
                        "INSERT INTO belongs_to (`artist_id`, `album_id`) VALUES (?, ?)",
                        false);                            
                }
                break;
            case 'albums':
                $uid = generateRandomUniqueId();                
                
                $release_date = $data["release_date"];
                $spotify_link = $data["spotify_link"];
                
                $artists_ids = $data["artists_ids"];
                $songs_ids = $data["songs_ids"];

                $query = $_CREATE_ALBUM;              

                $insertStatement = mysqli_prepare($conn, $query);
                mysqli_stmt_bind_param($insertStatement,'ssss',$uid,$name,$release_date,$spotify_link); 
                mysqli_stmt_execute($insertStatement);

                if (mysqli_stmt_affected_rows($insertStatement) <= 0) {                                       
                    http_response_code(400);
                } else {                    
                    updateManyToMany(
                        $conn, 
                        $uid, 
                        $artists_ids, 
                        "belongs_to",
                        "INSERT INTO belongs_to (`album_id`, `artist_id`) VALUES (?, ?)",
                        false);   
                    updateOneToMany(
                        $conn,
                        $uid,
                        $songs_ids,
                        false
                    );                   
                }
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

