import React, {useEffect, useCallback, useState} from 'react';
import { useSelector } from 'react-redux'
import {useParams} from 'react-router-dom'

import { getAPI } from "../../../services/FetchData"

const Show = () => {
    const {userId} = useParams()
    const { auth } = useSelector((state) => state)
    const [user, setUser] = useState(null)

    const getUser = useCallback(async () => {
        const res = await getAPI(`admin/users/${userId}`, auth.token)
        setUser(res.data)
    }, [auth, userId])

    useEffect(() => {
        getUser()
    }, [getUser])

    return <>
        {user && <section>
            <div className="container-fluid">
                <h1 className="title">Compte de { user.name }</h1>
            </div>
        </section>}
    </>
};

export default Show;
