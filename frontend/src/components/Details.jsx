import React, { Component, Fragment } from 'react'

import SpotifyFeaturesChart from './SpotifyFeaturesChart';

import YouTubeSearch from './YouTubeSearch';

import { 
    encodeMusicKey,
    formatDatetime, 
    onlyUniqueFilter
} from '../constants';

import { getSongsOfAlbumRequest } from '../requests';

const spotify_icon = "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg";


const TogglerBtn = (props) => {
    return (
        <button 
            className="toggle-details-btn"
            id={"toggle_details_".concat(props.id)} 
            onClick={props.toggleItemDetails}>
            {
                props.details_expanded ?
                "Pokaż mniej" : "Pokaż więcej"
            }                                    
        </button>  
    )
}

const SongDetails = (props) => {
    const SPOTIFY_FEATURES_DATASET = {
        "danceability"       : parseFloat(props.item.danceability),
        "energy"             : parseFloat(props.item.energy),
        "acousticness"       : parseFloat(props.item.acousticness),
        "instrumentalness"   : parseFloat(props.item.instrumentalness),
        "valence"            : parseFloat(props.item.valence)
    };

    var _artists_names = [];
    var album_name = "";
    var musicKey = false;
    var mode = false;

    if (props.item.key) {
        musicKey = encodeMusicKey(parseInt(props.item.key));
    }
    if (props.item.mode) {
        if (parseInt(props.item.mode) === 0) {
            mode = 'moll';
        } else {
            mode = 'dur';
        }
    }    
    if (props.item._artists_names && props.item._artists_names !== "[null]") {
        _artists_names = JSON.parse(props.item._artists_names).filter(onlyUniqueFilter);
    }    
    if (props.item.album_name) {
        album_name = props.item.album_name;
    }    
    
    return (
        <div className="details-box">
            <div className="details-p">
                <div>
                    { _artists_names ? 
                        <Fragment>
                            { _artists_names.length ? <p className="tiny-caption">WYKONAWCY</p> : null }                            
                            <div>{
                                _artists_names.map((a, index) => {
                                    if (index===_artists_names.length-1) {
                                        return <div className="pink-h">{a}</div>;
                                    } else { return <div className="pink-h">{a}, </div>; }                            
                                })} 
                            </div>
                        </Fragment>
                        : <p>Brak informacji o artystach</p>
                    }
                </div>
                <p className="tiny-caption">DATA WYDANIA</p>
                <p className="release-date">
                    {
                    props.item.release_date ?
                    formatDatetime(props.item.release_date) : "Brak daty powstania"
                    }
                </p>                
                {musicKey || mode ? <p className="tiny-caption">TONACJA UTWORU</p> : null} 
                <p className="mkey">                    
                    {musicKey} {mode}
                </p>
            </div>
            <div className="spotify-chart">
                <SpotifyFeaturesChart DATASET={SPOTIFY_FEATURES_DATASET}/>
            </div>            
        </div>        
    )
}


class AlbumDetails extends Component {
    state = {
        songs   : [],
        artists : []
    };

    async _getSongsOfAlbum(album_id) {
        return getSongsOfAlbumRequest(album_id).then(songs => songs)
    }

    async componentDidMount() {
        var _songs = await this._getSongsOfAlbum(this.props.item.id);   
        var _artists = [];
        if (this.props.item._artist_ids && this.props.item._artist_names !== "[null]") {
            var _artists_names = JSON.parse(this.props.item._artist_names).filter(onlyUniqueFilter);
            var _artists_ids = JSON.parse(this.props.item._artist_ids).filter(onlyUniqueFilter);
            _artists_names.forEach((a, i) => {
                _artists[i] = { name : a, id : _artists_ids[i] };
            });    
        }                     
        this.setState({ 
            songs   : _songs,
            artists : _artists
        });
    }    

    render() {
        return (
            <Fragment>       
                <div>
                    { this.state.artists ? 
                        this.state.artists.length ? 
                        <Fragment>
                            <p className="tiny-caption">WYKONAWCY</p>
                            {this.state.artists.map((a, index) => {
                                if (index===this.state.artists.length-1) {
                                    return <div className="pink-h">{a.name}</div>;
                                } else { return <div className="pink-h">{a}, </div>; }
                            })}
                        </Fragment> : null
                        : null
                    }
                </div>       
                <p>
                    {
                        this.props.item.release_date ?
                        <Fragment>
                            <p className="tiny-caption">DATA WYDANIA</p>
                            <p className="release-date">
                                {formatDatetime(this.props.item.release_date)}
                            </p>                            
                        </Fragment>
                        : null
                    }
                </p>                         
                <div>                  
                    <ul>
                        {
                            this.state.songs ?
                                this.state.songs.length ?
                                <Fragment>
                                    <p className="tiny-caption">UTWORY</p>
                                    {this.state.songs.map((s, i) => {
                                        if (s.spotify_link) {
                                            return (
                                            <li className="album-track" key={s.id}>
                                                <div className="track-no">{i+1}</div>                                        
                                                {
                                                s.spotify_link ?
                                                    <a
                                                    target="_blank" rel="noreferrer"  
                                                    href={s.spotify_link}>
                                                    <img
                                                        className="track-spotify-icon"
                                                        alt="Ikona spotify." 
                                                        src={spotify_icon}></img>    
                                                    </a>
                                                : <YouTubeSearch 
                                                    category={"songs"}
                                                    query={"name"}/>
                                                }                                            
                                                {s.name.length>=35 ? s.name.slice(0, 40) + "..." : s.name}                                            
                                            </li>)       
                                        } else {
                                            return <li key={s.id}>{i+1}. {s.name}</li>;       
                                        }                                
                                    })}
                                </Fragment> : <p>Brak utworów.</p>
                            : <p>Brak utworów.</p>
                        }                        
                    </ul>
                </div>
            </Fragment>        
        )
    }
}


const ArtistDetails = (props) => {
    var _albums = [];
    var countryName, country;
    if (props.item._albums_ids && props.item._albums_ids !== "[null]") {
        var _albums_names = JSON.parse(props.item._albums_names).filter(onlyUniqueFilter);
        var _albums_ids = JSON.parse(props.item._albums_ids).filter(onlyUniqueFilter);
        _albums_names.forEach((a, i) => {
            _albums[i] = { name : a, id : _albums_ids[i] };
        });    
    }                     
    
    if (props.item.country) {
        country = props._COUNTRIES.filter((country) => {
            return country.iso_code === props.item._country_name
        });
        countryName = country.name;
    } else {
        countryName = "Brak informacji o kraju pochodzenia.";
    }

    return (
        <Fragment>   
            {props.item.description ?
                <Fragment>
                    <p className="tiny-caption">O WYKONAWCY</p>
                    <p>{props.item.description}</p>                    
                </Fragment> : null
            }     
            <p className="tiny-caption">KRAJ POCHODZENIA</p>       
            <p className="italic-colored-small">{countryName}</p>            
                {
                _albums ?
                    <ul>
                    {_albums.length ? 
                    <p className="tiny-caption">ALBUMY</p> : <p>Brak albumów.</p>}
                    {
                    _albums.map((a, i) => (
                        <li key={"album_" + i}>
                            <div className="artists-album">{a.name}</div>
                        </li>
                    ))
                    }
                    </ul> : null
                }                            
        </Fragment>        
    )
}


export default class Details extends Component {
    state = {
        "details_expanded"  : false
    };

    toggleDetails(element_id) {
        const toggle_btn_id = 'toggle_details_'.concat(element_id);
        if (this.state.details_expanded) {
            this.setState({"details_expanded" : false});
        } else {
            this.setState({"details_expanded" : true});
        }
    }
    
    render() {
        return (
            <div>
                {
                this.state.details_expanded ?
                    <Fragment>                          
                        <TogglerBtn 
                            toggleItemDetails={() => this.toggleDetails(this.props.item.id)}
                            id={this.props.item.id}
                            details_expanded={this.state.details_expanded}/>                        
                        {
                            this.props.category==='songs' ?
                            <SongDetails item={this.props.item}/> : null
                        }
                        {
                            this.props.category==='albums' ?
                            <AlbumDetails item={this.props.item}/> : null
                        }
                        {
                            this.props.category==='artists' ?
                            <ArtistDetails 
                                _COUNTRIES={this.props._countries}
                                countries={this.state.COUNTRIES}
                                item={this.props.item}/> : null
                        }                        
                    </Fragment>
                    :       
                    <TogglerBtn                    
                        toggleItemDetails={() => this.toggleDetails(this.props.item.id)}
                        id={'toggle_details_'.concat(this.props.item.id)}
                        details_expanded={this.state.details_expanded}/>                            
                }
            </div>
        )
    }
}
