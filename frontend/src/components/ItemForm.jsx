import React, { Component, Fragment } from 'react';

import SongForm from './SongForm';
import AlbumForm from './AlbumForm';

import "../styles/ItemForm.css";

/*

    Kompletnie spierdolone

*/


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
        if (this.state.edited_song) {
            this.props.onSave(this.state.edited_song);
        }
        if (this.state.edited_album) {
            this.props.onSave(this.state.edited_album);
        }
        if (this.state.edited_artist) {
            this.props.onSave(this.state.edited_artist);
        }
    }

    render() {
        return (
            <Fragment>
                <div className="above-box">
                    {
                        this.props.category==="songs" ? 
                        <SongForm 
                            _editing={true}
                            category={this.props.category}
                            instance={this.props.instance}
                            getEditedSong={s=>{this.setEditedItemObj("edited_song", s)}}/>
                        : 
                        null
                    }
                    {
                        this.props.category==="albums" ? 
                        <AlbumForm 
                            _editing={true}
                            category={this.props.category}
                            instance={this.props.instance}
                            getEditedAlbum={a=>{this.setEditedItemObj("edited_album", a)}}/>
                        : 
                        null
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