import React from 'react'


/*
    Przez props będzie przekazana funkcja showEditForm()
*/

export default function EditBtn(props) {
    return (
        <button className='btn edit-btn' onClick={props.handler}>
            Edytuj
        </button>
    )
}
