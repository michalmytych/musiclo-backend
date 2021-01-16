import React, { Component } from 'react'

// temp
import { getSearchResultsRequest } from '../requests';


export default class SearchSelect extends Component {
    constructor() {
        super();
        this.state = {
            "results"       : [],
            "category_name" : "",
            "search_input"  : ""
        };
        this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    async getSearchResults(category, search_input) {
        var results = getSearchResultsRequest(category, search_input)
        console.log(results);   
        this.setState({
            "results" : results
        })
    }

    setSearchCategory() {
        switch(this.props.category) {
            case 'songs':
                this.setState({ "category_name" : "piosenkę" }); break;
                // this.getSearchResults(this.props.category, this.state.search_input); break;
            case 'albums':
                this.setState({ "category_name" : "album" }); break;
                // this.getSearchResults(this.props.category, this.state.search_input); break;
            case 'artists':
                this.setState({ "category_name" : "wykonawcę" }); break;
                // this.getSearchResults(this.props.category, this.state.search_input); break;
            default:
                this.setState({ "category_name" : "piosenkę" }); break;
                // this.getSearchResults(this.props.category, this.state.search_input); break;
        }
    }

    handleChange(event) {
        console.clear();
        console.log("Input: " + event.target.value);
        this.getSearchResults(this.props.category, event.target.value);
        this.setState({
            [event.target.name] : event.target.value
        });   
    }

    componentDidMount() {
        this.setSearchCategory();
    }

    render() {
        return (
            <div>
                <input 
                    onChange={this.handleChange} 
                    type="text" 
                    placeholder={"Znajdź..."}></input>
                <div>
                    <select>                           
                        {
                        this.state.results ?
                            this.state.results.length ?
                            this.state.results.map(result => (
                                <option key={result.id} >
                                    {result.name}
                                </option>                        
                            )) : <option>{"Wybierz..."}</option>
                        : <option>{"Wybierz..."}</option>
                        }
                    </select>
                </div>
            </div>
        )
    }
}


/*
<li key={result.id} >
    <p>{result.name}</p>
    </li>
*/