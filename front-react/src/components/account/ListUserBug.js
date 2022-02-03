import React, {useEffect, useState} from 'react'
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom'

import {getAPI} from '../../services/FetchData'

const ListUserBug = () => {
  const { user, token, isAuth } = useSelector((state) => state.auth)
  const [bugs, setBugs] = useState([])

  const getData = async () => {
    const res = await getAPI('user/bugs', token)
    console.log(res)
    setBugs(res.data)
  }

  useEffect(() => {
    getData()
  }, [])

  return <table className='table'>
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
              <Link to={`/my-bugs/${bug._id}`} className="btn btn-small btn-green">
                  <i className="fas fa-eye"></i>
              </Link>
          </td>
      </tr>)}
  </tbody>
</table>
};

export default ListUserBug
