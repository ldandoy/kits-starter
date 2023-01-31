import {useContext} from 'react'

import Navbar from '../components/Navbar'
import {DarkModeContext} from '../contexts/DarkModeContext'

const Default = ({children}) => {
    const { darkMode } = useContext(DarkModeContext);

    return (<div className={`mt-70 ${darkMode ? "theme--dark" : "theme--light"}`}>
        <Navbar />
        <div className={`container`}>
            <div className='content'>
                {children}
            </div>
        </div>
    </div>)
}

export default Default