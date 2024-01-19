import { Link } from "react-router-dom"
import Styles from "../assets/css/sidebar.module.css"
import Logout from "./Logout"

export default function Sidebar() {
    return(
        <>
        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
        <nav id={Styles.nav}>
            <Link to="/" id={Styles.icon}>
                <img src="../assets/images/logo.png" id={Styles.logo}></img>
            </Link>
            <div id={Styles.content}>
                <Link to="/profile" className={Styles.item}>👤 Profile</Link>
                <Link to="/settings" className={Styles.item}>⚙️ Settings</Link>
                <Link to="/match" className={Styles.item}>🔗 Match</Link>
                <Link to="/inbox" className={Styles.item}>✉️ Inbox</Link>
                
                <Logout className={Styles.item} />
            </div>
        </nav>
        </>
    )
}
