import React, { Component, Fragment } from 'react';

import InfiniteScroll from "react-infinite-scroll-component";

import Item from './Item';
import ItemForm from './ItemForm';

import { 
    getItemsListRequest,
    createItemRequest,
    getSearchResultsRequest
} from '../requests';

import { 
    handleCategoryViewChange,
    setActiveCategoryStyles
} from '../display';

import '../styles/Search.css';
import '../styles/List.css';
import loadingSpinner from '../assets/loading.svg';
import addIcon from '../assets/add.svg';

import { validateItemBeforePost } from '../validators';


const AddItemButton = (props) => {
    return (
        <button onClick={props.handler}>
            <img className="crud-icon" src={addIcon} alt="Przycisk dodawania."/>
        </button>
    )
}

export default class List extends Component {
    constructor() {
        super();
        this.state = {
            category            : 'songs',    // can be: songs, albums, artists
            songs               : {"category": 'songs', "items": []},
            albums              : {"category": 'albums', "items": []},
            artists             : {"category": 'artists', "items": []},
            filtering_options   : {'songs' : 1, 'albums' : 2, 'artists' : 3},
            sorting_options     : {'songs' : 1, 'albums' : 2, 'artists' : 3},
            show_creation_box   : false,
            page                : 0,
            hasMoreItems        : true,
            items_limit         : 7,
            phrase              : "",
            item_deleted        : false
        };
        this.handleChange = this.handleChange.bind(this);
        this._getItemsList = this._getItemsList.bind(this);
        this.refreshListAfterEdit = this.refreshListAfterEdit.bind(this);
        this._createItem = this._createItem.bind(this);
        this._getMoreItems = this._getMoreItems.bind(this);
        this.toggleCreationFormDisplay = this.toggleCreationFormDisplay.bind(this);
        this.updateListAfterDelete = this.updateListAfterDelete.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.handleCategorySwitch = this.handleCategorySwitch.bind(this);
    }
 
    /*
        CRUD method for list view
    */
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

    async _getSearchResults(args) {
        var LIST = await getSearchResultsRequest({
            c    : args.category, 
            p    : args.phrase
        });
        this.setState({ hasMoreItems: false });
        this.setState({
            [args.category] : {
                "category"  : args.category, 
                "items"     : this.state[args.category].items.concat(LIST)
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

    async _createItem(args) {
        var validArgs = validateItemBeforePost(args);
        if (validArgs) {
            console.log(validArgs);            
            var response = await createItemRequest(validArgs);  
            console.log(validArgs);
            //this.refreshListAfterEdit();      
        } else {
            alert("Niepoprawne dane!");
        }
    }

    _getMoreItems = () => {
        var page = this.state.page;
        this.setState({
            page : this.state.page+1
        });
        // SPRAWDZIC                  /moze powinno byc parametryzowanie
        this._getItemsList({category: this.state.category, page: page+1});
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
            [this.state.category]   : { category: this.state.category, items: list},
            item_deleted            : !this.state.item_deleted
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

    handleChange(event) {        
        this.setState({
            [event.target.name] : event.target.value
        });
        if (!event.target.value) {
            this.setState({ 
                hasMoreItems        : true,
                songs               : {"category": 'songs', "items": []},
                albums              : {"category": 'albums', "items": []},
                artists             : {"category": 'artists', "items": []},
            });
            this._getItemsList({category: this.state.category, page: 0});
        } else {
            this.setState({ 
                songs               : {"category": 'songs', "items": []},
                albums              : {"category": 'albums', "items": []},
                artists             : {"category": 'artists', "items": []},
            });            
            this._getSearchResults({
                category    : this.state.category, 
                phrase      : event.target.value,
            });
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
        
        var _dataLength = this.state[_ITEMS_LIST.category].items.length;

        return (
            <div className="List">
                {
                    this.state.show_creation_box ?
                    <Fragment>
                        <div
                            onClick={this.toggleCreationFormDisplay} 
                            className="blurred-form-background"></div>
                        <ItemForm
                            _editing={false}
                            //category={this.state.category}            
                            category={_ITEMS_LIST.category}
                            onSave={(created_object) => this._createItem(
                                created_object
                            )}
                            toggler={this.toggleCreationFormDisplay} />                            
                    </Fragment>
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
                    <div className="Search">
                        <input
                            spellCheck="false"
                            autoComplete="off"
                            contentEditable="true" 
                            value={this.state.phrase}
                            onChange={this.handleChange} 
                            placeholder={"Znajdź..."}
                            className="search-bar-input"
                            name="phrase" ></input>
                    </div>
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
                                        <li key={_ITEMS_LIST.category + "_" + i}>
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