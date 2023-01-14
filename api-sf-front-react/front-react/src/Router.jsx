

import {createBrowserRouter, RouterProvider} from "react-router-dom";

import Home from './routes/Home'
import Default from './layouts/Default'

const Router = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Default><Home /></Default>,
        }
    ]);

    return (
        <RouterProvider router={router} />
    )
}

export default Router