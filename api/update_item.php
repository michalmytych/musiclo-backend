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
    if (isset($_GET['category']) && isset($_GET['id'])) {       
        $posted_data = file_get_contents("php://input");        

        $data = json_decode($posted_data, true);

        if (empty($data["name"])) {
            // Bad Request:            
            http_response_code(400);  
        } else {
            $name = stringifyOrSetNull($data["name"]);
            $uid = $_GET['id'];
        }

        switch ($_GET["category"]) {
            case 'songs':                
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

                $query =  "UPDATE songs SET                        
                        name = ".$name.",
                        album_id = ".$album_id.",
                        explicit = ".$explicit.",
                        danceability = ".$danceability.",
                        energy = ".$energy.",
                        songs.key = ".$key.",
                        mode = ".$mode.",
                        acousticness = ".$acousticness.",
                        instrumentalness =  ".$instrumentalness.",
                        valence = ".$valence.",
                        release_date = ".$release_date.",
                        spotify_link = ".$spotify_link."
                        WHERE songs.id = '".$uid."';";                

                $result = mysqli_query($conn,  $query);                
                updateArtistsOnSong($conn, $uid, $artists_ids, true);
                break;
            case 'artists':                
                $description = stringifyOrSetNull($data["description"]);                
                $country = stringifyOrSetNull($data["country"]);
                $spotify_link = stringifyOrSetNull($data["spotify_link"]);

                $songs_ids = stringifyOrSetNull($data["songs_ids"]);
                $albums_ids = stringifyOrSetNull($data["albums_ids"]);

                $query =  "UPDATE artists SET
                        name = ".$name.",
                        description = ".$description.",
                        country = ".$country.",
                        spotify_link = ".$spotify_link."
                        WHERE artists.id = '".$uid."';";                                
                
                $result = mysqli_query($conn,  $query);                
                updateSongsOnArtist($conn, $uid, $songs_ids, true);                
                updateAlbumsOnArtist($conn, $uid, $albums_ids, true);
                break;
            case 'albums':            
                $release_date = stringifyOrSetNull($data["release_date"]);
                $spotify_link = stringifyOrSetNull($data["spotify_link"]);

                $songs_ids = stringifyOrSetNull($data["songs_ids"]);
                $artists_ids = stringifyOrSetNull($data["artists_ids"]);

                $query =  "UPDATE albums SET                    
                    name = ".$name.",
                    release_date = ".$release_date.",
                    spotify_link =  ".$spotify_link."
                    WHERE albums.id = '".$uid."';";                  

                $result = mysqli_query($conn,  $query);                 
                updateArtistsOnAlbum($conn, $uid, $artists_ids, true);
                updateSongsOnAlbum($conn, $uid, $songs_ids, true);
                break;
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

