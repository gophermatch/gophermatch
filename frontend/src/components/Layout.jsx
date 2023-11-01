import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar.jsx"
import styles from "../assets/css/layout.module.css"

export default function Layout() {
    return (
        <>
        <div id={styles.sidebar}><Sidebar/></div>
        <div id={styles.page}><Outlet/></div>
        </>
    )
}