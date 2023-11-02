import { useNavigate } from "react-router-dom"
import backend from "../backend"
import currentUser from "../currentUser"

export default function Logout({id, className}) {
    const navigate = useNavigate()

    // TODO: better error handling
    async function logout() {
        if (!currentUser.logged_in) {
            alert("User not logged in!")
            return
        }

        try {
            await backend.delete("/login")
            currentUser.logout()
            navigate("/login")
        } catch(err) {
            console.error(err)

            if (err.serverResponds) {
                alert(err.response.data.error_message)
            } else if (err.requestSent) {
                alert("Server timed out...")
            } else {
                alert("shit... our fault")
            }
        }
    }

    return (
        <div id={id} className={className} onClick={logout}>⬅️ Logout</div>
    )
}