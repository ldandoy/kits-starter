import React, {useEffect, useCallback, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {Link, useParams} from 'react-router-dom'

import { getAPI } from "../../../services/FetchData"
import DeleteUser from '../../../components/admin/users/DeleteUser'
import Alert from '../../../components/layouts/Alert'
import { setUserSuccess } from '../../../redux/slices/authSlice'
import { setSuccess, setError, clear } from '../../../redux/slices/alertSlice'
import { checkImage } from '../../../utils/Valid'
import { patchAPI } from '../../../services/FetchData'

const Edit = () => {
    const { userId } = useParams()
    const { auth } = useSelector((state) => state)
    const dispatch = useDispatch()

    const [user, setUser] = useState(null)
    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

    const getUser = useCallback(async () => {
        const res = await getAPI(`admin/users/${userId}`, auth.token)
        res.data.user.password = ''
        res.data.user.cf_password = ''
        setUser(res.data.user)
    }, [auth, userId])

    useEffect(() => {
        getUser()
    }, [getUser])

    const onChangeInputHandler = (e) => {
        const {name, value} = e.target
        setUser({...user, [name]: value})
    }

    const onChangeFileHandler = (e) => {
        const target = e.target
        const files = target.files

        if (files) {
            const file = files[0]
            setUser({...user, avatar: file})
        }
    }

    const onSubmitHandle = async (e) => {
        e.preventDefault()

        try {
            if (user.avatar || user.account) {
                
                if (user.avatar !== '') {
                    let check = checkImage(user.avatar)
                    if (check !== '') return dispatch(setError(check))
                }
                dispatch(clear())

                const formData = new FormData()
                formData.append("name", user.name)
                formData.append('account', user.account)
                formData.append('type', user.type)
                formData.append('avatar', user.avatar)
                formData.append('password', user.password)
                formData.append('cf_password', user.cf_password)

                const res = await patchAPI(`admin/users/${userId}/edit`, formData, auth.token)
                dispatch(setUserSuccess({ user: res.data.user }))
                dispatch(setSuccess(res.data.msg))
            }
        } catch (error) {
            dispatch(setError(error.response.data.msg))
        }
    }

    return <>
        {user && <section>
            <div className="container">
                <div className='row'>
                    <div className='col'>
                        <h1 className="title">Edition du compte de { user.name }</h1>
                    </div>
                    <div className='col txt-right'>
                        <Link to={`/admin/users`} className="btn btn-small btn-light">
                            <i className="fas fa-undo-alt"></i>
                        </Link>&nbsp;
                        <Link to={`/admin/users/${user._id}`} className="btn btn-small btn-green">
                            <i className="fas fa-eye"></i>
                        </Link>&nbsp;
                        <DeleteUser userId={user._id} />
                    </div>
                </div>

                <form onSubmit={onSubmitHandle}>
                    <div className="row">
                        <div className="col">
                            <Alert />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <div className="w-30">
                                    {user.avatar !== "" && <img className="img-thumbnails" src={typeof user.avatar === 'string' ? user.avatar : URL.createObjectURL(user.avatar)} alt={user.account} />}
                                </div>
                                <input type="file" accept="image/*" name="file" id="file_up" onChange={onChangeFileHandler} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">Identifiant</label>
                                <input type="text" disabled={true} name="account" value={user.account} className="form-input" onChange={onChangeInputHandler} placeholder="Email ou numéro de téléphone" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">Name</label>
                                <input type="text" name="name" value={user.name} className="form-input" onChange={onChangeInputHandler} placeholder="Nom" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">Type de compte</label>
                                <select className="form-select" onChange={onChangeInputHandler} value={user.type} name="type" >
                                    <option value="normal">Normal</option>
                                    <option value="Google">Google</option>
                                </select>
                            </div>
                            { user.type === 'normal' && <>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Mot de passe</label>
                                    <div className="form-input-group">
                                        <input type={typePass ? "text" : "password" } name="password" value={user.password} className="form-input" onChange={onChangeInputHandler} placeholder="Mot de passe" />
                                        <small onClick={() => setTypePass(!typePass)}>
                                            { typePass ? 'Hide' : "Show" }
                                        </small>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Confirmez votre mot de passe</label>
                                    <div className="form-input-group">
                                        <input type={typeCfPass ? "text" : "password" } name="cf_password" value={user.cf_password} className="form-input" onChange={onChangeInputHandler} placeholder="Confirmez Mot de passe" />
                                        <small onClick={() => setTypeCfPass(!typeCfPass)}>
                                            { typeCfPass ? 'Hide' : "Show" }
                                        </small>
                                    </div>
                                </div>
                            </> }
                            <div className="form-group">
                                <button type="submit" className="btn bg-green txt-white-100 w-100 p-20">
                                    Enregistrez
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>}
    </>
};

export default Edit;
