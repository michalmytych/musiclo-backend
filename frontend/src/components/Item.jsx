import React, { Component } from 'react'

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

import { setElementDisplay } from '../display';


export default class Item extends Component {
    state = {
        "show_confirmation_box" : false,
        "show_edition_box"      : false,
        "edited_object"         : {}
    };

    toggleConfirmationDisplay = () => {
        this.setState({
            "show_edition_box" : false,
            "show_confirmation_box" : !this.state.show_confirmation_box
        });
    }

    toggleEditionFormDisplay = () => {
        this.setState({
            "show_confirmation_box" : false,
            "show_edition_box"      : !this.state.show_edition_box
        });
    }

    // CRUD methods for single item instance
    async _deleteItem(item_id) {
        await deleteItemRequest(this.props.category, item_id);
        this.props.popDeletedItem(item_id);
    }

    async _editItem(args) {
        await putEditedItemRequest(args);
        this.props.refreshAfterEdit();
    }

    render() {
        return (
            <div id={"item_row_" + this.props.item.id}>
            {
                this.state.show_confirmation_box ?
                <Confirm 
                    item={this.props.item}
                    on_ok={() => this._deleteItem(this.props.item.id)}
                    toggler={this.toggleConfirmationDisplay}                    
                    message_header={"Czy napewno chcesz usunąć?"} 
                    message_content={"Tej akcji nie będzie można cofnąć."}/>
                : null
            }
            {
                this.state.show_edition_box ?
                <ItemForm
                    _editing={true}
                    category={this.props.category}            
                    instance={this.props.item}
                    onSave={(edited_object) => this._editItem(edited_object)}
                toggler={this.toggleEditionFormDisplay} />
                : null
            }
            <div className="Item">                             
                <div className='item-data'>
                    {
                        this.props.category==='songs' ?
                        <div>
                            <h5>Piosenka: {this.props.item.name}</h5>
                            {
                                <Details 
                                    item={this.props.item}
                                    category={this.props.category}
                                />
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
                        </div>                                            
                        :
                        null
                    }
                    {
                        this.props.category==='albums' ?
                        <div>
                            <h5>Album: {this.props.item.name}</h5>
                            <Details 
                                    item={this.props.item}
                                    category={this.props.category}
                                />                        
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
                        </div>
                        :
                        null
                    }
                    {
                        this.props.category==='artists' ?
                        <div>
                            <h5>Artysta: {this.props.item.name}</h5>
                            <Details 
                                    item={this.props.item}
                                    category={this.props.category}
                                />                            
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
        )
    }
}
