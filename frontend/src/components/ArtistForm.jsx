import React, { Component, Fragment } from 'react';

import SearchSelect from './SearchSelect';

import { getCountriesDataRequest } from '../requests';


export default class ArtistForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"          : "",
            "albums_ids"    : [],
            "description"   : "",
            "country"       : "",
            "COUNTRIES"     : []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    getSelectedAlbums(selections) {
        this.setState({
            "albums_ids" : this.state.albums_ids.concat(selections)
        });
    }

    handleSubmit(event) {
        this.props.getEditedArtist({
            obj         : this.state,
            category    : 'artists'
        });
        event.preventDefault();
    }

    async componentDidMount() {
        var data = await getCountriesDataRequest();
        this.setState({ "COUNTRIES" : data });   

        if (this.props._editing) {
            if (this.props._editing.instance) {
                this.setState({
                    "name"          : this.props.instance.name,
                    "albums_ids"    : this.props.instance.albums_ids,
                    "description"   : "",                
                    "country"       : this.props.instance.country,
                });
            } else {
                console.log("Błąd podczas pobierania obiektu.");
            }            
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {
                    this.props._editing ?
                    <h4>Edytowanie {this.props.instance.name}</h4>
                    :
                    <h4>Dodawanie</h4>
                }
                <p>Nazwa wykonawcy</p>
                <input 
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p>Opis</p>
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
                <p>Albumy</p>
                <SearchSelect 
                    multiple_choice={true}
                    _getInitialValue={(p) => this.getSelectedAlbums(p)}
                    getValues={(p) => this.getSelectedAlbums(p)} 
                    category={"albums"} />
                {
                    <Fragment>
                        <p>Kraj</p>
                        <select
                            onChange={this.handleChange}  
                            value={this.state.country}
                            name="country">
                            {
                                this.state.COUNTRIES.length ?
                                this.state.COUNTRIES.map(country => (
                                    <option                                         
                                        value={country.iso_code} 
                                        key={country.is_code} >
                                        {country.name}
                                    </option>                        
                                ))
                                :
                                null
                            }       
                        </select>
                    </Fragment>
                }                            
                <button type={"submit"}>Zapisz</button>                    
            </form>
        )
    }
}
