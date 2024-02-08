import { 
    createBrowserRouter, 
    redirect, 
    RouterProvider
} from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from "./components/Layout.jsx"
import Match from "./components/pages/Match.jsx"
import Profile from "./components/pages/Profile.jsx"
import Settings from "./components/pages/Settings.jsx"
import Inbox from "./components/pages/Inbox.jsx";
import Login from "./components/pages/Login.jsx"
import AccountCreation from "./components/pages/AccountCreation.jsx"
import ErrorPage from "./components/pages/ErrorPage.jsx"
import currentUser from "./currentUser.js"
import './assets/css/index.css'
import Signup from './components/pages/Signup.jsx'
import './index.css';



// Redirects the main page "/" to login page if user is not logged in, 
// or to match page if user is logged in
async function mainPageRedirect({request}) {
    if (!currentUser.logged_in) {
        let params = new URLSearchParams()
        params.set("from", new URL(request.url).pathname)
        return redirect("/login?" + params.toString())
    }
    return redirect("/match")
}

// Redirects the login page to match page if user is logged in
async function loginPageRedirect() {
    if (currentUser.logged_in) {
        if(currentUser.account_created) {
            return redirect("/match")
        }
        return redirect("/account")
    }
    return null
}

// Redirects a page to match page if user has created an account
async function accountCreatedRedirect() {
    if(currentUser.account_created) {
        return redirect("/match")
    }
    return null;
}

// Redirects a protected page to login page if user is not logged in
async function unauthPageRedirect({request}) {
    if(!currentUser.account_created){
        return redirect("/account")
    }
    if (!currentUser.logged_in) {
        let params = new URLSearchParams()
        params.set("from", new URL(request.url).pathname)
        return redirect("/login?" + params.toString())
      }
      return null;
}

const router = createBrowserRouter([{
        path: "/",
        errorElement: <ErrorPage />,
        children: [{
            index: true,
            path: "",
            loader: mainPageRedirect
        },{
            path: "login",
            element: <Login />,
            loader: loginPageRedirect,
        },{
            path: "signup",
            element: <Signup />,
            loader: loginPageRedirect,
        },{
            path: "account",
            element: <AccountCreation />,
            loader: accountCreatedRedirect,
        },{
            // wrapper for pages that need sidebar
            path: "",
            element: <Layout />,
            errorElement: <ErrorPage />,
            children: [{
                path: "match",
                element: <Match />,
                loader: unauthPageRedirect
            },{
                path: "profile",
                element: <Profile />,
                loader: unauthPageRedirect
            },{
                path: "settings",
                element: <Settings />,
                loader: unauthPageRedirect
            },{
                path: "inbox",
                element: <Inbox />,
                loader: unauthPageRedirect
            }]
        }]
}])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
