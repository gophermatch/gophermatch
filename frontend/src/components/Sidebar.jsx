import { Link } from "react-router-dom"
import Styles from "../assets/css/sidebar.module.css"

export default function Root() {
    return(
        <>
        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
        <nav id={Styles.nav}>
            <Link to="/match" id={Styles.icon}>
                <img src="../assets/images/logo.png" id={Styles.logo}></img>
            </Link>
            <div id={Styles.content}>
                <p><Link to="/">🔑 Login</Link></p>
                <p><Link to="/profile">👤 Profile</Link></p>
                <p><Link to="/settings">⚙️ Settings</Link></p>
            </div>
        </nav>
        </>
    )
}