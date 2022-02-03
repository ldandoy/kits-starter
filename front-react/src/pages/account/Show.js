import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"

import FormUpdate from '../../components/account/FormUpdate'

const Show = () => {
    const { user, token, isAuth } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const deleteSenarii = (e, senarioId) => {
        e.preventDefault()

        // dispatch(deleteSenario(token, senarioId, history))
    }

    return (<>
        <img src="ban.png" className="img-fluid" alt="banniere du site" />
        
        <section>
            <div className="container mt-100">
                <h1 className="title">Mon compte</h1>
            </div>
        </section>

        <section>
            <div className="container">
                { isAuth && <section>
                    <div className="container">
                        <FormUpdate user={user} token={token} />
                    </div>
                </section>}
            </div>
        </section>

        <section>
            <div className="container mt-100">
                <h2 className="title">Vos scénarii</h2>
            </div>
        </section>

        <section>
            <div className="container mt-30">
                <Link to={`/account/scenarii/new`}><button className="btn btn-green"><i className="fas fa-plus"></i> Créer un nouveau scénario</button></Link>
            </div>
        </section>

        { isAuth && user.senarii.length > 0 ? <section>
            <div className="container mt-30">
                <div className="grid grid-cols-4 gap-8">
                    { user.senarii.map((senario) =>
                        <div key={senario._id} className="card">
                            <div className="card-title">
                                {(senario.status === "Brouillon" || senario.status === "") && <span className="badge bg-light">Brouillon</span>}
                                {senario.status === "Béta" && <span className="badge bg-warning">Béta</span>}
                                {senario.status === "Publié" && <span className="badge bg-green">Publié</span>}
                                &nbsp;{senario.title}
                            </div>
                            <div className="card-body">{senario.description}</div>
                            <div className="card-footer txt-right">
                                <Link to={`/scenarii/${senario._id}`}><button className="btn btn-small btn-green"><i className="fas fa-eye"></i></button></Link>&nbsp;
                                <Link to={`/account/scenarii/${senario._id}/edit`}><button className="btn btn-small btn-beige"><i className="fas fa-pencil-alt"></i></button></Link>&nbsp;
                                <button onClick={(event) => { deleteSenarii(event, senario._id)}} className="btn btn-small btn-error"><i className="fas fa-trash-alt"></i></button>
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </section>
        : <section>
            <div className="container mt-30">
                Vous n'avez pas de scénario pour le moment
            </div>
        </section> }
    </>)
}

export default Show