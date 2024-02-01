import { Link } from "react-router-dom"
import Logout from "./Logout"

export default function Sidebar() {
    return (
        <>
            <nav className="flex flex-col items-center p-16 w-full h-screen bg-maroon rounded-none shadow-md" id="nav">
                <Link to="/" className="transform scale-100 transition-transform duration-200 hover:scale-110 active:scale-90">
                    <img src="../assets/images/logo.png" className="sidebarLogo"></img>
                </Link>
                <br></br>
                <div className="">
                    {[
                        ['Profile', '/profile'],
                        ['Settings', '/settings'],
                        ['Match', '/match'],
                        ['Inbox', '/inbox'],
                    ].map(([label, destination]) => (
                        <Link to={destination} className="max-h-full text-white text-center flex-grow-10 flex justify-between flex-col mb-20 font-sans font-bold drop-shadow-lg transform scale-100 transition-transform duration-200 hover:scale-110 active:scale-90">{label}</Link>
                    ))}

                    <Logout className="text-white font-bold transition-transform duration-200 hover:scale-110 cursor-pointer" />
                </div>
            </nav>
        </>
    )
}
