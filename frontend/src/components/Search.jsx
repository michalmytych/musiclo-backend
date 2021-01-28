import React, { Component } from 'react';

import { getSearchResultsRequest } from '../requests';

import '../styles/Search.css';



export default class SearchSelect extends Component {
    constructor() {
        super();
        this.state = {
            "category_name"     : "",
            "search_input"      : ""
            
        };
        this.handleChange = this.handleChange.bind(this);
        this._getSearchResults = this._getSearchResults.bind(this);
        this.setSearchCategory = this.setSearchCategory.bind(this);
    }

    async _getSearchResults(category, phrase) {
        var results = await getSearchResultsRequest({
            c : category, 
            p : phrase
        });

        this.props._setSearchResults({results: results, show: true});
    }

    setSearchCategory = () => {
        switch(this.props.category) {
            case 'songs':
                this.setState({ "category_name" : "piosenkę" }); break;
            case 'albums':
                this.setState({ "category_name" : "album" }); break;
            case 'artists':
                this.setState({ "category_name" : "wykonawcę" }); break;
            default:
                this.setState({ "category_name" : "piosenkę" }); break;
        }
    }

    handleChange(event) {        
        this.setState({
            [event.target.name] : event.target.value
        });
        if (!event.target.value) {
            this.props._setSearchResults({results: [], show: false});
        } else {
            this._getSearchResults(this.props.category, event.target.value);
        }
    }

    componentDidMount = () => {
        this.setSearchCategory();
    }

    render() {
        return (
            <div className="Search">
                <input
                    autocomplete="off"
                    contenteditable="true" 
                    value={this.state.phrase}
                    onChange={this.handleChange} 
                    placeholder={"Znajdź..."}
                    className="search-bar-input"
                    name="search_input" ></input>
            </div>
        )
    }
}
