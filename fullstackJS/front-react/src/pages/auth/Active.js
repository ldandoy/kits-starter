import React, {useEffect, useState, useCallback} from 'react'
import { useParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import Alert from '../../components/layouts/Alert'
import { postAPI } from '../../services/FetchData'
import { setSuccess, setError } from '../../redux/slices/alertSlice'

const Active = () => {
    const { slug } = useParams()
    const dispatch = useDispatch()
    const [activated, setActivated] = useState(false)

    const active = useCallback(async (slug) => {
        if (slug) {
            try {
                const res = await postAPI('auth/active', { active_token: slug })
                dispatch(setSuccess(res.data.msg))
                setActivated(true)
            } catch (error) {
                dispatch(setError(error.response.data.msg))
            }
        }
    }, [setActivated, dispatch])

    useEffect(() => {
        active(slug)
    }, [active, slug])

    return (<div className="card w-50 mx-auto bg-white">
        <div className="card-title txt-center txt-green">
            <img src="/logo-auth.png" width={150} alt="logo-auth" />
        </div>
        <div className="card-title txt-center txt-gray-900">
            <h1>Activation de votre compte</h1>
        </div>
        <div className="card-body">
            <Alert />
            { activated && <p className="txt-center mt-15"><Link to='/login' className="txt-gray-800">Vous connectez à votre compte</Link></p> }
            { !activated && <p className="txt-center  mt-15"><Link to='/register' className="txt-gray-800">Recréer votre compte</Link></p> }
        </div>
    </div>)
}

export default Active
