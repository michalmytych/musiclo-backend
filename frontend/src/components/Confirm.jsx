import React, { Component } from 'react'

import '../styles/Confirm.css';


export default class Confirm extends Component {
    handleConfirmChoice = (choice) => {
        if (choice) {
            this.props.on_ok();
            this.props.toggler();
        } else {
            this.props.toggler();
        }
    }

    render() {
        return (
            <div className="confirm-box">
                <h3>{this.props.message_header}</h3>
                <p>{this.props.message_content ? this.props.message_content : null}</p>
                <button 
                    onClick={() => this.handleConfirmChoice(true)}
                    className="btn edit-btn">Potwierdź</button>
                <button 
                    onClick={() => this.handleConfirmChoice(false)}
                    className="btn edit-btn">Anuluj</button>
            </div>
        )
    }
}

