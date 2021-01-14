import React, { Component } from 'react';

import SongItem from './SongItem';
import ArtistItem from './ArtistItem';
import AlbumItem from './AlbumItem';

import { 
    handleCategoryViewChange,
    setActiveCategoryStyles
} from '../display';
import '../styles/List.css';


function renderSongsItems(SONGS) {
    return (
        <ul>
          {SONGS.map(song => (
            <SongItem />
          ))}
        </ul>
    );
}

function renderAlbumsItems(ALBUMS) {
    return (
        <ul>
          {ALBUMS.map(album => (
            <AlbumItem />
          ))}
        </ul>
    );
}

function renderArtistsItems(ARTISTS) {
    return (
        <ul>
          {ARTISTS.map(artist => (
            <ArtistItem />
          ))}
        </ul>
    );
}

export default class List extends Component {
    state = {
        category                : 'songs',    // can be: songs, albums, artists
        songs                   : [ 1, 2, 3],
        albums                  : [1, 2, 3],
        artists                 : [1, 2, 3],
        filtering_options       : {},
        sorting_options         : {}
    };

    handleCategorySwitch = (category) => {
        this.setState({
            category: category
        });
        handleCategoryViewChange(category);
    }

    componentDidMount() {
        setActiveCategoryStyles('songs-swt');
    }

    render() {
        return (
            <div className="List">
                <div className="category-switch">
                    <div 
                        id="songs-swt"
                        onClick={() => this.handleCategorySwitch('songs')}
                        className="songs-switch-btn">Piosenki</div>
                    <div
                        id="albums-swt"
                        onClick={() => this.handleCategorySwitch('albums')} 
                        className="albums-switch-btn">Albumy</div>
                    <div
                        id="artists-swt"
                        onClick={() => this.handleCategorySwitch('artists')} 
                        className="artists-switch-btn">Artyści</div>
                </div>
                <div className="items-wrapper">
                    {this.state.category==='songs'   ? renderSongsItems(this.state.songs)     : null}
                    {this.state.category==='albums'  ? renderAlbumsItems(this.state.albums)   : null}
                    {this.state.category==='artists' ? renderArtistsItems(this.state.artists) : null}
                </div>                
            </div>
        )
    }
}
