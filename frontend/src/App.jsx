import { 
    createBrowserRouter, 
    createRoutesFromElements, 
    RouterProvider, 
    Route
} from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from "./components/pages/Main.jsx"
import Profile from "./components/pages/Profile.jsx"
import Settings from "./components/pages/Settings.jsx"
import ErrorPage from "./components/pages/ErrorPage.jsx"

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" //element={<Nav />} 
            errorElement={<ErrorPage />}>
            <Route index element={<Main />}></Route>
            <Route path="profile" element={<Profile />}></Route>
            <Route path="settings" element={<Settings />}></Route>
        </Route>
    )
);

console.log(router);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
)
