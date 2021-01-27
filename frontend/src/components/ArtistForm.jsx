import React, { Component, Fragment } from 'react';

import SearchSelect from './SearchSelect';

import { getCountriesDataRequest } from '../requests';

import { 
    onlyUniqueFilter,
    uniqueArrayOfObjects 
} from '../constants';


export default class ArtistForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"          : "",
            "albums_ids"    : [],            
            "description"   : "",
            "country"       : "",
            "ALBUMS"        : [],
            "COUNTRIES"     : []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSelectedAlbums = this.getSelectedAlbums.bind(this);
        this._mountInstance = this._mountInstance.bind(this);
        this.popAlbum = this.popAlbum.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    _getSelectedAlbums(selections) {
        var albums_ids = this.state.albums_ids.concat(selections);
        this.setState({
            "albums_ids" : this.state.albums_ids.concat(selections)
        });
    }

    getSelectedAlbums(selections) {
        var _ALBUMS = this.state.ALBUMS.concat(selections);
        var _disctinct = uniqueArrayOfObjects(_ALBUMS, "id");
        this.setState({
            "ALBUMS" : _disctinct
        });
    }

    popAlbum(id) {
        let albums = this.state.ALBUMS;
        let updated_albums = albums.filter( album => (album.id !== id ));
        this.setState({ ALBUMS : updated_albums }); 
    }

    handleSubmit(event) {
        this.props.getEditedArtist({
            obj         : this.state,
            category    : 'artists'
        });
        event.preventDefault();
    }

    async _mountInstance(instance) {
        var _albums_names = JSON.parse(instance._albums_names).filter(onlyUniqueFilter);
        var _albums_ids = JSON.parse(instance._albums_ids).filter(onlyUniqueFilter);
        if (_albums_names.length===_albums_ids.length) {
            var _albums = [];
            _albums_names.forEach((a, i) => {
                _albums[i] = {id: _albums_ids[i], name: a}
            });
        }
        this.setState({
            "name"          : instance.name,
            "albums_ids"    : _albums_ids,
            "description"   : instance.description,                
            "country"       : instance.country,
            "ALBUMS"        : _albums
        });
        console.log('lol');
    }

    async componentDidMount() {
        var data = await getCountriesDataRequest();
        this.setState({ "COUNTRIES" : data });  
            
        if (this.props._editing) {
            if (this.props.instance) {
                this._mountInstance(this.props.instance);
            } else {
                console.log("Błąd podczas pobierania obiektu.");
            }            
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {
                    this.props._editing ?
                    <h4>Edytowanie {this.props.instance.name}</h4>
                    :
                    <h4>Dodawanie</h4>
                }
                <p>Nazwa wykonawcy</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p>Opis</p>
                <textarea 
                    onChange={this.handleChange}
                    type="" 
                    name="description" 
                    value={
                        this.state.description ?
                        this.state.description : null
                    }
                    rows="4" cols="50">
                </textarea>                    
                <p>Albumy</p>
                <ul>
                    {
                        this.state.ALBUMS ?
                            this.state.ALBUMS.length ?
                            this.state.ALBUMS.map((a) => (
                                <li>
                                    <div
                                        className="selected-search-select-item" 
                                        onClick={()=>this.popAlbum(a.id)}>X {a.name}</div>
                                </li>                                
                            )) : <p>Brak wykonawców.</p>
                        : null
                    }
                </ul>                 
                <SearchSelect 
                    multiple_choice={true}
                    _getInitialValue={(p) => this.getSelectedAlbums(p)}
                    getValues={(p) => this.getSelectedAlbums(p)} 
                    category={"albums"} />
                {
                    <Fragment>
                        <p>Kraj</p>
                        <select
                            onChange={this.handleChange}  
                            value={this.state.country}
                            name="country">
                            {
                                this.state.COUNTRIES.length ?
                                this.state.COUNTRIES.map(country => (
                                    <option                                         
                                        value={country.iso_code} 
                                        key={country.is_code} >
                                        {country.name}
                                    </option>                        
                                )) : null
                            }       
                        </select>
                    </Fragment>
                }                            
                <button type={"submit"}>Zapisz</button>                    
            </form>
        )
    }
}
