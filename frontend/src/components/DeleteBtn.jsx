import React from 'react'


/*
    Przez props będzie przekazana funkcja showEditForm()
    jesli sie potweirdzi, odpali sie funckja:
    deleteItem(props.category, props.id)
*/


export default function DeleteBtn(props) {
    return (
        <button className='btn del-btn' onClick={props.handler}>
            Usuń
        </button>
    )
}
