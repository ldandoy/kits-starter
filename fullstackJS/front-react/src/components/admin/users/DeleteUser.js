import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { deleteAPI } from '../../../services/FetchData'

const DeleteUser = ({userId}) => {
    const { auth } = useSelector((state) => state)
    let history = useHistory()

    const deleteUser = async (event) => {
        event.preventDefault()

        try {
            await deleteAPI(`admin/users/${userId}`, auth.token)
            history.push("/admin/users")
        } catch (error) {
            console.log(error.response.data.msg)
        }
    }

    return (
        <button onClick={deleteUser} className="btn btn-small btn-error"><i className="fas fa-trash-alt"></i></button>
    )
}

export default DeleteUser
