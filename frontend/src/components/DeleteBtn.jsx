import React from 'react'

import deleteIcon from '../assets/remove.svg';


export default function DeleteBtn(props) {
    return (
        <button onClick={props.handler}>
            <img src={deleteIcon} alt="Przycisk usuwania." className="crud-icon"/>
        </button>
    )
}
