import React, { Component, Fragment } from 'react'

import '../styles/Item.css';

import DeleteBtn from './DeleteBtn';
import EditBtn from './EditBtn';
import Confirm from './Confirm';
import ItemForm from './ItemForm';


import {
    deleteItemRequest,
    putEditedItemRequest
} from '../requests.js';


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

    // CRUD methods:
    deleteItem = (item_id) => {
        const item_category = this.props.category;
        deleteItemRequest(item_category, item_id);
        /* 
        1. Wyslij request usuwajacy item o kategorii i id okreslonej w parametrach
        2. Ewentualnie zmień state List.jsx aby lista się odświeżyła
        */
    }

    editItem = (object, category) => {
        putEditedItemRequest(object, category);
        /* 
        1. Wyslij request usuwajacy item o kategorii i id okreslonej w parametrach
        2. Ewentualnie zmień state List.jsx aby lista się odświeżyła
        */
    }

    render() {
        return (
            <Fragment>
            {
                this.state.show_confirmation_box ?
                <Confirm 
                    item={this.props.item}
                    on_ok={() => this.deleteItem(this.props.item.id)}
                    toggler={this.toggleConfirmationDisplay}                    
                    message_header={"Czy napewno chcesz usunąć?"} 
                    message_content={"Tej akcji nie będzie można cofnąć."}/>
                : null
            }
            {
                this.state.show_edition_box ?
                <ItemForm
                    category={this.props.category}
                    setEditedItem={item=>{this.setState(item)}}               
                    instance={this.props.item}
                    onSave={() => this.editItem(
                        this.state.edited_object,
                        this.props.category
                    )}
                    toggler={this.toggleEditionFormDisplay} />
                : null
            }
            <div className="Item">                             
                <div className='item-data'>
                    {
                        this.props.category==='songs' ?
                        <h5>Piosenka: {this.props.item.name}</h5>
                        :
                        null
                    }
                    {
                        this.props.category==='albums' ?
                        <h5>Album: {this.props.item.name}</h5>
                        :
                        null
                    }
                    {
                        this.props.category==='artists' ?
                        <h5>Artysta: {this.props.item.name}</h5>
                        :
                        null
                    }   
                </div>
                <div className='item-crud-options'>
                    <EditBtn 
                        handler={() => {
                            this.toggleEditionFormDisplay();
                        }}/>
                    <DeleteBtn 
                        handler={() => {
                            this.toggleConfirmationDisplay();
                        }}/>
                </div>
            </div>
            </Fragment>
        )
    }
}
