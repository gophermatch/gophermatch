import { 
    createBrowserRouter, 
    redirect, 
    RouterProvider
} from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from "./components/Layout.jsx"
import Match from "./components/pages/Match.jsx"
import Settings from "./components/pages/Settings.jsx"
import People from "./components/pages/People.jsx";
import Login from "./components/pages/Login.jsx"
import ErrorPage from "./components/pages/ErrorPage.jsx"
import AccountCreation from "./components/pages/AccountCreation.jsx";
import currentUser from "./currentUser.js"
import Signup from './components/pages/Signup.jsx'
import './index.css';
import Landing from './components/pages/LandingPage.jsx'
import PicUpload from './components/pages/PicUpload.jsx'
import Sublease from './components/pages/Sublease.jsx'
import Payment from './components/pages/Payment.jsx'
import SubleaseCreation from "./components/pages/SubleaseCreation.jsx";
import showMatch from './components/pages/ShowMatch.jsx'
import ProfilePage from './components/pages/ProfilePage.jsx'
import backend from './backend.js'

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

async function matchPageRedirect({request}) {

  if (currentUser.profile_completion != "complete") {
      return redirect("/profile")
  }

  await unauthPageRedirect(request);

  return null
}

// Redirects the login page to match page if user is logged in
async function loginPageRedirect() {

    const checkLoggedIn = async () => { try {

      const response = await backend.get('/login/check-session')

      if (response.data.loggedIn) {
          const res = await backend.put("/login", {
            email: response.data.user.email,
            password: "already-logged-in"
          });

          const user_id = res.data.user_id;
          await currentUser.login(user_id);

          return true;
      }

      return false;

    } catch (error) {
      console.error('Error fetching session status:', error);

      return false;
    }
  }

    const loggedIn = await checkLoggedIn();

    if (loggedIn) {
        if(currentUser.profile_completion == "complete") {
            return redirect("/match")
        }

        if(currentUser.profile_completion == "incomplete_profile") {
          return redirect("/profile")
        }

        return redirect("/account")
    }
    return null
}

// Redirects the account page to match/profile page if user has already created account
async function accountCreationRedirect() {
  if (currentUser.logged_in) {
    if(currentUser.profile_completion == "complete") {
      return redirect("/match")
    }
    if(currentUser.profile_completion == "incomplete_profile")
    {
      return redirrect("/profile")
    }
    return null
  }
  return redirect("/login")
}

// Redirects a protected page to login page if user is not logged in
async function unauthPageRedirect({request}) {
    if(currentUser.profile_completion == "incomplete_account"){
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
                loader: matchPageRedirect
            },{
                path: "profile",
                element: <ProfilePage />,
                loader: unauthPageRedirect
            },{
              path: "payment",
              element: <Payment />,
              loader: unauthPageRedirect
          },{
                path: "settings",
                element: <Settings />,
                loader: unauthPageRedirect
            },{
                path: "people",
                element: <People />,
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
            }, {
              path: "showMatch",
              element: <showMatch />,
              loader: unauthPageRedirect
            }
          ]
        }]
}])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
