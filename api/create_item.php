<?php

include "autoryzacja.php";
include "config.php";
include "create_relations.php";

if ($_DEBUG_MODE_) {    // defined in config.php
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
} else {
    error_reporting(0);
}

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname)
    or die('Błąd połączenia z serwerem bazy danych: '.mysqli_connect_error());


if($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET["category"])) {
        $posted_data = file_get_contents("php://input");

        $data = json_decode($posted_data, true);
        $name = $data["name"];

        if (empty($name)) {
            // Bad Request:
            http_response_code(400); exit();
        } else {
            $name = stringifyOrSetNull($name);
        }

        switch ($_GET["category"]) {
            case 'songs':
                $uid = generateRandomUniqueId();

                // Change later to array_map() with stringifyOrSetNull() as callback fx
                $album_id = stringifyOrSetNull($data["album_id"]);
                $explicit = stringifyOrSetNull($data["explicit"]);
                $danceability = stringifyOrSetNull($data["danceability"]);
                $energy = stringifyOrSetNull($data["energy"]);
                $key = stringifyOrSetNull($data["key"]);
                $mode = stringifyOrSetNull($data["mode"]);
                $acousticness = stringifyOrSetNull($data["acousticness"]);
                $instrumentalness = stringifyOrSetNull($data["instrumentalness"]);
                $valence = stringifyOrSetNull($data["valence"]);
                $release_date = stringifyOrSetNull($data["release_date"]);
                $spotify_link = stringifyOrSetNull($data["spotify_link"]);

                $artists_ids = stringifyOrSetNull($data["artists_ids"]);

                $query =  "INSERT INTO songs (
                        `id`,
                        `name`,
                        `album_id`,
                        `explicit`,
                        `danceability`,
                        `energy`,
                        `key`,
                        `mode`,
                        `acousticness`,
                        `instrumentalness`,
                        `valence`,
                        `release_date`,
                        `spotify_link`) 
                    VALUES (
                        ".$uid.",
                        ".$name.",
                        ".$album_id.",
                        ".$explicit.",
                        ".$danceability.",
                        ".$energy.",
                        ".$key.",
                        ".$mode.",
                        ".$acousticness.",
                        ".$instrumentalness.",
                        ".$valence.",
                        ".$release_date.",
                        ".$spotify_link."
                    );";                

                $result = mysqli_query($conn,  $query);
                updateArtistsOnSong($conn, $uid, $artists_ids, false);
                break;
            case 'artists':
                $uid = generateRandomUniqueId();
                
                $description = stringifyOrSetNull($data["description"]);                
                $country = stringifyOrSetNull($data["country"]);
                $spotify_link = stringifyOrSetNull($data["spotify_link"]);

                $songs_ids = stringifyOrSetNull($data["songs_ids"]);
                $albums_ids = stringifyOrSetNull($data["albums_ids"]);

                $query =  "INSERT INTO artists (
                    `id`,
                    `name`,
                    `description`,
                    `country`,
                    `spotify_link`) 
                VALUES (
                    ".$uid.",
                    ".$name.",
                    ".$description.",
                    ".$country.",
                    ".$spotify_link."
                );";                                

                $result = mysqli_query($conn,  $query);                

                if (mysqli_affected_rows($conn) > 0) {
                    // Jeśli artysta został utworzony można zbudować relacje
                    updateSongsOnArtist($conn, $uid, $songs_ids, false);                    
                    updateAlbumsOnArtist($conn, $uid, $albums_ids, false);
                } else { 
                    http_response_code(400); 
                } break;
            case 'albums':
                $uid = generateRandomUniqueId();
                
                $release_date = stringifyOrSetNull($data["release_date"]);
                $spotify_link = stringifyOrSetNull($data["spotify_link"]);

                $songs_ids = stringifyOrSetNull($data["songs_ids"]);
                $artists_ids = stringifyOrSetNull($data["artists_ids"]);

                $query =  "INSERT INTO albums (
                    `id`,
                    `name`,
                    `release_date`,
                    `spotify_link`) 
                VALUES (
                    ".$uid.",
                    ".$name.",
                    ".$release_date.",
                    ".$spotify_link."
                );";
                
                $result = mysqli_query($conn,  $query); 

                if (mysqli_affected_rows($conn) > 0) {
                    // Jeśli album został utworzony można zbudować relacje
                    updateArtistsOnAlbum($conn, $uid, $artists_ids, false);                    
                    updateSongsOnAlbum($conn, $uid, $songs_ids, false);
                } else { 
                    http_response_code(400); 
                } break;
        }                       
    } else {
        // Bad Request:
        http_response_code(400);   
    }
} 
else {
    // Method Not Allowed:
    http_response_code(405);
}

mysqli_close($conn);


?>

