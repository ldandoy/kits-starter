import { useSelector } from "react-redux"

import FormUpdate from '../../components/account/FormUpdate'

const Show = () => {
    const { user, token, isAuth } = useSelector((state) => state.auth)

    return (<>
        <section>
            <div className="container">
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
            </div>
        </section>

        <section>
            <div className="container mt-30">
            </div>
        </section>

        { isAuth ? <section>
            <div className="container mt-30">
                <div className="grid grid-cols-4 gap-8">

                </div>
            </div>
        </section>
        : <section>
            <div className="container mt-30">
            </div>
        </section> }
    </>)
}

export default Show