import React from 'react'


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
            rel="noreferrer"
            target="_blank" 
            href={yt_search_link}>Wyszukaj na YouTube</a>
    )
}
