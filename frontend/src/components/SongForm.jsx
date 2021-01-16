import React, { Component } from 'react'

import SearchSelect from './SearchSelect';

import { KEYS } from '../constants';

import { setDateInputValue } from '../display';


export default class SongForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"              : "",
            "album_id"          : "",
            "explicit"          : false,
            "danceability"      : 0.50,
            "energy"            : 0.50,
            "acousticness"      : 0.50,
            "instrumentalness"  : 0.50,
            "key"               : 0,
            "mode"              : 0,
            "release_date"      : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit() {
        this.props.getEditedSong(this.state);
    }

    async componentDidMount() {
        if (this.props._editing) {
            this.setState({
                "name"              : this.props.instance.name,
                "album_id"          : this.props.instance.album_id,
                "explicit"          : this.props.instance.explicit,
                "danceability"      : this.props.instance.danceability,
                "energy"            : this.props.instance.energy,
                "acousticness"      : this.props.instance.acousticness,
                "instrumentalness"  : this.props.instance.instrumentalness,
                "key"               : this.props.instance.key,
                "mode"              : this.props.instance.mode,
                "release_date"      : this.props.instance.release_date
            });
        } else {
            setDateInputValue('release_date_input');
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {
                    this.props._editing ?
                    <h4>Edytowanie piosenki {this.props.instance.name}</h4>
                    :
                    null
                }
                <p>Wykonawca:</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p>Album:</p>
                <SearchSelect category={"albums"}/>
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
                    onChange={this.handleChange} 
                    id="release_date_input"
                    type="date" 
                    value={this.state.release_date}
                    name="release_date"></input>                               
                <button onClick={this.props.setEditedSong}>Zapisz</button>                    
            </form>
        )
    }
}
