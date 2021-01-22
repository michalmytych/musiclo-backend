import React, { Component } from 'react';

import '../styles/Search.css';


export default class Search extends Component {
    render() {
        return (
            <div className="Search">
                <input 
                    placeholder="Wyszukaj..."
                    className="search-bar-input"
                    name="search-input" ></input>
            </div>
        )
    }
}
