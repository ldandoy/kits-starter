import { useLocation, Link } from "react-router-dom"
import { useSelector } from "react-redux"

const Navbar =  () => {
    const { pathname } = useLocation()
    const { isAuth, user } = useSelector(state => state.auth)

    const isActive = (pn) => {
        if (pn === pathname) return 'active'
    }

    return (
        <nav className="navbar navbar-v navbar-bordered-b navbar-light navbar-fixed-top">
            <div className="navbar-title">
                <div>
                    <a className="navbar-link" href="/">
                        <img src="/logo-nav.png" width={40} alt="logo-nav" />
                    </a>
                    <a id="home" href="/" className="navbar-link">Titre Service</a>
                </div>
                <i className="navbar-menu-icon">&#9776;</i>
            </div>

            <div className="navbar-content-menu">
                <ul className="navbar-menu-left">
                    <li className="navbar-item"></li>
                </ul>
                <ul className="navbar-menu-right">
                    {
                        !isAuth && <>
                            <li className="navbar-item"><Link to="/login" className="navbar-link">Login</Link></li>
                            <li className="navbar-item"><Link to="/register" className="navbar-link">Register</Link></li>
                        </>
                    }
                    {
                        isAuth && <>
                            <li className="navbar-item dropdown">
                                <Link className="navbar-link" to="#">{user.name}</Link>
                                <ul className="navbar-ss-menu bg-green">
                                    <li className="navbar-item">
                                        <Link to="/my-account" className={ `navbar-link ${isActive('/my-account')}` }>Mon compte</Link>
                                    </li>
                                    <li className="navbar-item">
                                    </li>
                                    <li className="navbar-item">
                                    </li>

                                    {user.role === "admin" &&
                                        <li className="navbar-item">
                                            <Link to="/admin" className="navbar-link">Admin</Link>
                                        </li>
                                    }

                                    <li className="navbar-item">
                                        <Link to="/logout" className="navbar-link txt-red-800">Logout</Link>
                                    </li>
                                </ul>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    )
}

export default Navbar