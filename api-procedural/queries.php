<?php


$_GET_COUNTRIES_LIST = "SELECT * FROM countries ORDER BY countries.name ASC";


$_BASE_SONG_SELECT = "SELECT 
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
          ON artists.id = recorded_by.artist_id ";


$_BASE_ALBUM_SELECT = "SELECT
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
          ON belongs_to.artist_id = artists.id ";


$_BASE_ARTIST_SELECT = "SELECT
          artists.id,
          artists.name,
          artists.description,
          artists.spotify_link,
          JSON_ARRAYAGG(albums.name) AS _albums_names,
          JSON_ARRAYAGG(albums.id) AS _albums_ids,
          countries.name AS _country_name,
          countries.iso_code AS _country
          FROM artists
          LEFT JOIN belongs_to
          ON artists.id = belongs_to.artist_id
          LEFT JOIN albums
          ON belongs_to.album_id = albums.id
          LEFT JOIN countries
          ON artists.country = countries.iso_code ";


$_GET_SONGS_LIST = $_BASE_SONG_SELECT . "GROUP BY songs.id ORDER BY songs.created_at DESC LIMIT ?, ?";  


$_GET_ALBUMS_LIST = $_BASE_ALBUM_SELECT . "GROUP BY albums.id ORDER BY albums.created_at DESC LIMIT ?, ?";


$_GET_ARTISTS_LIST = $_BASE_ARTIST_SELECT . "GROUP BY artists.id ORDER BY artists.created_at DESC LIMIT ?, ?";


$_SEARCH_SONG = "SELECT songs.id, songs.name, songs.explicit, songs.key,
          songs.mode, songs.danceability, songs.energy, songs.acousticness, 
          songs.instrumentalness, songs.release_date, songs.valence, songs.spotify_link,
          albums.name AS album_name,
          songs.album_id AS album_id,
          JSON_ARRAYAGG(artists.name) AS _artists_names,
          JSON_ARRAYAGG(artists.id) AS _artists_ids
          FROM songs LEFT JOIN albums
          ON songs.album_id = albums.id                                                  
          LEFT JOIN recorded_by
          ON songs.id = recorded_by.track_id
          LEFT JOIN artists
          ON artists.id = recorded_by.artist_id                        
          WHERE songs.name LIKE ? GROUP BY songs.id
          UNION SELECT songs.id, songs.name, songs.explicit, songs.key,
          songs.mode, songs.danceability, songs.energy, songs.acousticness, 
          songs.instrumentalness, songs.release_date, songs.valence, songs.spotify_link,
          albums.name AS album_name,
          songs.album_id AS album_id,
          JSON_ARRAYAGG(artists.name) AS _artists_names,
          JSON_ARRAYAGG(artists.id) AS _artists_ids
          FROM songs LEFT JOIN albums
          ON songs.album_id = albums.id                                                  
          LEFT JOIN recorded_by
          ON songs.id = recorded_by.track_id
          LEFT JOIN artists
          ON artists.id = recorded_by.artist_id                        
          WHERE songs.name LIKE ? GROUP BY songs.id LIMIT 25";


$_SEARCH_ALBUM = "SELECT albums.id, albums.name, 
          albums.spotify_link, albums.release_date,
          JSON_ARRAYAGG(artists.name) AS _artist_names,
          JSON_ARRAYAGG(artists.id) AS _artist_ids
          FROM albums LEFT JOIN belongs_to
          ON albums.id = belongs_to.album_id
          LEFT JOIN artists
          ON belongs_to.artist_id = artists.id
          WHERE albums.name LIKE ? GROUP BY albums.id 
          UNION SELECT albums.id, albums.name, 
          albums.spotify_link, albums.release_date,
          JSON_ARRAYAGG(artists.name) AS _artist_names,
          JSON_ARRAYAGG(artists.id) AS _artist_ids
          FROM albums LEFT JOIN belongs_to
          ON albums.id = belongs_to.album_id
          LEFT JOIN artists
          ON belongs_to.artist_id = artists.id
          WHERE albums.name LIKE ? GROUP BY albums.id LIMIT 25";


$_SEARCH_ARTIST = "SELECT artists.id, artists.name, artists.spotify_link,
          JSON_ARRAYAGG(albums.name) AS _albums_names,
          JSON_ARRAYAGG(albums.id) AS _albums_ids,
          countries.name AS _country_name,
          countries.iso_code AS _country
          FROM artists
          LEFT JOIN belongs_to
          ON artists.id = belongs_to.artist_id
          LEFT JOIN albums
          ON belongs_to.album_id = albums.id
          LEFT JOIN countries
          ON artists.country = countries.iso_code
          WHERE
          artists.name LIKE ? UNION
          SELECT artists.id, artists.name, artists.spotify_link,
          JSON_ARRAYAGG(albums.name) AS _albums_names,
          JSON_ARRAYAGG(albums.id) AS _albums_ids,
          countries.name AS _country_name,
          countries.iso_code AS _country
          FROM artists
          LEFT JOIN belongs_to
          ON artists.id = belongs_to.artist_id
          LEFT JOIN albums
          ON belongs_to.album_id = albums.id
          LEFT JOIN countries
          ON artists.country = countries.iso_code
          WHERE artists.name LIKE ? GROUP BY artists.id LIMIT 25";


$_GET_SONGS_OF_ALBUM = "SELECT * FROM songs WHERE songs.album_id = ?";


$_UPDATE_SONG = "UPDATE songs SET 
          songs.name = ?, 
          songs.explicit = ?, 
          songs.album_id = ?, 
          songs.danceability = ?, 
          songs.energy = ?, 
          songs.key = ?, 
          songs.acousticness = ?, 
          songs.instrumentalness = ?, 
          songs.valence = ?, 
          songs.mode = ?, 
          songs.release_date = ?, 
          songs.spotify_link = ? 
          WHERE songs.id = ?";


$_UPDATE_ALBUM = "UPDATE albums SET                    
          albums.name = ?,
          albums.release_date = ?,
          albums.spotify_link =  ?
          WHERE albums.id = ?";


$_UPDATE_ARTIST = "UPDATE artists SET
          artists.name = ?,
          artists.description = ?,
          artists.country = ?,
          artists.spotify_link = ?
          WHERE artists.id = ?"; 


$_DELETE_SONG = "DELETE FROM songs WHERE songs.id = ?";


$_DELETE_ALBUM = "DELETE FROM albums WHERE albums.id = ?";


$_DELETE_ARTIST = "DELETE FROM artists WHERE artists.id = ?";


$_CREATE_SONG = "INSERT INTO songs (
         `id`,
         `name`,
         `explicit`,
         `album_id`,
         `danceability`,
         `energy`,
         `key`,
         `mode`,
         `acousticness`,
         `instrumentalness`,
         `valence`,
         `release_date`,
         `spotify_link`) 
         VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";


$_CREATE_ARTIST = "INSERT INTO artists (
         `id`,
         `name`,
         `description`,
         `country`,
         `spotify_link`) 
         VALUES (?, ?, ?, ?, ?)";  


$_CREATE_ALBUM = "INSERT INTO albums (
         albums.id,
         albums.name,
         albums.release_date,
         albums.spotify_link )
         VALUES (?, ?, ?, ?)";  


$_COUNT_RECORDS = "SELECT 'songs' AS category, 
         count(songs.id) AS 'count' from songs
         UNION SELECT 'albums', count(albums.id) from albums
         UNION SELECT 'artists', count(artists.id) from artists;";


$_GET_SONG = $_BASE_SONG_SELECT . "WHERE songs.id = ?";  


$_GET_ALBUM = $_BASE_ALBUM_SELECT . "WHERE albums.id = ?";  


$_GET_ARTIST = $_BASE_ARTIST_SELECT . "WHERE artists.id = ?";

?>