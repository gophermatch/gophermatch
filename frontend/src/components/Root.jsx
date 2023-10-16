import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar.jsx"

export default function Root() {
    return (
        <>
        <Sidebar />
        <Outlet />
        </>
    )
}