import React from 'react'

import ytIcon from '../assets/youtube.svg';

const constructYTSearchLink = (category, query) => {
    const yt_search_prefix = "https://www.youtube.com/results?search_query=";
    switch(category){
        case 'songs':
            query += ' song'; break;
        case 'albums':
            query += ' album'; break;
        case 'artists':
            query += ' artist'; break;
        default:
            break;
    }
    query = query.toLowerCase();
    query.split(' ').join('+');
    return yt_search_prefix + query;
}


export default function YouTubeSearch(props) {
    let yt_search_link = constructYTSearchLink(props.category, props.query);
    return (
        <a 
            className="yt-link"
            rel="noreferrer"
            target="_blank" 
            href={yt_search_link}>
            <img
                className="yt-btn" 
                src={ytIcon} 
                alt="Ikona You Tube"></img>    
            Wyszukaj na YouTube</a>
    )
}
