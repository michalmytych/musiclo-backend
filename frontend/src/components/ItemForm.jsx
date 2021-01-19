import React, { Component, Fragment } from 'react';

import SongForm from './SongForm';
import AlbumForm from './AlbumForm';
import ArtistForm from './ArtistForm';

import "../styles/ItemForm.css";


export default class ItemForm extends Component {
    state = {
        "edited_song"   : false,
        "edited_album"  : false,
        "edited_artist" : false
    };

    setEditedItemObj(key, obj) {
        this.setState({
            [key] : obj,
        });
    }

    componentDidUpdate() {
        if (this.props._editing) {
            if (this.state.edited_song) {
                this.props.onSave(this.state.edited_song);
                this.setState({"edited_song" : false});
            }
            if (this.state.edited_album) {
                this.props.onSave(this.state.edited_album);
                this.setState({"edited_album" : false});
            }
            if (this.state.edited_artist) {
                this.props.onSave(this.state.edited_artist);
                this.setState({"edited_artist" : false});
            }
        } else {
            console.log('Tu bedzie kod dodawania');
        }
    }

    render() {
        var edition_mode = this.props._editing;

        return (
            <Fragment>
                <div className="above-box">
                    {
                        this.props.category==="songs" ? 
                        <SongForm 
                            _editing={edition_mode}
                            category={this.props.category}
                            instance={this.props.instance}
                            getEditedSong={s=>{this.setEditedItemObj("edited_song", s)}}/>
                        : null
                    }
                    {
                        this.props.category==="albums" ? 
                        <AlbumForm 
                            _editing={edition_mode}
                            category={this.props.category}
                            instance={this.props.instance}
                            getEditedAlbum={a=>{this.setEditedItemObj("edited_album", a)}}/>
                        : null
                    }     
                    {
                        this.props.category==="artists" ? 
                        <ArtistForm 
                            _editing={edition_mode}
                            category={this.props.category}
                            instance={this.props.instance}
                            getEditedArtist={a=>{this.setEditedItemObj("edited_artist", a)}}/>
                        : null
                    }                                   
                    <button onClick={this.props.toggler}>Anuluj</button>
                </div>
            </Fragment>
        )
    }
}



/*

                    {
                        this.props.category==="albums" ?
                        <SongForm getEditedAlbum={a=>{this.setEditedAlbum(a)}}/>                
                        : 
                        null                        
                    }
                    {
                        this.props.category==="artists" ?
                        <SongForm getEditedArtist={a=>{this.setEditedArtist(a)}}/>
                        : 
                        null
                    }




    renderSongForm() {
        return (
            <div className="above-box">
                <form>
                    <h4>Edytowanie itemu: {this.props.instance.name}</h4>
                    <p>Podaj nazwę wykonawcy:</p>
                    <input type="text" placeholder="Nazwa..."></input>
                    <p>Podaj nazwę albumu:</p>
                    <input type="text" placeholder="Album..."></input>
                    <button onClick={this.props.onSave}>Zapisz</button>                    
                </form>
                <button onClick={this.props.toggler}>Anuluj</button>
            </div>
        )
    }
    
    renderAlbumForm() {
        return (
            <div>
                <h1>Edycja albumu</h1>
                <button onClick={this.props.toggler}>Anuluj</button>
            </div>
        )
    }

    renderArtistForm() {
        return (
            <div>
                <h1>Edycja artysty</h1>
                <button onClick={this.props.toggler}>Anuluj</button>
            </div>
        )
    }

    selectAndRenderForm() {
        switch (this.props.category) {
            case 'songs':
                this.renderSongForm();
            case 'songs':
                this.renderAlbumForm();
            case 'songs':
                this.renderArtistForm();
        }
    }
*/