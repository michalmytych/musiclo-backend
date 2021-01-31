import React from 'react'


const constructSpotifyLink = (category, link) => {
    var id;
    if (link.includes("?si=")) {
        id = link.match('/\[a-z,A-Z,0-9]{22,}.si=')[0].slice(1,23);
    } else if (link.includes("embed")) {
        id = link.substring(link.length - 22);
    }
    
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
        <div>
            <iframe             
                className="spotify-iframe"
                title={"track_id=" + props.id}
                src={spotify_link} 
                width="350" 
                height="80" 
                frameBorder="0" 
                allowtransparency="false"
                allow="encrypted-media">                            
            </iframe>   
            {
                props.category==='albums' ?
                <div>
                    <a 
                        className="album-spotify-preview"
                        rel="noreferrer"
                        target="_blank" 
                        href={spotify_link}>Album w serwisie Spotify</a>
                </div> 
                : null        
            }
        </div>
    )
}
