

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
                validSong.artists_ids = [];
            } 
        } else { validSong.artists_ids = []; } 
        
        if (song.danceability) { validSong.danceability = parseFloat(song.danceability)}
        else {validSong.danceability = 0;};

        if (!song.explicit || song.explicit==='false' || song.explicit==='NaN') {
            validSong.explicit = 0;
        } else {
            validSong.explicit = parseInt(song.explicit);
        }     
        
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

        if (song.key) { validSong.key = parseInt(song.key);}
        else {validSong.key = null;};

        if (!song.mode && song.mode!==0 && song.mode!=="0") { validSong.mode = parseInt(song.mode); }
        else { validSong.mode = null;}

        if (song.release_date) { validSong.release_date = song.release_date}
        else {validSong.release_date = null;};
    }

    console.log(validSong);

    return {
        category    : 'songs',
        obj         :  validSong 
    };
}


const validateAlbum = (album) => {    
    if (!album.name) {
        alert("Nie wypełniono wymaganego pola!");
        return false;    
    } else {
        var validAlbum = {};
        validAlbum.name = album.name;

        if (album.ARTISTS) {
            if (album.ARTISTS.length > 0) {
                validAlbum.artists_ids = Array.from(album.ARTISTS, a => a.id); 
            } else {
                validAlbum.artists_ids = [];
            } 
        } else { validAlbum.artists_ids = []; } 

        if (album.SONGS) {
            if (album.SONGS.length > 0) {
                validAlbum.artists_ids = Array.from(album.SONGS, a => a.id); 
            } else {
                validAlbum.artists_ids = [];
            } 
        } else { validAlbum.artists_ids = []; }  

        if (!album.explicit || album.explicit==='false' || album.explicit==='NaN') {
            validAlbum.explicit = 0;
        } else {
            validAlbum.explicit = parseInt(album.explicit);
        }    
        
        if (album.release_date) { validAlbum.release_date = album.release_date}
        else {validAlbum.release_date = null;};

        if (album.spotify_link) { validAlbum.spotify_link = album.spotify_link}
        else {validAlbum.spotify_link = null;};        

        console.log(validAlbum);
    }
    return {
        category    : 'albums',
        obj         :  validAlbum 
    };
}


const validateArtist = (artist) => {    
    if (!artist.name) {
        alert("Nie wypełniono wymaganego pola!");
        return false;    
    } else {
        var validArtist = {};
        validArtist.name = artist.name; 
        
        if (artist.ALBUMS) {
            if (artist.ALBUMS.length > 0) {
                validArtist.artists_ids = Array.from(artist.ALBUMS, a => a.id); 
            } else {
                validArtist.artists_ids = [];
            } 
        } else { validArtist.artists_ids = []; }         

        if (artist.description) { validArtist.description = artist.description}
        else {validArtist.description = null;};

        if (artist.country) { validArtist.country = artist.country}
        else {validArtist.country = null;};    
        
        if (artist.spotify_link) { validArtist.spotify_link = artist.spotify_link}
        else {validArtist.spotify_link = null;};             
    }
    return {
        category    : 'artists',
        obj         :  validArtist
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
            validatedObject = validateAlbum(object); 
            return validatedObject;
        case 'artists':
            validatedObject = validateArtist(object); 
            return validatedObject;
        default:
            alert("Niepoprawna kategoria publikowanego obiektu!");
    }
}