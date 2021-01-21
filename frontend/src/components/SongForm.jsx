import React, { Component } from 'react'

import SearchSelect from './SearchSelect';

import { KEYS } from '../constants';

import { setDateInputValue } from '../display';


export default class SongForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"              : "",
            "albums_ids"        : [],
            "artists_ids"       : [],
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
    }

    getSelectedAlbums(selections) {
        this.setState({
            "albums_ids" : this.state.albums_ids.concat(selections)
        });
    }

    getSelectedArtists(selections) {
        this.setState({
            "artists_ids" : this.state.artists_ids.concat(selections)
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

    componentDidMount() {
        if (this.props._editing) {
            if (this.props.instance) {
                this.setState({
                    "name"              : this.props.instance.name,
                    "albums_ids"        : this.props.instance.albums_ids,
                    "artists_ids"       : this.props.instance.artists_ids,
                    "explicit"          : this.props.instance.explicit,
                    "danceability"      : this.props.instance.danceability,
                    "energy"            : this.props.instance.energy,
                    "acousticness"      : this.props.instance.acousticness,
                    "instrumentalness"  : this.props.instance.instrumentalness,
                    "key"               : this.props.instance.key,
                    "valence"           : this.props.instance.valence,
                    "mode"              : this.props.instance.mode,
                    "release_date"      : this.props.instance.release_date,
                    "spotify_link"      : this.props.instance.spotify_link,
                });
            } else {
                console.log("Błąd podczas pobierania obiektu.");
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
                <p>Artyści:</p>
                <SearchSelect 
                    required
                    _getInitialValue={(p) => this.getSelectedArtists(p)}
                    getValues={(p) => this.getSelectedArtists(p)} 
                    category={"artists"} />
                <p>Albumy:</p>
                <SearchSelect 
                    _getInitialValue={(p) => this.getSelectedAlbums(p)}
                    getValues={(p) => this.getSelectedAlbums(p)} 
                    category={"albums"}/>
                <p>Czy explicit:</p>
                <input
                    onChange={this.handleChange}
                    type="checkbox" 
                    value={this.state.explicit}
                    name="explicit"/>
                <p>Taneczność:</p>
                <input
                    onChange={this.handleChange} 
                    type="range" 
                    name="danceability" 
                    value={this.state.danceability}
                    min="0"
                    step="0.01" 
                    max="1"/>
                <p>Energia:</p>
                <input
                    onChange={this.handleChange} 
                    type="range"
                    value={this.state.energy}
                    name="energy" 
                    min="0"
                    step="0.01"  
                    max="1"/>
                <p>Akustyczność:</p>
                <input 
                    onChange={this.handleChange}
                    type="range" 
                    name="acousticness" 
                    value={this.state.acousticness}
                    min="0" 
                    step="0.01" 
                    max="1"/>
                <p>Żywe instrumenty:</p>
                <input 
                    onChange={this.handleChange} 
                    type="range" 
                    value={this.state.instrumentalness}
                    name="instrumentalness" 
                    min="0" 
                    step="0.01" 
                    max="1"/>
                <p>Pozytywność:</p>
                <input 
                    onChange={this.handleChange}
                    type="range" 
                    name="valence" 
                    value={this.state.valence}
                    min="0" 
                    step="0.01" 
                    max="1"/>                                                                                                     
                <p>Klucz:</p>
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
                <p>Tryb:</p>                            
                <select 
                    onChange={this.handleChange} 
                    value={this.state.mode}
                    name="mode">
                    <option value="0">moll</option>
                    <option value="1">dur</option>
                </select>
                <p>Data wydania:</p>
                <input 
                    required
                    onChange={this.handleChange} 
                    id="release_date_input"
                    type="date" 
                    value={this.state.release_date}
                    name="release_date"></input>    
                <p>Na spotify:</p>
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
