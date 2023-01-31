

import {createBrowserRouter, RouterProvider} from "react-router-dom";

import Home from './routes/Home'
import Login from './routes/Login'
import Default from './layouts/Default'
import Auth from './layouts/Auth'

const Router = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Default><Home /></Default>,
        },{
            path: "login",
            element: <Auth><Login /></Auth>,
        },
    ]);

    return (
        <RouterProvider router={router} />
    )
}

export default Router