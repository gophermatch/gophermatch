import { Link } from "react-router-dom"

export default function Root() {
    return(
        <>
        <nav id="nav">
            <ul>
                <li><Link to="/">Main</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
            </ul>
        </nav>
        </>
    )
}