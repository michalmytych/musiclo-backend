import React, { Component, Fragment } from 'react'

import SearchSelect from './SearchSelect';

import { KEYS, encodeMusicKey, onlyUniqueFilter, uniqueArrayOfObjects } from '../constants';

import { setDateInputValue } from '../display';
import popItemIcon from '../assets/pop_item.svg';
import "../styles/ItemForm.css";


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
        if(event.target.type == 'checkbox') {
            let val = this.state[event.target.name];
            if(!val) {
                val = 1;
            } else if(val) {
                val = 0;
            } else {
                val = 1;
            }
            this.setState({ [event.target.name]: val });
        } else {
            this.setState({
                [event.target.name]: event.target.value
            });
        }        
    }

    handleSubmit(event) {
        if (this.props._editing) {
            this.props.getEditedSong({
                obj         : this.state,
                category    : 'songs',
                id          : this.props.instance.id
            });
        } else {
            this.props.getEditedSong({
                obj         : this.state,
                category    : 'songs'
            });
        }
        event.preventDefault();
    }

    _mountInstance = (instance) => {
        if (instance._artists_ids && instance._artists_ids !== "[null]") {
            var _artists_ids = JSON.parse(instance._artists_ids).filter(onlyUniqueFilter);
            var _artists_names = JSON.parse(instance._artists_names).filter(onlyUniqueFilter);
            var album = {id: instance.album_id, name: instance.album_name}
            if (_artists_names.length===_artists_ids.length) {
                var _artists = [];
                _artists_names.forEach((a, i) => {
                    _artists[i] = {id: _artists_ids[i], name: a}
                });
            }    
        } else {
            var _artists = [];
        }    

        this.setState({
            "name"              : instance.name,
            "ALBUM"             : album,
            "ARTISTS"           : _artists,
            "explicit"          : instance.explicit,
            "danceability"      : parseFloat(instance.danceability),
            "energy"            : parseFloat(instance.energy),
            "acousticness"      : parseFloat(instance.acousticness),
            "instrumentalness"  : parseFloat(instance.instrumentalness),
            "key"               : instance.key,
            "valence"           : parseFloat(instance.valence),
            "mode"              : instance.mode,
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
        var _explicit = false;
        if (parseInt(this.state.explicit)) {
            _explicit = true;
        }        

        return (
            <form
            className="animate__animated animate__fadeInDown"  
                onSubmit={this.handleSubmit}>
                <p className="input-label">Tytuł</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    required
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p className="input-label">Artyści</p>
                <ul>
                    {
                        this.state.ARTISTS ?
                            this.state.ARTISTS.length>0 ?
                            this.state.ARTISTS.map((a) => (
                                <li className="select-srch-li">
                                    <div
                                        className="selected-search-select-item" 
                                        onClick={()=>this.popArtist(a.id)}>
                                        <img className="pop-item-btn" src={popItemIcon} alt="Ikona usuwania albumu."></img>{
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
                <p className="input-label">Album</p>
                {
                        this.state.ALBUM ?
                        <div
                            className="selected-search-select-item" 
                            onClick={this.clearAlbum}>
                            <img className="pop-item-btn" src={popItemIcon} alt="Ikona usuwania albumu."></img>
                            {
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
                <p className="input-label">EXPLICIT</p>
                <input
                    onChange={this.handleChange}
                    type="checkbox" 
                    checked={_explicit}
                    value={this.state.explicit}
                    name="explicit"/>
                <p className="tiny-caption">
                Zaznacz, jeśli uważasz, że utwór jest wulgarny.
                    Wulgarny utwór to taki, który zawiera przekleństwa, 
                    język lub sztukę o charakterze seksualnym, brutalnym 
                    lub obraźliwym. To od Ciebie zależy, czy Twoja muzyka 
                    zostanie oznaczona jako wulgarna</p>                    
                <p className="input-label">Taneczność</p>                
                <input
                    onChange={this.handleChange} 
                    type="range" 
                    name="danceability" 
                    value={this.state.danceability}
                    min="0"
                    step="0.01" 
                    max="1"/>
                <p 
                    className="spotify-feature-numerical">
                        {this.state.danceability ? this.state.danceability : "0"}</p>    
                <p className="input-label">Energia</p>
                <input
                    onChange={this.handleChange} 
                    type="range"
                    value={this.state.energy}
                    name="energy" 
                    min="0"
                    step="0.01"  
                    max="1"/>
                <p className="spotify-feature-numerical">
                    {this.state.energy ? this.state.energy : "0"}</p>
                <p className="input-label">Akustyczność</p>
                <input 
                    onChange={this.handleChange}
                    type="range" 
                    name="acousticness" 
                    value={this.state.acousticness}
                    min="0" 
                    step="0.01" 
                    max="1"/>
                <p className="spotify-feature-numerical">
                    {this.state.acousticness ? this.state.acousticness : "0"}</p>
                <p className="input-label">Żywe instrumenty</p>                
                <input 
                    onChange={this.handleChange} 
                    type="range" 
                    value={this.state.instrumentalness}
                    name="instrumentalness" 
                    min="0" 
                    step="0.01" 
                    max="1"/>
                <p className="spotify-feature-numerical">
                    {this.state.instrumentalness ? this.state.instrumentalness : "0"}</p>
                <p className="input-label">Pozytywność</p>
                <input 
                    onChange={this.handleChange}
                    type="range" 
                    name="valence" 
                    value={this.state.valence}
                    min="0" 
                    step="0.01" 
                    max="1"/>                                                   
                <p className="spotify-feature-numerical">
                    {this.state.valence ? this.state.valence : "0"}</p>                                                  
                <p className="input-label">Klucz</p>
                {this.state.key ? encodeMusicKey(this.state.key) : 
                "Nie określono klucza muzycznego utworu."}
                <select
                    onChange={this.handleChange}  
                    value={this.state.key}
                    name="key">
                    {KEYS.map(key => (
                        <option value={key.id} key={"key_" + key.id}>
                            {key.name}
                        </option>                        
                    ))}        
                </select>
                <p className="input-label">Tryb</p>    
                {this.state.mode ? 
                    this.state.mode==="1" ?
                    "dur" : "moll" 
                : "Nie określono trybu utworu."}                        
                <select 
                    onChange={this.handleChange} 
                    value={this.state.mode}
                    name="mode">
                    <option value="0">moll</option>
                    <option value="1">dur</option>
                </select>
                <p className="input-label">Data wydania</p>
                <input 
                    required
                    onChange={this.handleChange} 
                    id="release_date_input"
                    type="date"
                    value={this.state.release_date}
                    name="release_date"></input>    
                <p className="input-label">Utwór w Spotify</p>
                <input 
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
