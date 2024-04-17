import { 
    createBrowserRouter, 
    redirect, 
    RouterProvider
} from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from "./components/Layout.jsx"
import Match from "./components/pages/Match.jsx"
import Profile from "./components/pages/Profile.jsx"
import Settings from "./components/pages/Settings.jsx"
import Inbox from "./components/pages/Inbox.jsx";
import Login from "./components/pages/Login.jsx"
import ErrorPage from "./components/pages/ErrorPage.jsx"
import AccountCreation from "./components/pages/AccountCreation.jsx";
import currentUser from "./currentUser.js"
import Signup from './components/pages/Signup.jsx'
import './index.css';
import Landing from './components/pages/LandingPage.jsx'
import Saved from './components/pages/Saved.jsx'
import PicUpload from './components/pages/PicUpload.jsx'
import Sublease from './components/pages/Sublease.jsx'
import SubleaseCreation from "./components/pages/SubleaseCreation.jsx";

// Redirects the main page "/" to login page if user is not logged in, 
// or to match page if user is logged in
async function mainPageRedirect({request}) {
    if (!currentUser.logged_in) {
        let params = new URLSearchParams()
        params.set("from", new URL(request.url).pathname)
        return redirect("/landing?" + params.toString())
    }
    return redirect("/match")
}

// Redirects the login page to match page if user is logged in
async function loginPageRedirect() {
    console.log("User attempting to visit login page, is logged in: " + currentUser.logged_in);
    if (currentUser.logged_in) {
        if(currentUser.account_created) {
            return redirect("/match")
        }
        return redirect("/account")
    }
    return null
}

// Redirects the account page to match page if user has created account
async function accountCreationRedirect() {
  console.log("User attempting to visit account creation page page, is logged in: " + currentUser.logged_in);
  if (currentUser.logged_in) {
    if(currentUser.account_created) {
      return redirect("/match")
    }
    return null
  }
  return redirect("/login")
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

// ... (your existing imports)

const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          path: "",
          loader: mainPageRedirect,
        },
        {
          path: "login",
          element: <Login />,
          loader: loginPageRedirect,
        },
        {
          path: "signup",
          element: <Signup />,
          loader: loginPageRedirect,
        },
        {
          path: "account",
          element: <AccountCreation />,
          loader: accountCreationRedirect,
        },
        {
          path: "landing",
          element: <Landing />,
          loader: loginPageRedirect,
          children: [
            // Add a route to navigate from landing to login
            {
              path: "go-to-login",
              loader: async () => {
                // Redirect to the login page
                return redirect("/login");
              },
            },
            {
              path: 'go-to-signup',
              loader: async () => {
                // Redirect to the signup page
                return redirect("/signup")
              },
            },
          ],
        },
        {
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
            },{
              path: "saved",
              element: <Saved />,
              loader: unauthPageRedirect
            },{
              path: "PicUpload",
              element: <PicUpload />,
              loader: unauthPageRedirect
            },{
              path: "Sublease",
              element: <Sublease />,
              loader: unauthPageRedirect
            }, {
              path: "CreateSublease",
              element: <SubleaseCreation />,
              loader: unauthPageRedirect
            }
          ]
        }]
}])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Auth0Provider
      domain= 'dev-iysxkb0letym7hif.us.auth0.com'
      clientId= 'Fjm29DesdBC1mJn0nQW6qVwMXKS5qF3m'
      redirectUri={window.location.origin}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
    </React.StrictMode>
)
