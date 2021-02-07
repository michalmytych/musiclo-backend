<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include "autoryzacja.php";
include "config.php";

/**
 * 
 * Skrypt sprawdza czy w $_POST zostały zdefiniowane:
 * limit    - limit rekordów zwracanych na jedną opowiedź
 * page     - numer porcji rekordów zwracanych w odpowiedzi
 * category - kategoria zwracanych obiektów (nazwa tabeli)
 * 
 * Jeśli wszystkie parametry zostały podane, skrypt zwraca
 * listę obiektów z danej kategorii.
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
                        albums.name AS album_name,
                        songs.album_id AS album_id,
                        JSON_ARRAYAGG(artists.name) AS _artists_names,
                        JSON_ARRAYAGG(artists.id) AS _artists_ids
                        FROM songs
                        LEFT JOIN albums
                        ON songs.album_id = albums.id                                                  
                        LEFT JOIN recorded_by
                        ON songs.id = recorded_by.track_id
                        LEFT JOIN artists
                        ON artists.id = recorded_by.artist_id                                                
                        GROUP BY songs.id
                        ORDER BY songs.created_at DESC
                        LIMIT ?, ?";                                            
                break;         
            case 'albums':
                $query = "SELECT
                        albums.id,
                        albums.name,
                        albums.release_date,
                        albums.spotify_link,
                        JSON_ARRAYAGG(artists.name) AS _artist_names,
                        JSON_ARRAYAGG(artists.id) AS _artist_ids
                        FROM albums
                        LEFT JOIN belongs_to
                        ON albums.id = belongs_to.album_id
                        LEFT JOIN artists
                        ON belongs_to.artist_id = artists.id
                        GROUP BY albums.id
                        ORDER BY albums.created_at DESC
                        LIMIT ?, ?";
                break;
            case 'artists':
                $query = "SELECT
                        artists.id,
                        artists.name,
                        artists.description,
                        artists.spotify_link,
                        JSON_ARRAYAGG(albums.name) AS _albums_names,
                        JSON_ARRAYAGG(albums.id) AS _albums_ids,
                        countries.name AS _country_name
                        FROM artists
                        LEFT JOIN belongs_to
                        ON artists.id = belongs_to.artist_id
                        LEFT JOIN albums
                        ON belongs_to.album_id = albums.id
                        LEFT JOIN countries
                        ON artists.country = countries.iso_code
                        GROUP BY artists.id
                        ORDER BY artists.created_at DESC
                        LIMIT ?, ?";
                break;
            default:
                http_response_code(400);
        }

        $selectStatement = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($selectStatement, "ii", $page, $limit);
        mysqli_stmt_execute($selectStatement);

        $result = mysqli_stmt_get_result($selectStatement);                  
        $arr = array();
        
        while($row = mysqli_fetch_assoc($result))
        {            
            $row = array_map(function($value) {
                return $value === "" ? NULL : $value;
            }, $row);

            $arr[] = $row;
        }

        echo json_encode($arr);
    } else {
        http_response_code(400);
    }
} else {
    http_response_code(405);
}

mysqli_close($conn);

?>