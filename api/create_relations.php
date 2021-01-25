<?php

function stringifyOrSetNull($value) {
    if (empty($value)) { 
        if (gettype($value) === "array" || gettype($value) === "NULL") {             
            return NULL;
        }        
        return 'NULL';
    } else {
        if (gettype($value) === "string") {
            return "'$value'";
        } else {
            return $value;
        }
    }
}

function generateRandomUniqueId() {
    $uid = uniqid("i", true);
    return "'$uid'";
}

function updateArtistsOnAlbum($conn, $album_id, $artists_ids, $updating) {
    /*

        PRZETESTOWANE NA CREATION I UPDATE

    */
    if ($updating) { $album_id = "'$album_id'"; }; 
    $clear_query = "DELETE FROM belongs_to 
                    WHERE belongs_to.album_id = ".$album_id."; ";                      

    if (!empty($artists_ids)) {               
        $query = "INSERT INTO belongs_to (`id`, `album_id`,`artist_id`) VALUES ";
        $count = count($artists_ids);
        foreach ($artists_ids as $art_id) {
            $query = $query . " (NULL, ".$album_id.", '".$art_id."')";
            if (--$count > 0) {
                $query =  $query . ",";
            }
        }        
        $query = $query . ";";        
        $result = mysqli_query($conn,  $clear_query);
        $result = mysqli_query($conn,  $query);
        if (!$updating) {             
            http_response_code(201); return;
        } else {
            http_response_code(200); return;
        }
    } else {
        if ($updating) {
            $result = mysqli_query($conn, $clear_query);                    
            http_response_code(200); return;
        } else {
            http_response_code(200); return;
        }     
    }
}

function updateSongsOnAlbum($conn, $album_id, $songs_ids, $updating) {
    /*
        PRZETESTOWANE NA CREATION I UPDATE
    
        Wykonuję dodatkowe zapytanie sprawdzające 
        czy wybrane piosenki nie mają przypisanego 
        albumu, ponieważ muszą pozostawać z albumami
        w relacjach 1 do 1.
        
        Dodatkowo możliwość dodawania tej samej
        piosenki do wielu albumów powinna być
        ograniczona po stronie interfejsu użytkownika
        poprzez filtrowanie (możliwość wybierania
        tylko tych piosenek, których wartość
        pola album_id jest równa null).
    */    
    if ($updating) { $album_id = "'$album_id'"; };

    $chk_query = "SELECT 
        COUNT(songs.id) 
        AS songs_avaiable
        FROM songs
        WHERE songs.album_id IS NULL 
        AND ";      

    $_count = count($songs_ids);
    if (!empty($songs_ids)) {        
        foreach ($songs_ids as $_song_id) {
            $chk_query = $chk_query . "songs.id = '".$_song_id."'";
            if (--$_count > 0) {
                $chk_query = $chk_query . " OR ";
            }
        }        
        
        $chk_query = $chk_query . ";";
        $result = mysqli_query($conn,  $chk_query);        

        while($row = mysqli_fetch_array($result)) {
            if (intval($row['songs_avaiable']) !== intval(count($songs_ids))) {
                http_response_code(400); exit();
            }
        }           
        
        $query = "UPDATE songs SET songs.album_id = ".$album_id." WHERE ";        
        $count = count($songs_ids);

        foreach ($songs_ids as $song_id) {
            $query = $query . " songs.id = '".$song_id."'";
            if (--$count > 0) {
                $query = $query . " OR ";
            }
        }
        $query = $query . ";";        
        $result = mysqli_query($conn,  $query);
    
        if (!$updating) { 
            http_response_code(201); exit(); 
        } else {
            http_response_code(200); exit();
        }  
    } else {
        if ($updating) {
            $clear_query = "UPDATE songs SET songs.album_id = NULL WHERE songs.album_id = ".$album_id."";
            $result = mysqli_query($conn,  $clear_query);        
            if (mysqli_affected_rows($conn) > 0) { 
                http_response_code(200); exit(); 
            } else {                
                http_response_code(400); exit(); 
            }
        }        
    }
}

function updateArtistsOnSong($conn, $track_id, $artists_ids, $updating) {
    /*

        PRZETESTOWANE NA CREATION I UPDATE

    */
    if ($updating) { $track_id = "'$track_id'"; };                                 
    $clear_query = "DELETE FROM recorded_by 
                    WHERE recorded_by.track_id = ".$track_id."; ";      
    if (!empty($artists_ids)) {        
        $query = "INSERT INTO recorded_by (`id`, `track_id`,`artist_id`) VALUES ";
        $count = count($artists_ids);
        foreach ($artists_ids as $art_id) {
            $query = $query . " (NULL, ".$track_id.", '".$art_id."')";
            if (--$count > 0) {
                $query = $query . ",";
            }
        }
        $query = $query . ";";
        
        $result1 = mysqli_query($conn,  $clear_query);
        $result2 = mysqli_query($conn,  $query);
        if (!$updating) { 
            http_response_code(201); exit(); 
        } else {
            http_response_code(200); exit();
        }     
    } else {    
        echo $query; quit();
        if ($updating) {
            $result = mysqli_query($conn,  $clear_query);                    
            if (mysqli_affected_rows($conn) > 0) { 
                http_response_code(200); exit(); 
            } else {                
                http_response_code(400); exit(); 
            }
        } else {
            http_response_code(200); exit(); 
        }
    }
}






function updateAlbumsOnArtist($conn, $artist_id, $albums_ids, $updating) {
    /*

        PRZETESTOWANE NA CREATION

    */    
    if ($updating) { $artist_id = "'$artist_id'"; };
    $clear_query = "DELETE FROM belongs_to 
                    WHERE belongs_to.artist_id = ".$artist_id."; ";   
    if (!empty($albums_ids)) {                 
        $query = "INSERT INTO belongs_to (`id`, `album_id`,`artist_id`) VALUES ";
        $count = count($albums_ids);
        foreach ($albums_ids as $album_id) {
            $query = $query . " (NULL, '".$album_id."', ".$artist_id.")";
            if (--$count > 0) {
                $query = $query . ",";
            }
        }
        $query = $query . ";";
        $result = mysqli_query($conn,  $clear_query);
        $result = mysqli_query($conn,  $query);

        if (mysqli_affected_rows($conn) > 0) { 
            http_response_code(200); 
        } else {        
            if (!$result) { http_response_code(400); };
        }
    } else {
        if ($updating) {
            $result = mysqli_query($conn,  $clear_query);
            if (mysqli_affected_rows($conn) > 0) { 
                http_response_code(200); 
            } else {        
                if (!$result) { http_response_code(400); };
            }
        }
    } 
}

function updateSongsOnArtist($conn, $artist_id, $tracks_ids, $updating) {
    /*

        PRZETESTOWANE NA CREATION I UPDATE

    */
    if ($updating) { $artist_id = "'$artist_id'"; };
    $clear_query = "DELETE FROM recorded_by 
                    WHERE recorded_by.artist_id = ".$artist_id."; ";   
    
    if (!empty($tracks_ids)) { 
        $query = "INSERT INTO recorded_by (`id`, `track_id`,`artist_id`) VALUES ";
        $count = count($tracks_ids);
        foreach ($tracks_ids as $track_id) {
            $query = $query . " (NULL, '".$track_id."', ".$artist_id.")";
            if (--$count > 0) {
                $query = $query . ",";
            }
        }
        $query = $query . ";";  
        $result = mysqli_query($conn,  $clear_query);      
        $result = mysqli_query($conn,  $query);

        if (mysqli_affected_rows($conn) > 0) { 
            http_response_code(201);             
        } else {
            if (!$result) { http_response_code(400); };
        }        
    } else {
        if ($updating) {
            $result = mysqli_query($conn,  $clear_query);
            if (mysqli_affected_rows($conn) > 0) { 
                http_response_code(200); 
            } else {        
                http_response_code(201); 
            }     
        }   
    }
}


?>
