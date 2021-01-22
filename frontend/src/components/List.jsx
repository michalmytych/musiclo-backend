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
            category    : args.category, 
            page        : args.page,
            items_limit : this.state.items_limit
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
        this._getItemsList({category: this.state.category, page: page+1});
    }

    async _createItem(args) {
        await createItemRequest(args);  
        this.refreshListAfterEdit();      
    }

    toggleCreationFormDisplay = () => {
        this.setState({
            "show_creation_box" : !this.state.show_creation_box
        });
    }

    updateListAfterDelete = (item_id) => {
        var list = this.state[this.state.category].items;
        const index = list.map(e => e.id).indexOf(item_id);
        list.splice(index, 1);
        this.setState({
            [this.state.category] : { category: this.state.category, items: list}
        });
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
        const loader = <div className="loader-wrapper"><img className="loader" src={loadingSpinner}/></div>
        var _ITEMS_LIST;
        switch (this.state.category) {
            case 'songs':
                _ITEMS_LIST = this.state.songs; break;
            case 'albums':
                _ITEMS_LIST = this.state.albums; break;
            case 'artists':
                _ITEMS_LIST = this.state.artists; break;
            default:            
                _ITEMS_LIST = [];
        }
        var _items_category = _ITEMS_LIST.category;

        return (
            <div className="List">
                {
                    this.state.show_creation_box ?
                    <ItemForm
                        _editing={false}
                        category={this.state.category}            
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
                                _ITEMS_LIST.length !==0 ?
                                <InfiniteScroll
                                    dataLength={this.state.songs.items.length}
                                    next={() => this._getMoreItems()}
                                    hasMore={this.state.hasMoreItems}
                                    loader={loader}>
                                    {this.state.songs.items.map((item) => (
                                        <li key={item.id}>
                                            <Item
                                                popDeletedItem={(id) => this.updateListAfterDelete(id)}
                                                refreshAfterEdit={() => this.refreshListAfterEdit()}
                                                category={_items_category}                                    
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