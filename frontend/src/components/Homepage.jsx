import React, { Component } from 'react';

import List from './List';
import Search from './Search';
import Filter from './Filter';
import Sort from './Sort';
 //import Confirm from './Confirm';

import '../styles/Homepage.css';


export default class Homepage extends Component {
    render() {
        return (
            <div className="Homepage">
                <Search />
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
