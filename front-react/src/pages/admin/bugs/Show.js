import React, {useState, useEffect, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { getAPI, postAPI, deleteAPI } from "../../../services/FetchData"
import Alert from '../../../components/layouts/Alert'
import { setSuccess } from '../../../redux/slices/alertSlice'

const Show = () => {
    const {bugId} = useParams()
    const { auth } = useSelector((state) => state)
    const dispatch = useDispatch()
    const [bug, setBug] = useState(null)
    const [form, setForm] = useState('')

    const getBug = useCallback(async () => {
        const res = await getAPI(`admin/bugs/${bugId}`, auth.token)
        setBug(res.data)
    }, [auth, bugId])

    useEffect(() => {
        dayjs.extend(relativeTime)
        getBug()
    }, [getBug])

    const handlerOnChange = (event) => {
        setForm(event.target.value)
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            const res = await postAPI(`admin/bugs/${bugId}/comments`, {content: form}, auth.token)

            dispatch(setSuccess(res.data.msg))
            
            setBug({...bug, ['comments']: res.data.bug.comments})
        } catch(error) {
            console.log(error)
        }
        setForm('')
    }

    const handlerOnClick = async (event, index) => {
        event.preventDefault()

        try {
            const res = await deleteAPI(`admin/bugs/${bugId}/comment/${index}`, auth.token)
            dispatch(setSuccess(res.data.msg))
            let comments = bug.comments
            comments.splice(index, 1)
            setBug({...bug, ['comments']: comments})
        }  catch(error) {
            console.log(error)
        }
    }

    return (<>
        { bug && <>
            <section>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col'>
                            <h1 className="title">Bugs: {bug._id}</h1>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className='mt-50'>
                <div className='container'>
                    <div className='row'>
                        <div className='col'>
                            <div className='card'>
                                <div className='card-body'>
                                    {bug.report}
                                </div>
                                <div className='card-footer txt-right txt-small'>
                                    -- {bug.owner.name} il y a {dayjs(bug.created_at).fromNow(true)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mt-50'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col w-50 mx-auto'>
                            { bug.comments && bug.comments.map((comment, index) => <div className='card mb-10' key={index}>
                                <div className='card-body relative'>
                                    <div className='delete' onClick={(e) => handlerOnClick(e, index)}>X</div>
                                    {comment.content}
                                </div>
                                <div className='card-footer txt-right txt-small'>
                                    -- {comment.owner.name} il y a {dayjs(comment.created_at).fromNow(true)}
                                </div>
                            </div>) }
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col w-50 mx-auto'>
                            <form className="form-bordered" onSubmit={onSubmit}>
                                <Alert />
                                <div className="form-group">
                                    <label htmlFor="com" className="form-label txt-green txt-large">Commentaire</label>
                                    <textarea onChange={handlerOnChange} value={form} name="content" id="com" rows={5} placeholder='Rédigez votre réponse' className="form-textarea"></textarea>
                                </div>
                                <div className="form-group">
                                    <button type='submit' className="btn btn-green w-100">Envoyer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </> }
    </>)
}

export default Show
