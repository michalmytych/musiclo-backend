import React, { Component, Fragment } from 'react'

import SpotifyFeaturesChart from './SpotifyFeaturesChart';

import { 
    encodeMusicKey,
    formatDatetime 
} from '../constants';

import { getCountriesDataRequest } from '../requests';


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
    var _artists_names = JSON.parse(props.item._artists_names);
    var _albums_names = JSON.parse(props.item._albums_names);
    
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
                <p>
                    { _artists_names ? 
                    _artists_names.map(a => (a)) : "Brak informacji o wykonawcy"
                    }
                </p>
                <p>
                    { _albums_names ? 
                    _albums_names.map(a => (a)) : "Brak informacji o albumie"
                    }
                </p>
                <p className="mkey">{musicKey}{parseInt(props.item.mode)===0 ? " moll" : " dur"}</p>
            </div>
            <div className="details-p">
                <SpotifyFeaturesChart DATASET={SPOTIFY_FEATURES_DATASET}/>    
            </div>            
        </div>        
    )
}


const AlbumDetails = (props) => {
    var _artists_names;
    try {
        _artists_names = JSON.parse(props.item._artists_names);
    } catch {
        _artists_names = false;
    }    

    return (
        <Fragment>
            <h3>{props.item.name}</h3>           
            <p>
                {
                props.item.release_date ?
                formatDatetime(props.item.release_date) : "Brak daty powstania"
                }
            </p>
        </Fragment>        
    )
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
            <h2>{props.item.name}</h2>           
            <p>Twórczość</p>
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
