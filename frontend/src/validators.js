

const validateSong = (song) => {    
    if (!song.name) {
        alert("Nie wypełniono wymaganego pola!");
        return false;    
    } else {
        var validSong = {};
        validSong.name = song.name;
        
        if (song.ALBUM) { validSong.album_id = song.ALBUM.id; } 
        else { validSong.album_id = null; }
        
        if (song.ARTISTS) { 
            if (song.ARTISTS.length > 0) {
                validSong.artists_ids = Array.from(song.ARTISTS, a => a.id); 
            } else {
                validSong.artists_ids = null;
            } 
        } else { validSong.artists_ids = null; } 
        
        if (song.danceability) { validSong.danceability = parseFloat(song.danceability)}
        else {validSong.danceability = 0;};

        validSong.explicit = parseInt(song.explicit);
        
        if (song.energy) { validSong.energy = parseFloat(song.energy)}
        else {validSong.energy = 0;};
        
        if (song.instrumentalness) { validSong.instrumentalness = parseFloat(song.instrumentalness)}
        else {validSong.instrumentalness = 0;};

        if (song.acousticness) { validSong.acousticness = parseFloat(song.acousticness)}
        else {validSong.acousticness = 0;};

        if (song.valence) { validSong.valence = parseFloat(song.valence)}
        else {validSong.valence = 0;};

        if (song.spotify_link) { validSong.spotify_link = song.spotify_link}
        else {validSong.spotify_link = null;};

        validSong.key = parseInt(song.key);

        validSong.mode = parseInt(song.mode);

        if (song.release_date) { validSong.release_date = song.release_date}
        else {validSong.release_date = null;};
    }

    return {
        category    : 'songs',
        obj         : validSong 
    };
}




export const validateItemBeforePost = (args) => {
    var category = args.category;
    var object = args.obj;
    var validatedObject = {};
        
    switch (category) {
        case 'songs':
            validatedObject = validateSong(object); 
            return validatedObject;
        case 'albums':
            alert('album!');
            break;
        case 'artists':
            alert('artysta!');
            break;
        default:
            alert("Niepoprawna kategoria publikowanego obiektu!");
    }
}