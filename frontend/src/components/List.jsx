import React, { Component } from 'react';

import Item from './Item';

import { 
    handleCategoryViewChange,
    setActiveCategoryStyles
} from '../display';
import '../styles/List.css';

// temp
import { SONGS, ALBUMS, ARTISTS } from '../temporary';


export default class List extends Component {
    state = {
        category            : 'songs',    // can be: songs, albums, artists
        //songs               : {'category' : 'songs', 'items' : [ 'song1', 'song2', 'song3']},
        songs               : {"category": 'songs', "items": SONGS},
        //albums              : {'category' : 'albums', 'items' : [ 'album1', 'album2', 'album3']},
        albums              : {"category": 'albums', "items": ALBUMS},
        //artists             : {'category' : 'artists', 'items' : [ 'arits1', 'artist2', 'artist3']},
        artists             : {"category": 'artists', "items": ARTISTS},
        filtering_options   : {'songs' : 1, 'albums' : 2, 'artists' : 3},
        sorting_options     : {'songs' : 1, 'albums' : 2, 'artists' : 3}
    };

    renderItems(LIST) {
        switch (LIST.category) {
            case 'songs':
                return (
                    <ul>
                        {LIST.items.map(song => (
                            <Item
                                category={LIST.category}
                                key={song.id} 
                                item={song}/>
                        ))}
                    </ul>
                );
            case 'albums':
                return (
                    <ul>
                        {LIST.items.map(album => (
                            <Item
                                category={LIST.category}
                                key={album.id} 
                                item={album}/>
                        ))}
                    </ul>
                );
            case 'artists':
                return (
                    <ul>
                        {LIST.items.map(artist => (
                            <Item    
                                category={LIST.category}
                                key={artist.id} 
                                item={artist}/>
                        ))}
                    </ul>
                );
            default:
                return (
                    <h3>Brak zawartości</h3>
                )
        }
    }

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
                    {this.state.category==='songs'   ? this.renderItems(this.state.songs)    : null}
                    {this.state.category==='albums'  ? this.renderItems(this.state.albums)   : null}
                    {this.state.category==='artists' ? this.renderItems(this.state.artists)  : null}
                </div>                
            </div>
        )
    }
}
