import React, { Component, Fragment } from 'react';

import SearchSelect from './SearchSelect';

import { COUNTRIES } from '../constants';


export default class ArtistForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"          : "",
            "albums_ids"    : [],
            "description"   : "",
            "country"       : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    handleSubmit() {
        this.props.getEditedArtist(this.state);
    }

    async componentDidMount() {
        if (this.props._editing) {
            this.setState({
                "name"          : this.props.instance.name,
                "albums_ids"    : this.props.instance.albums_ids,
                "description"   : "",                
                "country"       : this.props.instance.country,
            });
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {
                    this.props._editing ?
                    <h4>Edytowanie {this.props.instance.name}</h4>
                    :
                    <h4>Dodawanie nowego rekordu</h4>
                }
                <p>Nazwa wykonawcy:</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p>Opis:</p>
                <textarea 
                    onChange={this.handleChange}
                    type="" 
                    name="description" 
                    value={
                        this.state.description ?
                        this.state.description :
                        "Kilka słów o wykonawcy..."}
                    rows="4" cols="50">
                </textarea>                    
                <p>Albumy:</p>
                <SearchSelect category={"albums"} />
                {
                    <Fragment>
                        <p>Kraj:</p>
                        <select
                            onChange={this.handleChange}  
                            value={this.state.country}
                            name="country">
                            {
                                COUNTRIES.map(country => (
                                    <option                                         
                                        value={country.code} 
                                        key={country.code} >
                                        {country.name}
                                    </option>                        
                                ))
                            }       
                        </select>
                    </Fragment>
                }                            
                <button onClick={this.props.setEditedArtist}>Zapisz</button>                    
            </form>
        )
    }
}
