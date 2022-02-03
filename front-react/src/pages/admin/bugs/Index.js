import React, {useEffect, useCallback, useState} from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { getAPI } from "../../../services/FetchData"
import "../../../styles/admin.css"
import DeleteReport from '../../../components/admin/bugs/DeleteReport'

const Index = () => {
    const { auth } = useSelector((state) => state)
    const [bugs, setBugs] = useState(null)

    const getBugs = useCallback(async () => {
        const res = await getAPI('admin/bugs', auth.token)
        setBugs(res.data)
    }, [auth])

    useEffect(() => {
        getBugs()
    }, [getBugs])

    return (<>
        <section>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col'>
                        <h1 className="title">Bugs Index</h1>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div className='container-fluid mt-20'>
                <div className='row'>
                    <div className='col'>
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Report</th>
                                    <th width="10%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bugs && bugs.map(bug => <tr key={bug._id}>
                                    <td>
                                        {bug.owner.name}
                                    </td>
                                    <td>
                                        {bug.report}
                                    </td>
                                    <td>
                                        <Link to={`/admin/bugs/${bug._id}`} className="btn btn-small btn-green">
                                            <i className="fas fa-eye"></i>
                                        </Link>&nbsp;
                                        <DeleteReport bugId={bug._id} />
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

export default Index
