import React, { Component } from 'react';

import SearchSelect from './SearchSelect';

import { setDateInputValue } from '../display';

import { onlyUniqueFilter } from '../constants';

import { getSongsOfAlbumRequest } from '../requests';


export default class AlbumForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"          : "",
            "artists_ids"   : [],
            "artists_names" : [],
            "songs_ids"     : [],
            "explicit"      : false,
            "release_date"  : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSelectedArtists = this.getSelectedArtists.bind(this);
        this.getSelectedSongs = this.getSelectedSongs.bind(this);
        this._getSongsOfAlbum = this._getSongsOfAlbum.bind(this);
        this._mountInstance = this._mountInstance.bind(this);        
    }

    getSelectedArtists(selections) {
        this.setState({
            "artists_ids" : this.state.artists_ids.concat(selections)
        });
    }

    getSelectedSongs(selections) {
        this.setState({
            "songs_ids" : this.state.songs_ids.concat(selections)
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async _getSongsOfAlbum(album_id) {
        var SONGS = await getSongsOfAlbumRequest(album_id);
        return SONGS;
    }

    handleSubmit(event) {
        console.log(this.state);
        alert("s");
        this.props.getEditedAlbum({
            obj         : this.state,
            category    : 'albums'
        });
        event.preventDefault();
    }

    async _mountInstance(instance) {
        var _songs = await this._getSongsOfAlbum(instance.id);
        // SPRAWDZIĆ
        var _artists_ids = JSON.parse(instance._artist_ids).filter(onlyUniqueFilter);
        var _artists_names = JSON.parse(instance._artist_names).filter(onlyUniqueFilter);
        this.setState({
            "name"              : instance.name,
            "artists_ids"       : instance.artist_ids,
            "explicit"          : parseInt(instance.explicit),
            "spotify_link"      : instance.spotify_link,
            "release_date"      : instance.release_date,
            "artists_ids"       : _artists_ids,
            "artists_names"     : _artists_names,
            "songs_list"        : _songs
        });
    }

    componentDidMount() {
        if (this.props._editing) {
            this._mountInstance(this.props.instance);
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
                    <h4>Edytowanie {this.props.instance.name}</h4>
                    :
                    null
                }
                <p>Nazwa albumu</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p>Artyści</p>
                <ul>
                    {
                        this.state._artists_ids ?
                            this.state._artists_ids.length ?
                            this.state._artists_ids.map((a) => (
                                <li>{a}</li>
                            )) : <p>Brak wykonawców.</p>
                        : null
                    }
                </ul>                
                <SearchSelect 
                    multiple_choice={true}
                    _getInitialValue={(p) => this.getSelectedArtists(p)}
                    getValues={(p) => this.getSelectedArtists(p)} 
                    category={"artists"} />
                <p>Utwory</p>
                <SearchSelect 
                    multiple_choice={true}
                    _getInitialValue={(s) => this.getSelectedSongs(s)}
                    getValues={(s) => this.getSelectedSongs(s)}
                    category={"songs"} />
                <p>Czy explicit</p>
                <input
                    onChange={this.handleChange}
                    type="checkbox" 
                    value={this.state.explicit}
                    name="explicit"/>
                <p>Data wydania</p>
                <input 
                    onChange={this.handleChange} 
                    id="release_date_input"
                    type="date" 
                    value={this.state.release_date}
                    name="release_date"></input>                               
                <button type={"submit"}>Zapisz</button>                    
            </form>
        )
    }
}
