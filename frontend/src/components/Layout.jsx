import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar.jsx"
import styles from "../assets/css/layout.module.css"

export default function Layout() {
    return (
        <>
        <div className={"fixed w-[16vw]"}><Sidebar/></div>
        <div className={"bg-offwhite relative w-[84vw] h-[100vh] left-[16vw] z-0"}><Outlet/></div>
        </>
    )
}