import React, { Component, Fragment } from 'react'

import SpotifyFeaturesChart from './SpotifyFeaturesChart';

import { 
    encodeMusicKey,
    formatDatetime, 
    onlyUniqueFilter
} from '../constants';

import { 
    getCountriesDataRequest,
    getSongsOfAlbumRequest
 } from '../requests';

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

    const musicKey = encodeMusicKey(parseInt(props.item.key));
    var _artists_names = JSON.parse(props.item._artists_names).filter(onlyUniqueFilter);
    var _albums_names = JSON.parse(props.item._albums_names).filter(onlyUniqueFilter);
    
    return (
        <div className="details-box">
            <div className="details-p">
                <p className="italic-colored">{props.item.name}</p>
                <p>
                    {
                    props.item.release_date ?
                    formatDatetime(props.item.release_date) : "Brak daty powstania"
                    }
                </p>
                <div>
                    { _artists_names ? 
                        _artists_names.map((a, index) => {
                            if (index===_artists_names.length-1) {
                                return <span>{a}</span>;
                            } else { return <span>{a}, </span>; }                            
                        }) 
                        : null
                    }
                </div>
                <div>
                    { _albums_names ? 
                        _albums_names.map((a, index) => {
                            if (index===_albums_names.length-1) {
                                return <span>{a}</span>;
                            } else { return <span>{a}, </span>; }                            
                        }) 
                        : null
                    }
                </div>
                <p className="mkey">{musicKey}{parseInt(props.item.mode)===0 ? " moll" : " dur"}</p>
            </div>
            <div className="details-p">
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
        var SONGS = await getSongsOfAlbumRequest(album_id);
        return SONGS;
    }

    async componentDidMount() {
        var _songs = await this._getSongsOfAlbum(this.props.item.id);        
        var _artists_names = JSON.parse(this.props.item._artist_names).filter(onlyUniqueFilter);
        var _artists_ids = JSON.parse(this.props.item._artist_ids).filter(onlyUniqueFilter);
        var _artists = [];
        _artists_names.forEach((a, i) => {
            _artists[i] = { id : a, name : _artists_ids[i] };
        });
        this.setState({ 
            songs   : _songs,
            artists : _artists
        });
    }    

    render() {
        return (
            <Fragment>
                <h3>{this.props.item.name}</h3>           
                <p>
                    {
                        this.props.item.release_date ?
                        formatDatetime(this.props.item.release_date) 
                        : "Brak daty powstania"
                    }
                </p>
                <div>
                    { this.state._artists ? 
                        this.state._artists.map((a, index) => {
                            if (index===this.state._artists.length-1) {
                                return <span>{a.name}</span>;
                            } else { return <span>{a}, </span>; }                            
                        }) 
                        : null
                    }
                </div>                
                <div>
                    <h4>Utwory</h4>                    
                    <ul>
                        {
                            this.state.songs ?
                            this.state.songs.map((s, i) => {
                                if (s.spotify_link) {
                                    return (<li key={s.id}>{i+1}. {s.name}
                                    <a
                                    target="_blank" rel="noreferrer"  
                                    href={s.spotify_link}>
                                    <img
                                        style={{width: "1.2rem"}} 
                                        alt="Ikona spotify." 
                                        src={spotify_icon}></img>    
                                    </a>
                                    </li>)       
                                } else {
                                    return <li key={s.id}>{i+1}. {s.name}</li>;       
                                }                                
                            }) : <p>Brak utworów.</p>
                        }                        
                    </ul>
                </div>
            </Fragment>        
        )
    }
}


const ArtistDetails = (props) => {
    var countryName, country;
    if (props.item.country) {
        country = props.countries.filter((country) => {
            return country.iso_code === props.item.country
        });
        countryName = country.name;
    } else {
        countryName = "Brak informacji o kraju pochodzenia.";
    }

    return (
        <Fragment>   
            <p>{props.item.description}</p>
            <p className="italic-colored-small">{countryName}</p>
        </Fragment>        
    )
}


export default class Details extends Component {
    state = {
        "details_expanded"  : false,
        "COUNTRIES"         : []
    };

    toggleDetails(element_id) {
        const toggle_btn_id = 'toggle_details_'.concat(element_id);
        if (this.state.details_expanded) {
            this.setState({"details_expanded" : false});
        } else {
            this.setState({"details_expanded" : true});
        }
    }

    async componentDidMount() {
        var data = await getCountriesDataRequest()
        .then(data => this.setState({ "COUNTRIES" : data }));  
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
