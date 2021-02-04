import React, { Component, Fragment } from 'react';

import SongForm from './SongForm';
import AlbumForm from './AlbumForm';
import ArtistForm from './ArtistForm';

import "../styles/ItemForm.css";


export default class ItemForm extends Component {
    state = {
        "edited_saved_object"   : false,
        "new_saved_object"      : false
    };

    setEditedItemObj(args) {
        if (this.props._editing) {
            this.setState({
                "edited_saved_object"   : args
            });
        } else {
            this.setState({
                "new_saved_object"      : args
            });
        }
    }

    componentDidUpdate() {
        if (this.props._editing) {
            if (this.state.edited_saved_object) {
                this.props.onSave(this.state.edited_saved_object);
                this.setState({"edited_saved_object" : false});
                this.props.toggler();
            }
        } else {
            if (this.state.new_saved_object) {
                this.props.onSave({
                    obj         : this.state.new_saved_object.obj,
                    category    : this.state.new_saved_object.category
                });
                this.setState({"new_saved_object" : false});
                this.props.toggler();
            }
        }
    }

    render() {
        var edition_mode = this.props._editing;

        return (
            <Fragment>
                <div className="animate__animated above-box animate__fadeInDown">
                    {
                        this.props.category==="songs" ? 
                        <SongForm 
                            _editing={edition_mode}
                            category={this.props.category}
                            instance={this.props.instance}
                            getEditedSong={args=>{this.setEditedItemObj(args)}}/>
                        : null
                    }
                    {
                        this.props.category==="albums" ? 
                        <AlbumForm 
                            _editing={edition_mode}
                            category={this.props.category}
                            instance={this.props.instance}
                            getEditedAlbum={args=>{this.setEditedItemObj(args)}}/>
                        : null
                    }     
                    {
                        this.props.category==="artists" ? 
                        <ArtistForm 
                            _editing={edition_mode}
                            category={this.props.category}
                            instance={this.props.instance}
                            getEditedArtist={args=>{this.setEditedItemObj(args)}}/>
                        : null
                    }                                   
                    <div className="cancel-btn" onClick={this.props.toggler}>Anuluj</div>
                </div>
            </Fragment>
        )
    }
}
