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
    if (isset($_GET['category']) && isset($_GET['limit']) && isset($_GET['page'])) {                
        
        $table = $_GET['category'];        
        $page = intval($_GET['page']);
        $limit = intval($_GET['limit']);
        $page_start = $limit * $page;

        switch ($_GET['category']) {
            case 'songs':
                $query = "SELECT 
                        songs.id,
                        songs.name,
                        songs.explicit,
                        songs.key,
                        songs.mode,
                        songs.danceability,
                        songs.energy,
                        songs.acousticness,
                        songs.instrumentalness,
                        songs.release_date,
                        songs.valence,
                        songs.spotify_link,
                        JSON_ARRAYAGG(artists.name) AS _artists_names,
                        -- JSON_ARRAYAGG(artists.id) AS _artists_ids,                        
                        -- JSON_ARRAYAGG(albums.id) AS _albums_ids,
                        JSON_ARRAYAGG(albums.name) AS _albums_names
                        FROM songs
                        LEFT JOIN recorded_by
                        ON songs.id = recorded_by.track_id
                        LEFT JOIN artists
                        ON artists.id = recorded_by.artist_id
                        LEFT JOIN belongs_to
                        ON artists.id = belongs_to.artist_id
                        LEFT JOIN albums
                        ON albums.id = belongs_to.album_id
                        GROUP BY songs.id
                        LIMIT ".$page_start.", ".$limit.";";                            
                break;         
            case 'albums':
                $query = "SELECT 
                        albums.id,
                        albums.name,
                        albums.release_date,
                        albums.spotify_link,
                        -- JSON_ARRAYAGG(artists.id) AS _artists_ids,
                        JSON_ARRAYAGG(artists.name) AS _artist_names
                        FROM albums
                        LEFT JOIN belongs_to
                        ON albums.id = belongs_to.album_id
                        LEFT JOIN artists
                        ON belongs_to.artist_id = artists.id
                        GROUP BY albums.id
                        LIMIT ".$page_start.", ".$limit.";";
                break;
            case 'artists':
                $query = "SELECT 
                        artists.id, 
                        artists.name,
                        artists.description,
                        artists.spotify_link,
                        countries.name AS _country_name
                        FROM artists
                        LEFT JOIN countries
                        ON artists.country = countries.iso_code
                        LIMIT ".$page_start.", ".$limit.";";
                break;
        }
        
        $result = mysqli_query($conn, $query);             
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
        // Bad Request:
        http_response_code(400);
    }
} else {
    // Method Not Allowed:
    http_response_code(405);
}

mysqli_close($conn);

?>