import React, { Component } from 'react';

import InfiniteScroll from 'react-infinite-scroller';

import Item from './Item';

import { getItemsListRequest } from '../requests';

import { 
    handleCategoryViewChange,
    setActiveCategoryStyles
} from '../display';
import '../styles/List.css';
import loadingSpinner from '../assets/loading.gif';


export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category            : 'songs',    // can be: songs, albums, artists
            songs               : {"category": 'songs', "items": []},
            albums              : {"category": 'albums', "items": []},
            artists             : {"category": 'artists', "items": []},
            filtering_options   : {'songs' : 1, 'albums' : 2, 'artists' : 3},
            sorting_options     : {'songs' : 1, 'albums' : 2, 'artists' : 3},
            
            // infinite scroll vars:
            items               : [],
            hasMoreItems        : true,
            nextPage            : null,
            itemsLimit          : 3
        };
    }

    // CRUD method for list view
    getItemsList = (page) => {
        var limit = this.state.itemsLimit;
        var cat = this.state.category;
        if (this.state[cat].items.length === 0) {
            const LIST = getItemsListRequest(cat, page, limit);
            this.setState({
                [cat]       : {"category" : cat, "items" : LIST},
                nextPage    : this.state.nextPage+1
            });
        }        
    }

    renderItems(LIST) {
        var html_ITEMS = [];
        if (LIST.items.length !== 0) {
            LIST.items.map(item => (
                    <li key={item.id} >
                        <Item
                            category={LIST.category}                                    
                            item={item}/>
                    </li>
            );
            return html_ITEMS;
        } else {
            return [];
        }
    }

    handleCategorySwitch = (category) => {
        this.setState({
            "category": category
        });
        this.getItemsList(0, category, this.state.itemsLimit);
        handleCategoryViewChange(category);
    }

    componentDidMount() {
        this.getItemsList(0);
        setActiveCategoryStyles('songs-swt');
    }

    render() {
        const loader = <div className="loader"><img className="loading-spinner" src={loadingSpinner}></img></div>;

        switch (this.state.category) {
            case 'songs':
                var html_ITEMS = this.renderItems(this.state.songs);
            case 'albums':
                var html_ITEMS = this.renderItems(this.state.albums);
            case 'artists':
                var html_ITEMS = this.renderItems(this.state.artists);
            default:
                <h4>Brak zawartości</h4>
        }
        
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
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => this.getItemsList.bind(this)}
                            hasMore={this.state.hasMoreItems}
                            loader={loader}>

                            {
                                html_ITEMS.length != 0 ?
                                <div className="tracks">
                                    {html_ITEMS}
                                </div> 
                                :
                                <h4>Brak treści</h4>
                            }                            
                        </InfiniteScroll>
                    </ul>
                </div>                
            </div>
        )
    }
}
