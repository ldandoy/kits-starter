import {useContext} from 'react'

import Navbar from '../components/Navbar'
import {DarkModeContext} from '../contexts/DarkModeContext'

const Default = ({children}) => {
    const { darkMode } = useContext(DarkModeContext);

    return (<div className={`${darkMode ? "theme--dark" : "theme--light"}`}>
        <div className={`auth container-fluid`}>
            <div className="row">
                <div className="col col-two-tiers">
                    {children}
                </div>
                <div className="col col-tiers" style={{backgroundColor: 'red'}}>

                </div>
            </div>
        </div>
    </div>)
}

export default Default