import React, { Component, Fragment } from 'react';

import InfiniteScroll from "react-infinite-scroll-component";

import Item from './Item';
import ItemForm from './ItemForm';

import { 
    getItemsListRequest,
    createItemRequest 
} from '../requests';

import { 
    handleCategoryViewChange,
    setActiveCategoryStyles
} from '../display';

import '../styles/List.css';
import loadingSpinner from '../assets/loading.svg';
import addIcon from '../assets/add.svg';



const AddItemButton = (props) => {
    return (
        <button onClick={props.handler}>
            <img className="crud-icon" src={addIcon} alt="Przycisk dodawania."/>
        </button>
    )
}

export default class List extends Component {
    state = {
        category            : 'songs',    // can be: songs, albums, artists
        songs               : {"category": 'songs', "items": []},
        albums              : {"category": 'albums', "items": []},
        artists             : {"category": 'artists', "items": []},
        filtering_options   : {'songs' : 1, 'albums' : 2, 'artists' : 3},
        sorting_options     : {'songs' : 1, 'albums' : 2, 'artists' : 3},
        show_creation_box   : false,
        page                : 0,
        hasMoreItems        : true,
        items_limit         : 7
    };

    // CRUD method for list view
    async _getItemsList(args) {
        const LIST = await getItemsListRequest({ 
            c : args.category, 
            p : args.page,
            l : this.state.items_limit
        });
        if (LIST.length < this.state.items_limit) {
            this.setState({ hasMoreItems: false });
        }
        this.setState({
            [args.category] : {
                "category" : args.category, 
                "items" : this.state[args.category].items.concat(LIST)
            }
        });
    }

    refreshListAfterEdit = () => {
        // SPRAWDZIC
        if (this.state.page !== 0) {
            this.setState({
                page : 0
            });
        }
        this._getItemsList({
            category : this.state.category,
            page     : 0
        }); 
    }

    _getMoreItems = () => {
        var page = this.state.page;
        this.setState({
            page : this.state.page+1
        });
        // SPRAWDZIC                  /moze powinno byc parametryzowanie
        this._getItemsList({category: this.state.category, page: page+1});
    }

    async _createItem(args) {
        // SPRAWDZIC czy napewno powinno byc await
        await createItemRequest(args);  
        // SPRAWDZIC
        this.refreshListAfterEdit();      
    }

    toggleCreationFormDisplay = () => {
        this.setState({
            "show_creation_box" : !this.state.show_creation_box
        });
    }

    updateListAfterDelete = (item_id) => {
        // SPRAWDZIC
        var list = this.state[this.state.category].items;
        const index = list.map(e => e.id).indexOf(item_id);
        list.splice(index, 1);
        this.setState({
            [this.state.category] : { category: this.state.category, items: list}
        });
    }

    renderItems(LIST) {
        // SPRAWDZIC
        return (
            <Fragment>
                {LIST.items.map(item => (
                    <li key={item.id} >
                        <Item
                            category={LIST.category}                                    
                            item={item}/>
                    </li>
                ))}
            </Fragment>
        );
    }

    handleCategorySwitch = (category) => {
        if (this.state.category !== category) {
            this.setState({
                "category": category
            });
            // SPRAWDZIC czy setState nie jest opozniony
            this._getItemsList({category: category, page: 0});
            handleCategoryViewChange(category);
        }        
    }

    componentDidMount() {
        this._getItemsList({category: this.state.category, page: this.state.page});
        setActiveCategoryStyles('songs-swt');
    }

    render() {
        const loader = <div className="loader-wrapper"><img alt="" className="loader" src={loadingSpinner}/></div>
        var _ITEMS_LIST;
        switch (this.state.category) {
            // czy tu nie powinno byc this.state.items
            case 'songs':
                _ITEMS_LIST = this.state.songs; break;
            case 'albums':
                _ITEMS_LIST = this.state.albums; break;
            case 'artists':
                _ITEMS_LIST = this.state.artists; break;
            default:            
                _ITEMS_LIST = [];
        }
        // var _items_category = _ITEMS_LIST.category;
        //var _dataLength = this.state[this.state.category].items.length;
        var _dataLength = this.state[_ITEMS_LIST.category].items.length;

        return (
            <div className="List">
                {
                    this.state.show_creation_box ?
                    <ItemForm
                        _editing={false}
                        //category={this.state.category}            
                        category={_ITEMS_LIST.category}
                        onSave={(created_object) => this._createItem(
                            created_object
                        )}
                        toggler={this.toggleCreationFormDisplay} />
                    : null
                }                
                <div className="category-switch">
                    <div 
                        id="songs-swt"
                        onClick={() => this.handleCategorySwitch('songs')}
                        className="songs-switch-btn">Piosenki
                    </div>
                    <div
                        id="albums-swt"
                        onClick={() => this.handleCategorySwitch('albums')} 
                        className="albums-switch-btn">Albumy
                    </div>
                    <div
                        id="artists-swt"
                        onClick={() => this.handleCategorySwitch('artists')} 
                        className="artists-switch-btn">Artyści                        
                    </div>
                </div>
                <div className="items-wrapper">
                    <AddItemButton 
                        handler={() => this.toggleCreationFormDisplay()}/>
                    <ul>
                        {
                            _ITEMS_LIST ?
                            // SPRAWDZIC lol przeciez _ITEMS_LIST jest obiektem
                            // to chyba nie: _ITEMS_LIST.length !==0 ?
                                _ITEMS_LIST.items.length !==0 ?
                                <InfiniteScroll
                                    dataLength={_dataLength}
                                    next={() => this._getMoreItems()}
                                    hasMore={this.state.hasMoreItems}
                                    loader={loader}>
                                    {this.state[_ITEMS_LIST.category].items.map((item, i) => (
                                        <li key={i}>
                                            <Item
                                                popDeletedItem={(id) => this.updateListAfterDelete(id)}
                                                refreshAfterEdit={() => this.refreshListAfterEdit()}
                                                category={_ITEMS_LIST.category}                                    
                                                item={item}/>
                                        </li>
                                    ))}
                                </InfiniteScroll> : <h4>Brak treści.</h4>
                            : <h4>Brak treści.</h4>
                        }
                    </ul>
                </div>                
            </div>
        )
    }
}