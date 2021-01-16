import React, { Component, Fragment } from 'react';

import Item from './Item';

import { getItemsListRequest } from '../requests';

import { 
    handleCategoryViewChange,
    setActiveCategoryStyles
} from '../display';
import '../styles/List.css';


export default class List extends Component {
    state = {
        category            : 'songs',    // can be: songs, albums, artists
        songs               : {"category": 'songs', "items": []},
        albums              : {"category": 'albums', "items": []},
        artists             : {"category": 'artists', "items": []},
        filtering_options   : {'songs' : 1, 'albums' : 2, 'artists' : 3},
        sorting_options     : {'songs' : 1, 'albums' : 2, 'artists' : 3}
    };

    // CRUD method for list view
    getItemsList(category) {
        if (this.state[category].items.length === 0) {
            const LIST = getItemsListRequest(category);
            this.setState({
                [category] : {"category" : category, "items" : LIST}
            });
        }        
    }

    renderItems(LIST) {
        switch (LIST.category) {
            case 'songs':
                return (
                    <Fragment>
                        {LIST.items.map(song => (
                            <li key={song.id} >
                                <Item
                                    category={LIST.category}                                    
                                    item={song}/>
                            </li>
                        ))}
                    </Fragment>
                );
            case 'albums':
                return (
                    <Fragment>
                        {LIST.items.map(album => (
                            <li key={album.id} >
                                <Item
                                    category={LIST.category}                                    
                                    item={album}/>
                            </li>
                        ))}
                    </Fragment>                    
                );
            case 'artists':
                return (
                    <Fragment>
                        {LIST.items.map(artist => (
                            <li key={artist.id} >
                                <Item
                                    category={LIST.category}                                    
                                    item={artist}/>
                            </li>
                        ))}
                    </Fragment>        
                );
            default:
                return (
                    <h3>Brak zawartości</h3>
                )
        }
    }

    handleCategorySwitch = (category) => {
        this.setState({
            "category": category
        });
        this.getItemsList(category);
        handleCategoryViewChange(category);
    }

    componentDidMount() {
        this.getItemsList(this.state.category);
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
                    <ul>
                        {this.state.category==='songs'   ? this.renderItems(this.state.songs)   : null}
                        {this.state.category==='albums'  ? this.renderItems(this.state.albums)  : null}
                        {this.state.category==='artists' ? this.renderItems(this.state.artists) : null}
                    </ul>
                </div>                
            </div>
        )
    }
}
