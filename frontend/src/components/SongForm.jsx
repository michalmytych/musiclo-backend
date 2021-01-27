import React, { Component } from 'react'

import SearchSelect from './SearchSelect';

import { KEYS, onlyUniqueFilter, uniqueArrayOfObjects } from '../constants';

import { setDateInputValue } from '../display';


export default class SongForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"              : "",
            "ALBUM"             : null,
            "ARTISTS"           : [],
            "explicit"          : false,
            "danceability"      : 0.50,
            "energy"            : 0.50,
            "acousticness"      : 0.50,
            "instrumentalness"  : 0.50,
            "key"               : 0,
            "mode"              : 0,
            "release_date"      : "",
            "spotify_link"      : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSelectedAlbums = this.getSelectedAlbums.bind(this);
        this.getSelectedArtists = this.getSelectedArtists.bind(this);
        this._mountInstance = this._mountInstance.bind(this);        
        this.popArtist = this.popArtist.bind(this);        
        this.clearAlbum = this.clearAlbum.bind(this);
    }

    getSelectedAlbums(selection) {
        this.setState({
            "ALBUM" : selection[0]
        });
    }

    getSelectedArtists(selections) {
        var artists = this.state.ARTISTS.concat(selections);
        var _disctinct = uniqueArrayOfObjects(artists, "id");
        this.setState({
            "ARTISTS" : _disctinct
        });
    }
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        this.props.getEditedSong({
            obj         : this.state,
            category    : 'songs'
        });
        event.preventDefault();
    }

    _mountInstance = (instance) => {
        var _artists_ids = JSON.parse(instance._artists_ids).filter(onlyUniqueFilter);
        var _artists_names = JSON.parse(instance._artists_names).filter(onlyUniqueFilter);
        var album = {id: instance.album_id, name: instance.album_name}
        if (_artists_names.length===_artists_ids.length) {
            var _artists = [];
            _artists_names.forEach((a, i) => {
                _artists[i] = {id: _artists_ids[i], name: a}
            });
        }    

        this.setState({
            "name"              : instance.name,
            "ALBUM"             : album,
            "ARTISTS"           : _artists,
            // null zmieni sie na NaN
            "explicit"          : parseInt(instance.explicit),
            "danceability"      : parseFloat(instance.danceability),
            "energy"            : parseFloat(instance.energy),
            "acousticness"      : parseFloat(instance.acousticness),
            "instrumentalness"  : parseFloat(instance.instrumentalness),
            "key"               : parseInt(instance.key),
            "valence"           : parseFloat(instance.valence),
            "mode"              : parseInt(instance.mode),
            "release_date"      : instance.release_date,
            "spotify_link"      : instance.spotify_link,
        });
    }

    popArtist(id) {
        let artists = this.state.ARTISTS;
        let updated_artists = artists.filter( artists => (artists.id !== id ));
        this.setState({ ARTISTS : updated_artists }); 
    }

    clearAlbum() {
        this.setState({ ALBUM : null });
    }

    componentDidMount() {
        if (this.props._editing) {
            if (this.props.instance) {
                this._mountInstance(this.props.instance);
            } else {
                alert("Błąd podczas montowania obiektu.");
            }
        } else {
            this.setState({
                "release_date" : setDateInputValue()
            });
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                    {
                        this.props._editing ?
                            this.props.instance ?
                                <h4>Edytowanie piosenki {this.props.instance.name}</h4>
                            :
                            <h4>Edytowanie</h4>
                        :
                        null
                    }
                <p>Wykonawca:</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    required
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p>Artyści</p>
                <ul>
                    {
                        this.state.ARTISTS ?
                            this.state.ARTISTS.length ?
                            this.state.ARTISTS.map((a) => (
                                <li>
                                    <div
                                        className="selected-search-select-item" 
                                        onClick={()=>this.popArtist(a.id)}>X {
                                        a.name.length > 20 ? a.name.slice(0,17) + "..." : a.name
                                        }</div>
                                </li>                                
                            )) : <p>Brak wykonawców.</p>
                        : null
                    }   
                </ul>
                <SearchSelect                     
                    required
                    multiple_choice={true}
                    _getInitialValue={(p) => this.getSelectedArtists(p)}
                    getValues={(p) => this.getSelectedArtists(p)} 
                    category={"artists"} />
                <p>Album</p>
                {
                        this.state.ALBUM ?
                        <div
                            className="selected-search-select-item" 
                            onClick={this.clearAlbum}>X {
                            this.state.ALBUM.name ?
                                this.state.ALBUM.name.length > 20 ? 
                                this.state.ALBUM.name.slice(0,17) + "..." : this.state.ALBUM.name
                            : null}                            
                        </div> : <p>Brak albumu</p>
                }
                <SearchSelect 
                    multiple_choice={false}
                    _getInitialValue={(p) => this.getSelectedAlbums(p)}
                    getValues={(p) => this.getSelectedAlbums(p)} 
                    category={"albums"}/>
                <p>EXPLICIT</p>
                <input
                    onChange={this.handleChange}
                    type="checkbox" 
                    value={this.state.explicit}
                    name="explicit"/>
                <p>Taneczność</p>
                <input
                    onChange={this.handleChange} 
                    type="range" 
                    name="danceability" 
                    value={this.state.danceability}
                    min="0"
                    step="0.01" 
                    max="1"/>
                <p>Energia</p>
                <input
                    onChange={this.handleChange} 
                    type="range"
                    value={this.state.energy}
                    name="energy" 
                    min="0"
                    step="0.01"  
                    max="1"/>
                <p>Akustyczność</p>
                <input 
                    onChange={this.handleChange}
                    type="range" 
                    name="acousticness" 
                    value={this.state.acousticness}
                    min="0" 
                    step="0.01" 
                    max="1"/>
                <p>Żywe instrumenty</p>
                <input 
                    onChange={this.handleChange} 
                    type="range" 
                    value={this.state.instrumentalness}
                    name="instrumentalness" 
                    min="0" 
                    step="0.01" 
                    max="1"/>
                <p>Pozytywność</p>
                <input 
                    onChange={this.handleChange}
                    type="range" 
                    name="valence" 
                    value={this.state.valence}
                    min="0" 
                    step="0.01" 
                    max="1"/>                                                                                                     
                <p>Klucz</p>
                <select
                    onChange={this.handleChange}  
                    value={this.state.key}
                    name="key">
                    {KEYS.map(key => (
                        <option value={key.id} key={key.id}>
                            {key.name}
                        </option>                        
                    ))}        
                </select>
                <p>Tryb</p>                            
                <select 
                    onChange={this.handleChange} 
                    value={this.state.mode}
                    name="mode">
                    <option value="0">moll</option>
                    <option value="1">dur</option>
                </select>
                <p>Data wydania</p>
                <input 
                    required
                    onChange={this.handleChange} 
                    id="release_date_input"
                    type="date" 
                    value={this.state.release_date}
                    name="release_date"></input>    
                <p>Na spotify</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="spotify_link" 
                    value={this.state.spotify_link}
                    placeholder="Wklej..."/>                                               
                <button type={"submit"}>Zapisz</button>                    
            </form>
        )
    }
}
