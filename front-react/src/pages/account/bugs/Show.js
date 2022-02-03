import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {getAPI, deleteAPI, postAPI} from '../../../services/FetchData'
import Alert from '../../../components/layouts/Alert'
import { setSuccess } from '../../../redux/slices/alertSlice';

const Show = () => {
  const { user, token, isAuth } = useSelector((state) => state.auth)
  const { bugId } = useParams()
  const dispatch = useDispatch()
  const [bug, setBug] = useState(null)
  const [form, setForm] = useState('')

  const getData = async () => {
    if (isAuth) {
      console.log('passer')
      const res = await getAPI(`user/bugs/${bugId}`, token)
      setBug(res.data)
    }
  }
  
  useEffect(() => {
    getData()
  }, [isAuth])

  const handlerOnChange = (event) => {
    setForm(event.target.value)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
        const res = await postAPI(`user/bugs/${bugId}/comments`, {content: form}, token)
        setBug({...bug, ['comments']: res.data.bug.comments})
    } catch(error) {
        console.log(error)
    }
    setForm('')
  }

  const handlerOnClick = async (event, index) => {
      event.preventDefault()

      try {
          const res = await deleteAPI(`user/bugs/${bugId}/comment/${index}`, token)
          dispatch(setSuccess(res.data.msg))
          let comments = bug.comments
          comments.splice(index, 1)
          setBug({...bug, ['comments']: comments})
      }  catch(error) {
          console.log(error)
      }
  }

  return <>
    { bug && <>
        <section className='mt-100'>
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <h1 className="title">Bugs: {bug._id}</h1>
                    </div>
                </div>
            </div>
        </section>
        
        <section className=''>
            <div className='container'>
                <div className='row'>
                    <div className='col w-50 mx-auto'>
                        {bug.report}
                    </div>
                </div>
            </div>
        </section>

        <section className='mt-50'>
            <div className='container'>
                <div className='row'>
                    <div className='col w-50 mx-auto'>
                        { bug.comments && bug.comments.map((comment, index) => <div className='card mb-10' key={index}>
                            <div className='card-body relative'>
                                <div className='delete' onClick={(e) => handlerOnClick(e, index)}>X</div>
                                <p className='mb-20 txt-small'>{comment.owner.name}</p>
                                <p>{comment.content}</p>
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
  </>;
};

export default Show;
