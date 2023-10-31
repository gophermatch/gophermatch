import { 
    createBrowserRouter, 
    RouterProvider
} from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./components/Root.jsx"
import Match from "./components/pages/Match.jsx"
import Profile from "./components/pages/Profile.jsx"
import Settings from "./components/pages/Settings.jsx"
import Login from "./components/pages/Login.jsx"
import ErrorPage from "./components/pages/ErrorPage.jsx"
import './assets/css/index.css'

const router = createBrowserRouter([{
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [{
            index: true,
            path: "",
            element: <Login />
        },
        {
            path: "match",
            element: <Match />
        },{
            path: "profile",
            element: <Profile />
        },{
            path: "settings",
            element: <Settings />
        }]
}])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
