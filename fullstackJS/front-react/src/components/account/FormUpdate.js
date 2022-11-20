import { useState } from 'react'
import { useDispatch } from "react-redux"


import Alert from '../../components/layouts/Alert'
import { setUserSuccess } from '../../redux/slices/authSlice'
import { setSuccess, setError, clear } from '../../redux/slices/alertSlice'
import { checkImage } from '../../utils/Valid'
import { patchAPI } from '../../services/FetchData'

const FormUpdate = ({user, token}) => {
    const dispatch = useDispatch()
    const [form, setForm] = useState({
        avatar: user.avatar,
        name: user.name,
        account: user.account,
        type: user.type,
        password: '',
        cf_password: ''
    })
    
    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

    const onChangeInputHandler = (e) => {
        const {name, value} = e.target
        setForm({...form, [name]: value})
    }

    const onChangeFileHandler = (e) => {
        const target = e.target
        const files = target.files

        if (files) {
            const file = files[0]
            setForm({...form, avatar: file})
        }
    }

    const onSubmitHandle = async (e) => {
        e.preventDefault()

        try {
            if (form.avatar || form.account) {
                
                if (form.avatar !== '') {
                    let check = checkImage(form.avatar)
                    if (check !== '') return dispatch(setError(check))
                }
                dispatch(clear())

                const formData = new FormData()
                formData.append("name", form.name)
                formData.append('account', form.account)
                formData.append('type', form.type)
                formData.append('avatar', form.avatar)
                formData.append('password', form.password)
                formData.append('cf_password', form.cf_password)

                const res = await patchAPI('user/me', formData, token)
                dispatch(setUserSuccess({ user: res.data.user }))
                dispatch(setSuccess(res.data.msg))
            }
        } catch (error) {
            dispatch(setError(error.response.data.msg))
        }
    }

    return <form onSubmit={onSubmitHandle}>
        <div className="row row-half">
            <div className="col">
                <Alert />
            </div>
        </div>
        <div className="row row-half">
            <div className="col">
                <div className="form-group">
                    <div className="w-30">
                        {form.avatar !== "" && <img className="img-thumbnails" src={typeof form.avatar === 'string' ? form.avatar : URL.createObjectURL(form.avatar)} alt={form.account} />}
                    </div>
                    <input type="file" accept="image/*" name="file" id="file_up" onChange={onChangeFileHandler} />
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Identifiant</label>
                    <input type="text" disabled={true} name="account" value={form.account} className="form-input" onChange={onChangeInputHandler} placeholder="Email ou numéro de téléphone" />
                </div>
                <div className="form-group">
                    <label htmlFor="" className="form-label" required="required">Name</label>
                    <input type="text" name="name" value={form.name} className="form-input" onChange={onChangeInputHandler} placeholder="Nom" />
                </div>
                <div className="form-group">
                    <label htmlFor="" className="form-label">Type de compte</label>
                    <input type="text" disabled={true} name="type" value={form.type} className="form-input" onChange={onChangeInputHandler} placeholder="Type de compte" />
                </div>
                { user.type === 'normal' && <>
                    <div className="form-group">
                        <label htmlFor="" className="form-label">Mot de passe</label>
                        <div className="form-input-group">
                            <input type={typePass ? "text" : "password" } name="password" value={form.password} className="form-input" onChange={onChangeInputHandler} placeholder="Mot de passe" />
                            <small onClick={() => setTypePass(!typePass)}>
                                { typePass ? 'Hide' : "Show" }
                            </small>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="form-label">Confirmez votre mot de passe</label>
                        <div className="form-input-group">
                            <input type={typeCfPass ? "text" : "password" } name="cf_password" value={form.cf_password} className="form-input" onChange={onChangeInputHandler} placeholder="Confirmez Mot de passe" />
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
}

export default FormUpdate;
