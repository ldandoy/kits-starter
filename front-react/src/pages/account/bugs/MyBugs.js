import React from 'react';
import { useSelector, useDispatch } from "react-redux"

import ListUserBug from '../../../components/account/ListUserBug'

const MyBugs = () => {
    const { user, token, isAuth } = useSelector((state) => state.auth)

    return <>
        <img src="ban.png" className="img-fluid" alt="banniere du site" />
        
        <section>
            <div className="container mt-100">
                <h1 className="title">Mes bugs remontés</h1>
            </div>
        </section>

        <section>
            <div className="container">
                { isAuth && <section>
                    <div className="container">
                        <ListUserBug />
                    </div>
                </section>}
            </div>
        </section>
    </>;
};

export default MyBugs;
