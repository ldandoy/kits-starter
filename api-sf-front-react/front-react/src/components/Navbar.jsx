import {Link} from 'react-router-dom'

import {DarkModeContext} from '../contexts/DarkModeContext'
import Lightswitch from '../components/Lightswitch'

const Navbar = () => {
    return (
        <nav className="navbar navbar-fixed-top">
            <div className="navbar-container-fluid">
                <div className="navbar-content-menu">
                    <ul className="navbar-menu navbar-menu-left">
                        <li className="navbar-item">
                            <Link to="/" className="navbar-link">Home</Link>
                        </li>
                    </ul>
                    <ul className="navbar-menu navbar-menu-right">
                        <li className="navbar-item"><Lightswitch /></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar