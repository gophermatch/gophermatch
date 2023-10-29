import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar.jsx"
import "../assets/css/sidebar.module.css"

export default function Root() {
    return (
        <>
        <body>
        <Sidebar />
        <Outlet />
        </body>
        </>
    )
}