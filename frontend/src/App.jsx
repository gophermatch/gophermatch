import { 
    createBrowserRouter, 
    RouterProvider
} from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./components/Root.jsx"
import Main from "./components/pages/Main.jsx"
import Profile from "./components/pages/Profile.jsx"
import Settings from "./components/pages/Settings.jsx"
import Login from "./components/pages/Login.jsx"
import ErrorPage from "./components/pages/ErrorPage.jsx"

const router = createBrowserRouter([{
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [{
            index: true,
            element: <Main />
        },{
            path: "profile",
            element: <Profile />
        },{
            path: "settings",
            element: <Settings />
        }, {
            path: "login",
            element: <Login />
        }]
}])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
