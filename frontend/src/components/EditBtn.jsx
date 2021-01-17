import React from 'react'



export default function EditBtn(props) {
    return (
        <button className='btn edit-btn' onClick={props.handler}>
            Edytuj
        </button>
    )
}
