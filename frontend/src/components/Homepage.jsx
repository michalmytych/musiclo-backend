import React, { Component } from 'react';

import List from './List';

import '../styles/Homepage.css';


export default class Homepage extends Component {
    render() {
        return (
            <div className="Homepage">
                <div className="crud-wrapper">
                    <div className="crud-container">                    
                            <div className="list-wrapper">
                                <List />
                            </div>                    
                    </div>
                </div>
            </div>
        )
    }
}