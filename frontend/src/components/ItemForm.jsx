import React, { Component, Fragment } from 'react';

import "../styles/ItemForm.css";

/*

    Kompletnie spierdolone

*/


export default class ItemForm extends Component {
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
    
    render() {
        return (
            <Fragment>
                {this.selectAndRenderForm()}
            </Fragment>
        )
    }
}
