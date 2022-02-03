import React, {useEffect, useCallback, useState} from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import * as dayjs from 'dayjs'

import { getAPI } from "../../../services/FetchData"
import DeleteUser from "../../../components/admin/users/DeleteUser"

const Index = () => {
    const { auth } = useSelector((state) => state)
    const [users, setUsers] = useState([])

    const getUsers = useCallback(async () => {
        const res = await getAPI('admin/users', auth.token)
        setUsers(res.data)
    }, [auth])

    useEffect(() => {
        getUsers()
    }, [getUsers])

    return (<>
        <section>
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <h1 className="title">Liste des utilisateurs</h1>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div className='container mt-20'>
                <div className='row'>
                    <div className='col'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Avatar</th>
                                    <th>Identifiant</th>
                                    <th>Nom</th>
                                    <th>Type</th>
                                    <th>Rôle</th>
                                    <th>Création</th>
                                    <th>Modification</th>
                                    <th width="15%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user => <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td></td>
                                    <td>{user.account}</td>
                                    <td>{user.name}</td>
                                    <td>{user.type}</td>
                                    <td>{user.role}</td>
                                    <td>{dayjs(user.created_at).format('DD/MM/YYYY')}</td>
                                    <td>{dayjs(user.updated_at).format('DD/MM/YYYY')}</td>
                                    <td>
                                        <Link to={`/admin/users/${user._id}/edit`} className="btn btn-small btn-notice">
                                            <i className="fas fa-pencil-alt"></i>
                                        </Link>&nbsp;
                                        <Link to={`/admin/users/${user._id}`} className="btn btn-small btn-green">
                                            <i className="fas fa-eye"></i>
                                        </Link>&nbsp;
                                        <DeleteUser userId={user._id} />
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
  </>)
}

export default Index;
