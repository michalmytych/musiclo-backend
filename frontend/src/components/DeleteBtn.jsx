import React from 'react'


export default function DeleteBtn(props) {
    return (
        <button className='btn del-btn' onClick={props.handler}>
            Usuń
        </button>
    )
}
