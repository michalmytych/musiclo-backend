import React, { Component, Fragment } from 'react'

import '../styles/Item.css';

import DeleteBtn from './DeleteBtn';
import EditBtn from './EditBtn';
import Confirm from './Confirm';
import ItemForm from './ItemForm';
import SpotifyPlugin from './SpotifyPlugin';
import YouTubeSearch from './YouTubeSearch';
import Details from './Details';

import {
    deleteItemRequest,
    putEditedItemRequest
} from '../requests.js';

import { validateItemBeforePost } from '../validators';


export default class Item extends Component {
    state = {
        "show_confirmation_box" : false,
        "show_edition_box"      : false,
        "edited_object"         : {}
    };

    toggleConfirmationDisplay = () => {
        this.setState({
            "show_confirmation_box" : !this.state.show_confirmation_box,
        });
    }

    toggleEditionFormDisplay = () => {
        this.setState({
            "show_confirmation_box" : false,
            "show_edition_box"      : !this.state.show_edition_box
        });
    }

    /*
        CRUD methods for single item instance
    */
    async _deleteItem(item_id) {
        let res = await deleteItemRequest({
            "cat"   : this.props.category, 
            "id"    : item_id
        });
        if (res) {
            this.props.popDeletedItem(item_id);
            alert("Usunięto!");
        } else {
            alert("Request nie powiódł się!");
        }
    }

    async _editItem(args) {
        var validArgs = validateItemBeforePost(args);
        if (validArgs) {
            validArgs.id = args.id;
            let res = await putEditedItemRequest(validArgs);
            if (res) {
                alert("Zapisano zmiany!");
            } else {
                alert("Request nie powiódł się!");
            }
        } else {
            alert("Niepoprawne dane!");
        }     
    }

    render() {
        return (
            <Fragment>
                {
                this.props.item ?
                <Fragment>
                    <div 
                        id={"item_row_" + this.props.item.id}>
                    {
                        this.state.show_confirmation_box ?
                        <Fragment>
                            <div
                                onClick={this.toggleConfirmationDisplay} 
                                className="animate__animated animate__fadeIn blurred-form-background"></div>
                            <Confirm 
                                item={this.props.item}
                                on_ok={() => this._deleteItem(this.props.item.id)}
                                toggler={this.toggleConfirmationDisplay}                    
                                message_header={"Czy napewno chcesz usunąć?"} 
                                message_content={"Tej akcji nie będzie można cofnąć."}/>                                
                        </Fragment>                        
                        : null
                    }
                    {
                        this.state.show_edition_box ?
                        <Fragment>
                            <div
                                onClick={this.toggleEditionFormDisplay} 
                                className="animate__animated animate__fadeIn blurred-form-background"></div>
                            <ItemForm
                                _editing={true}
                                category={this.props.category}            
                                instance={this.props.item}
                                onSave={(edited_object) => this._editItem(edited_object)}
                            toggler={this.toggleEditionFormDisplay} />
                            </Fragment>
                        : null
                    }
                    <div className="Item">                             
                        <div className='item-data'>
                            {
                                this.props.category==='songs' ?
                                <div>
                                    <p className="tiny-caption">TYTUŁ</p>
                                    <h2 className="song-name">{this.props.item.name}</h2>
                                    {
                                        this.props.item.explicit ?
                                        <div className="explicit-mark">E</div> : null
                                    }
                                    {
                                        this.props.item.album_name ?
                                        <Fragment>
                                            <p className="tiny-caption">ALBUM</p>
                                            <h4 className="album-name">{this.props.item.album_name}</h4>   
                                        </Fragment>                                        
                                        : <h5 className="album-name">SINGLE</h5>
                                    }                            
                                    {
                                        this.props.item.spotify_link ?
                                        <SpotifyPlugin 
                                            id={this.props.item.id}
                                            category={this.props.category} 
                                            link={this.props.item.spotify_link}/>
                                        :
                                        <YouTubeSearch 
                                            category={this.props.category}
                                            query={this.props.item.name}/>
                                    }
                                    <Details                                         
                                        item={this.props.item}
                                        category={this.props.category}
                                    />                            
                                </div>                                            
                                :
                                null
                            }
                            {
                                this.props.category==='albums' ?
                                <div>
                                    <p className="tiny-caption">NAZWA</p>
                                    <h2 className="song-name main-album-name">
                                        {this.props.item.name}</h2>                      
                                    {
                                        this.props.item.spotify_link ?
                                        <SpotifyPlugin 
                                            id={this.props.item.id}
                                            category={this.props.category} 
                                            link={this.props.item.spotify_link}/>
                                        :
                                        <YouTubeSearch 
                                            category={this.props.category}
                                            query={this.props.item.name}/>
                                    }                      
                                    <Details 
                                            item={this.props.item}
                                            category={this.props.category}
                                        />                              
                                </div>
                                :
                                null
                            }
                            {
                                this.props.category==='artists' ?
                                <div>
                                    <p className="tiny-caption">NAZWA</p>
                                    <h2 className="songs-name artist-name">{this.props.item.name}</h2>                           
                                    {
                                        this.props.item.spotify_link ?
                                        <SpotifyPlugin 
                                            id={this.props.item.id}
                                            category={this.props.category} 
                                            link={this.props.item.spotify_link}/>
                                        :
                                        <YouTubeSearch 
                                            category={this.props.category}
                                            query={this.props.item.name}/>
                                    }
                                    <Details 
                                            _countries={this.props._countries}
                                            item={this.props.item}
                                            category={this.props.category}
                                        />                                                      
                                </div>
                                :
                                null
                            }   
                        </div>
                        <div className='item-crud-options'>
                            <EditBtn 
                                handler={() => this.toggleEditionFormDisplay()}/>
                            <DeleteBtn 
                                handler={() => this.toggleConfirmationDisplay()}/>
                        </div>
                    </div>
                    </div>
                            </Fragment>
                            :
                            null
                    }
            </Fragment>            
        )
    }
}
