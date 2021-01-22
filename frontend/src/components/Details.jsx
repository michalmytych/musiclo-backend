import React, { Component, Fragment } from 'react'

import SpotifyFeaturesChart from './SpotifyFeaturesChart';

import { encodeMusicKey, encodeCountryKey } from '../constants';


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
        "danceability"       : props.item.danceability,
        "energy"             : props.item.energy,
        "acousticness"       : props.item.acousticness,
        "instrumentalness"   : props.item.instrumentalness,
        "liveness"           : props.item.liveness,
        "valence"            : props.item.valence
    };

    const musicKey = encodeMusicKey(props.item.key);
    
    return (
        <div className="details-box">
            <div className="details-p">
                <p className="italic-colored">{props.item.name}</p>
                <p className="mkey">{musicKey}{props.item.mode===0 ? " moll" : " dur"}</p>
            </div>
            <div className="details-p">
                <SpotifyFeaturesChart DATASET={SPOTIFY_FEATURES_DATASET}/>    
            </div>            
        </div>        
    )
}


const AlbumDetails = (props) => {

    return (
        <Fragment>
            <p>{props.item.name}</p>
        </Fragment>        
    )
}


const ArtistDetails = (props) => {
    const countryName = encodeCountryKey(props.item.country);

    return (
        <Fragment>
            <p>{props.item.name}</p>
            <p>Twórczość</p>
            <p className="italic-colored">{countryName}</p>
        </Fragment>        
    )
}


export default class Details extends Component {
    state = {
        "details_expanded" : false
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
                            <ArtistDetails item={this.props.item}/> : null
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
