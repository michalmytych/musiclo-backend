import React, { Component, Fragment } from 'react';

import InfiniteScroll from "react-infinite-scroll-component";

import Item from './Item';
import ItemForm from './ItemForm';

import { 
    getItemsListRequest,
    createItemRequest,
    getSearchResultsRequest,
    getCountriesDataRequest
} from '../requests';

import { 
    uniqueArrayOfObjects, 
    validateItems 
} from '../constants';

import { 
    handleCategoryViewChange,
    setActiveCategoryStyles,
    viewAlert
} from '../display';

import '../styles/Search.css';
import '../styles/List.css';
import loadingSpinner from '../assets/loading.svg';
import addIcon from '../assets/add.svg';
import artistIcon from '../assets/artist.svg';
import albumIcon from '../assets/cd.svg';
import trackIcon from '../assets/tune.svg';

import { validateItemBeforePost } from '../validators';


const AddItemButton = (props) => {
    return (
        <div className="add-item-wrapper" onClick={props.handler}>
            <img className="crud-icon" src={addIcon} alt="Przycisk dodawania."/>
        </div>
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
            item_deleted        : false,
            COUNTRIES           : [],
            nothingFound        : false
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
        this._getCountriesData = this._getCountriesData.bind(this);
    }
 
    /*
        CRUD method for list view
    */
    async _getItemsList(args) {
        const LIST = await getItemsListRequest({ 
            c : args.category, 
            p : args.page,
            l : this.state.items_limit
        }).then((LIST) => {
            if (LIST) {
                if (LIST.length < this.state.items_limit) {
                    this.setState({ hasMoreItems: false });
                }
                this.setState({
                    [args.category] : {
                        "category" : args.category, 
                        "items" : this.state[args.category].items.concat(LIST)
                    }
                });
            }}        
        )        
    }

    async _getSearchResults(args) {
        var LIST = await getSearchResultsRequest({
            c    : args.category, 
            p    : args.phrase
        });
        LIST = validateItems(LIST);
        if (!LIST.length) {
            this.setState({ nothingFound: true });
        } else {
            this.setState({ hasMoreItems: false, nothingFound: false });
            this.setState({
                [args.category] : {
                    "category"  : args.category, 
                    "items"     : this.state[args.category].items.concat(LIST)
                }
            });
        }        
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
            let res = await createItemRequest(validArgs)
            .then( res => {
                if (res) {
                    viewAlert("Dodano!", true);
                } else { viewAlert("Request nie powiódł się!", false); }                
            })
        } else {
            viewAlert("Niepoprawne dane!", false);
        }
    }

    async _getCountriesData() {
        var data = await getCountriesDataRequest()
        .then(data => this.setState({ "COUNTRIES" : data }));
        return data;  
    }

    _getMoreItems = () => {
        var page = this.state.page;
        this.setState({
            page : this.state.page+1
        });
        this._getItemsList({category: this.state.category, page: page+1});
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
            [this.state.category]   : { category: this.state.category, items: list},
            item_deleted            : !this.state.item_deleted
        });
    }

    renderItems(LIST) {
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
        this._getCountriesData();
        setActiveCategoryStyles('songs-swt');
    }

    render() {
        const loader = <div className="loader-wrapper"><img alt="" className="loader" src={loadingSpinner}/></div>
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
        
        var _dataLength = this.state[_ITEMS_LIST.category].items.length;
        _ITEMS_LIST.items = uniqueArrayOfObjects(_ITEMS_LIST.items, "id");

        return (
            <div className="List">
                {
                    this.state.show_creation_box ?
                    <Fragment>
                        <div
                            onClick={this.toggleCreationFormDisplay} 
                            className="animate__animated animate__fadeIn blurred-form-background"></div>                           
                        <ItemForm
                            _editing={false}     
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
                        className="songs-switch-btn">
                        <img alt="Ikona piosenek." src={trackIcon} className="category-icon"></img>
                        Piosenki
                    </div>
                    <div
                        id="albums-swt"
                        onClick={() => this.handleCategorySwitch('albums')} 
                        className="albums-switch-btn">
                        <img alt="Ikona albumów." src={albumIcon} className="category-icon"></img>
                        Albumy
                    </div>
                    <div
                        id="artists-swt"
                        onClick={() => this.handleCategorySwitch('artists')} 
                        className="artists-switch-btn">
                        <img alt="Ikona artystów." src={artistIcon} className="category-icon"></img>
                        Artyści         
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
                            _ITEMS_LIST.items ?
                                _ITEMS_LIST.items.length !==0 ?
                                <InfiniteScroll
                                    dataLength={_dataLength}
                                    next={() => this._getMoreItems()}
                                    hasMore={this.state.hasMoreItems}
                                    loader={loader}>
                                    {this.state[_ITEMS_LIST.category].items.map((item) => (
                                        <li key={item.id}>
                                            <Item
                                                _countries={this.state.COUNTRIES}
                                                popDeletedItem={(id) => this.updateListAfterDelete(id)}
                                                refreshAfterEdit={() => this.refreshListAfterEdit()}
                                                category={_ITEMS_LIST.category}                                    
                                                item={item}/>
                                        </li>
                                    ))}
                                </InfiniteScroll> :
                                    this.state.nothingFound ? 
                                    <h3 className="NoData">Nic tu nie ma</h3> : loader                                
                            : <h3 className="NoData">Nic tu nie ma</h3>
                        }
                    </ul>
                </div>                
            </div>
        )
    }
}