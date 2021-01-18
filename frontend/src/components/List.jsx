import React, { Component, Fragment } from 'react';

import InfiniteScroll from "react-infinite-scroll-component";

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
        sorting_options     : {'songs' : 1, 'albums' : 2, 'artists' : 3},
        page                : 0
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

    _getItemsList(args) {
        var category = this.state.category;
        //if (this.state[category].items.length === 0) {
        const LIST = getItemsListRequest({ category: args.category, page: args.page});
        this.setState({
            [category] : {
                "category" : category, 
                "items" : this.state[category].items.concat(LIST)
            }
        });
        console.log('buczak');
    }

    _getMoreItems = () => {
        var page = this.state.page;
        this.setState({
            page : this.state.page+1
        });
        this._getItemsList({category: this.state.category, page: page+1});
        console.log("xd");
    }

    renderItems(LIST) {
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
    }

    handleCategorySwitch = (category) => {
        this.setState({
            "category": category
        });
        this._getItemsList({category: category, page: this.state.page});
        handleCategoryViewChange(category);
    }

    componentDidMount() {
        this._getItemsList({category: this.state.category, page: this.state.page});
        setActiveCategoryStyles('songs-swt');
    }

    render() {
        //var _ITEMS = this._renderItems(this.state.songs);

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
                        {//this.state.category==='songs'   ? this.renderItems(this.state.songs)   : null}
                        }
                        {//this.state.category==='albums'  ? this.renderItems(this.state.albums)  : null}
                        }
                        {//this.state.category==='artists' ? this.renderItems(this.state.artists) : null}                                              
                        }
                        <InfiniteScroll
                            dataLength={this.state.songs.items.length}
                            next={() => this._getMoreItems()}
                            hasMore={true}
                            loader={<h4>Loading...</h4>}>
                            {this.state.songs.items.map((song, index) => (
                                <li key={song.id}>
                                    <Item
                                        category={'songs'}                                    
                                        item={song}/>
                                </li>
                            ))}
                        </InfiniteScroll>
                        <button onClick={() => this._getMoreItems()}>Więcej...</button>
                    </ul>
                </div>                
            </div>
        )
    }
}