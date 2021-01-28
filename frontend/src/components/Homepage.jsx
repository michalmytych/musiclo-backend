import React, { Component } from 'react';

import List from './List';
import Filter from './Filter';
import Sort from './Sort';

import '../styles/Homepage.css';


export default class Homepage extends Component {
    render() {
        return (
            <div className="Homepage">
                <div className="crud-container">
                    <div className="list-wrapper">
                        <List />
                    </div>
                    <div className="display-menu">
                        <Filter />
                        <Sort />
                    </div>
                </div>
            </div>
        )
    }
}
