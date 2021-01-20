import React, { Component } from 'react'

// temp
import { getSearchResultsRequest } from '../requests';


export default class SearchSelect extends Component {
    constructor() {
        super();
        this.state = {
            "results"           : [],
            "category_name"     : "",
            "search_input"      : ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    async _getSearchResults(category, search_input) {
        var results = await getSearchResultsRequest({
            category    : category, 
            input       : search_input
        })        
        this.setState({
            "results"           : results,
            "selected_options"  : []
        })
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

    getSelectedOptions = (e) => {
        let selected_values = Array.from(
            e.target.selectedOptions, option => option.value
        );
        this.setState({ "selected_options" : selected_values });
        this.props.getValues(selected_values);
    }

    setInitialValues = () => {
        this.props._getInitialValue([]);
    } 

    handleChange(event) {
        this._getSearchResults(this.props.category, event.target.value);
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    componentDidMount = () => {
        this.setSearchCategory();
        this.setInitialValues();
    }

    render() {
        return (
            <div>
                <input 
                    onChange={this.handleChange} 
                    type="text" 
                    placeholder={"Znajdź..."}></input>
                <div>
                    <select 
                        value={this.state.selected_options}
                        id="search_select" multiple onChange={this.getSelectedOptions}>                           
                        {
                        this.state.results ?
                            this.state.results.length ?
                            this.state.results.map(result => (
                                <option value={result.id} key={result.id} >
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
