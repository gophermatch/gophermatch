import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar.jsx"
import styles from "../assets/css/layout.module.css"

export default function Layout() {
    return (
        <>
        <div id={styles.sidebar}><Sidebar/></div>
        <div className={"bg-offwhite relative w-[85vw] h-[100vh] left-[15vw] z-0"}><Outlet/></div>
        </>
    )
}