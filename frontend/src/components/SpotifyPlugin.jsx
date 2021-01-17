import React from 'react'


const constructSpotifyLink = (category, link) => {
    var id = link.substring(link.length - 22);
    switch (category) {
        case 'songs':
            return "https://open.spotify.com/embed/track/" + id;
        case 'albums':
            return "https://open.spotify.com/embed/album/" + id;
        case 'artists':
            return "https://open.spotify.com/embed/artist/" + id;
        default:
            return "https://open.spotify.com/embed/track/" + id;
    }
}


export default function SpotifyPlugin(props) {
    const spotify_link = constructSpotifyLink(props.category, props.link);

    return (
        <iframe 
            title={"track_id=" + props.id}
            src={spotify_link} 
            width="350" 
            height="80" 
            frameBorder="0" 
            allowtransparency="true"
            allow="encrypted-media">                            
        </iframe>   
    )
}
