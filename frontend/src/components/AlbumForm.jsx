import React, { Component } from 'react';

import SearchSelect from './SearchSelect';

import { setDateInputValue } from '../display';


export default class AlbumForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"          : "",
            "artist_ids"    : [],
            "explicit"      : false,
            "release_date"  : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getSelectedArtists(p) {
        this.setState({"artist_ids" : p});
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit() {
        this.props.getEditedAlbum(this.state);
    }

    componentDidMount() {
        if (this.props._editing) {
            this.setState({
                "name"              : this.props.instance.name,
                "artists_ids"       : this.props.instance.artist_ids,
                "explicit"          : this.props.instance.explicit,
                "release_date"      : this.props.instance.release_date
            });
        } else {
            setDateInputValue('release_date_input');
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {
                    this.props._editing ?
                    <h4>Edytowanie piosenki {this.props.instance.name}</h4>
                    :
                    null
                }
                <p>Nazwa albumu:</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p>Artyści:</p>
                <SearchSelect 
                    _getInitialValue={(p) => this.getSelectedArtists(p)}
                    getValues={(p) => this.getSelectedArtists(p)} 
                    category={"artists"} />
                <p>Czy explicit:</p>
                <input
                    onChange={this.handleChange}
                    type="checkbox" 
                    value={this.state.explicit}
                    name="explicit"/>
                <p>Data wydania:</p>
                <input 
                    onChange={this.handleChange} 
                    id="release_date_input"
                    type="date" 
                    value={this.state.release_date}
                    name="release_date"></input>                               
                <button onClick={this.props.setEditedAlbum}>Zapisz</button>                    
            </form>
        )
    }
}
