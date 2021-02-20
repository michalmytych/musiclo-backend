import React, { Component, Fragment } from 'react';

import SearchSelect from './SearchSelect';

import { getCountriesDataRequest } from '../requests';

import { 
    onlyUniqueFilter,
    uniqueArrayOfObjects 
} from '../constants';

import popItemIcon from '../assets/pop_item.svg';
import "../styles/ItemForm.css";


export default class ArtistForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"          : "",
            "albums_ids"    : [],            
            "description"   : "",
            "country"       : "",
            "spotify_link"  : "",
            "ALBUMS"        : [],
            "COUNTRIES"     : []
        };
        this.handleChange       = this.handleChange.bind(this);
        this.handleSubmit       = this.handleSubmit.bind(this);
        this.getSelectedAlbums  = this.getSelectedAlbums.bind(this);
        this._mountInstance     = this._mountInstance.bind(this);
        this.popAlbum           = this.popAlbum.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
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
        var obj = this.state; delete obj.COUNTRIES; // COUNTRIES array is redundant further on
        if (this.props._editing) {            
            this.props.getEditedArtist({
                obj         : obj,
                category    : 'artists',
                id          : this.props.instance.id
            });
        } else {
            this.props.getEditedArtist({
                obj         : obj,
                category    : 'artists'
            });
        }
        event.preventDefault();
    }

    async _mountInstance(instance) {
        var _albums = [];
        var _albums_ids = [];
        if (instance._albums_ids && instance._albums_ids !== "[null]") {
            var _albums_names = JSON.parse(instance._albums_names).filter(onlyUniqueFilter);
            _albums_ids = JSON.parse(instance._albums_ids).filter(onlyUniqueFilter);            
            if (_albums_names.length===_albums_ids.length) {
                _albums_names.forEach((a, i) => {
                    _albums[i] = {id: _albums_ids[i], name: a}
                });
            }        
        }        
        if (!instance.description) { instance.description = ""; };
        this.setState({
            "name"          : instance.name,
            "albums_ids"    : _albums_ids,
            "description"   : instance.description,
            "country"       : instance.country,
            "spotify_link"  : instance.spotify_link,
            "ALBUMS"        : _albums
        });        
    }

    async componentDidMount() {                    
        if (this.props._editing) {
            if (this.props.instance) {
                this._mountInstance(this.props.instance);
            } else {
                alert("Błąd podczas pobierania obiektu.");
            }            
        }
        /*
            This async call must by places somewhere else to
            view artist country at first render() call properly.
        */
        var data = await getCountriesDataRequest();
        this.setState({ "COUNTRIES" : data });  
    }

    render() {
        var _COUNTRIES = uniqueArrayOfObjects(this.state.COUNTRIES, "iso_code");
        var _ALBUMS = [];
        try{ 
            if (this.state.ALBUMS.length) { _ALBUMS = this.state.ALBUMS; };
        } catch (error) {
            console.log("Obsłużono błąd: " + error);
            _ALBUMS = [];
        }

        return (
            <form 
                className="animate__animated animate__fadeInDown" 
                onSubmit={this.handleSubmit}>
                <label id="lab_name" className="input-label">Nazwa wykonawcy</label>
                <input aria-labelledby="lab_name"
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <label id="lab_dscrpt" className="input-label">Opis</label>
                <textarea aria-labelledby="lab_dscrpt"
                    onChange={this.handleChange}
                    type="" 
                    name="description" 
                    value={
                        this.state.description ?
                        this.state.description : ""
                    }
                    rows="4" cols="50">
                </textarea>                    
                <p className="input-label">Albumy</p>
                <ul>
                    {
                        this.state.ALBUMS ?
                            _ALBUMS.length ?
                            _ALBUMS.map((a) => (
                                <li key={"albumId_" + a.id} className="select-srch-li">
                                    <div
                                        className="selected-search-select-item" 
                                        onClick={()=>this.popAlbum(a.id)}>
                                        <img className="pop-item-btn" src={popItemIcon} alt="Ikona usuwania piosenki."></img>{
                                        a.name.length > 20 ? a.name.slice(0,17) + "..." : a.name
                                        }</div>
                                </li>                                
                            )) : <p>Brak albumów.</p>
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
                        <label id="lab_ctry" className="input-label">Kraj</label>
                        <select aria-labelledby="lab_ctry"
                            onChange={this.handleChange}  
                            defaultValue={this.state.country}
                            name="country">
                            {
                                _COUNTRIES ?
                                _COUNTRIES.length ?
                                    _COUNTRIES.map(country => (
                                        <option                                         
                                            value={country.iso_code} 
                                            key={"countryId_" + country.is_code} >
                                            {country.name}
                                        </option>                        
                                    )) : null
                                : null
                            }       
                        </select>
                    </Fragment>
                }                 
                <label id="lab_spotl" className="input-label">Artysta w Spotify</label>
                <input aria-labelledby="lab_spotl"
                    onChange={this.handleChange}
                    type="text" 
                    name="spotify_link" 
                    value={this.state.spotify_link}
                    placeholder="Wklej link..."/>
                <button 
                    className="form-submit-btn"                
                    type={"submit"}>Zapisz</button>                    
            </form>
        )
    }
}
