import { Link } from "react-router-dom";
import Logout from "./Logout";

export default function Sidebar() {
    return (
        <>
            <nav className="flex flex-col items-left text-left p-10 w-full text-2xl h-screen bg-maroon rounded-none shadow-md" id="nav">
                <Link to="/" className="transform scale-100 transition-transform duration-200 hover:scale-110 active:scale-90">
                    <img src="../assets/images/logo.png" className="sidebarLogo" alt="Logo" />
                </Link>
                <br></br>
                <div className="text-left mt-10">
                    {[
                        ['Profile', '/profile'],
                        ['Settings', '/settings'],
                        ['Match', '/match'],
                        ['Inbox', '/inbox'],
                    ].map(([label, destination]) => (
                        <Link key={label} to={destination} className="max-h-full text-white text-left flex-grow-10 flex justify-between flex-col mb-20 font-sans drop-shadow-lg transform scale-100 transition-transform duration-200 hover:scale-110 active:scale-90">{label}</Link>
                    ))}

                    <div className="text-white transition-transform duration-200 hover:scale-110 cursor-pointer inline-flex items-center">
                    <Logout id="logout" className="logout" /> <span className="ml-1" onClick={() => document.getElementById('logout').click()}>&#8594;</span>
                    </div>
                </div>
            </nav>
        </>
    );
}
