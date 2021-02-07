<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include "autoryzacja.php";
include "config.php";
include "create_relations.php";
 
/**
 * 
 * Skrypt sprawdza czy w $_POST została zdefiniowana 
 * kategoria dodawanego obiektu oraz jego id, jeśli tak - 
 * generuje unikalne id i wykonuje UPDATE na odpowiedniej
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
    if (isset($_GET['category']) && isset($_GET['id'])) {       
        $posted_data = file_get_contents("php://input");        

        $data = json_decode($posted_data, true);

        if (empty($data["name"])) {      
            http_response_code(400);  
        } else {
            $name = $data["name"];
            $uid = $_GET['id'];
        }

        switch ($_GET["category"]) {
            case 'songs':
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
                        
                $query = "UPDATE songs SET songs.name = ?, songs.album_id = ?, songs.danceability = ?, 
                    songs.energy = ?, songs.key = ?, songs.acousticness = ?, songs.instrumentalness = ?, 
                    songs.valence = ?, songs.mode = ?, songs.release_date = ?, songs.spotify_link = ? 
                    WHERE songs.id = ?";
                    
                $updateStatement = mysqli_prepare($conn, $query);
                mysqli_stmt_bind_param($updateStatement,'ssddidddisss',
                    $name,$album_id,$danceability,$energy,$key,$acousticness,
                    $instrumentalness, $valence,$mode,$release_date,$spotify_link,$uid); 
                $update_result = mysqli_stmt_execute($updateStatement);                    

                if (!$update_result) {
                    http_response_code(400);
                } else {                    
                    updateManyToMany(
                        $conn, 
                        $uid, 
                        $artists_ids, 
                        "recorded_by",
                        $query = "INSERT INTO recorded_by (`track_id`,`artist_id`) VALUES (?, ?)",
                        true);               
                }      
                break;
            case 'artists':                
                $description = $data["description"];                
                $country = $data["country"];
                $spotify_link = $data["spotify_link"];

                $songs_ids = $data["songs_ids"];
                $albums_ids = $data["albums_ids"];

                $query =  "UPDATE artists SET
                        artists.name = ?,
                        artists.description = ?,
                        artists.country = ?,
                        artists.spotify_link = ?
                        WHERE artists.id = ?";                                
                
                $updateStatement = mysqli_prepare($conn, $query);
                mysqli_stmt_bind_param($updateStatement,'sssss',
                    $name,$description,$country,$spotify_link,$uid); 
                $update_result = mysqli_stmt_execute($updateStatement);  
                
                if (!$update_result) {                    
                    http_response_code(400);
                } else {                    
                    updateManyToMany(
                        $conn, 
                        $uid, 
                        $songs_ids, 
                        "inv_recorded_by",
                        "INSERT INTO recorded_by (`artist_id`, `track_id`) VALUES (?, ?)",
                        true);                                    
                    updateManyToMany(
                        $conn, 
                        $uid, 
                        $albums_ids, 
                        "inv_belongs_to",
                        "INSERT INTO belongs_to (`artist_id`, `album_id`) VALUES (?, ?)",
                        true);                            
                }
                break;
            case 'albums':            
                $release_date = $data["release_date"];
                $spotify_link = $data["spotify_link"];

                $songs_ids = $data["songs_ids"];
                $artists_ids = $data["artists_ids"];

                $query =  "UPDATE albums SET                    
                    albums.name = ?,
                    albums.release_date = ?,
                    albums.spotify_link =  ?
                    WHERE albums.id = ?";
                    
                $updateStatement = mysqli_prepare($conn, $query);
                mysqli_stmt_bind_param($updateStatement,'ssss',
                    $name,$release_date,$spotify_link, $uid); 
                $update_result = mysqli_stmt_execute($updateStatement);  
                
                if (!$update_result) {                                       
                    http_response_code(400);
                } else {                    
                    updateManyToMany(
                        $conn, 
                        $uid, 
                        $artists_ids, 
                        "belongs_to",
                        "INSERT INTO belongs_to (`album_id`, `artist_id`) VALUES (?, ?)",
                        true);   
                    updateOneToMany(
                        $conn,
                        $uid,
                        $songs_ids,
                        true
                    );                   
                }
                break;
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

