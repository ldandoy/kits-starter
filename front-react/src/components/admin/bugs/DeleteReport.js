import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { deleteAPI } from '../../../services/FetchData'

const DeleteReport = ({bugId}) => {
    const { auth } = useSelector((state) => state)
    let history = useHistory()

    const deleteReport = async (event) => {
        event.preventDefault()

        try {
            await deleteAPI(`admin/bugs/${bugId}`, auth.token)
            history.push("/admin/bugs")
        } catch (error) {
            console.log(error.response.data.msg)
        }
    }

    return (
        <button onClick={deleteReport} className="btn btn-small btn-error"><i className="fas fa-trash-alt"></i></button>
    )
}

export default DeleteReport
