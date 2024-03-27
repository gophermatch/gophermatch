import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logout from './Logout';

export default function Sidebar() {
    const [activePage, setActivePage] = useState('/match');
    const [logoClicked, setLogoClicked] = useState(false);

    const handleLogoClick = () => {
        setLogoClicked(true);
        setActivePage('/match');
    };

    return (
        <>
            <nav className="flex flex-col items-left text-left p-10 w-full text-xl font-comfortaa h-screen bg-maroon rounded-none shadow-md" id="nav">
                <NavLink exact to="/" className={`transform scale-100 transition-transform duration-200 text-white hover:scale-110 active:scale-90 ${logoClicked ? 'text-white' : ''}`} onClick={handleLogoClick}>
                    <img src="../assets/images/logo.png" className="sidebarLogo" alt="Logo" />
                </NavLink>
                <br></br>
                <div className="text-left left-0 mt-10 relative">
                    {[
                        ['Profile', '/profile'],
                        ['Settings', '/settings'],
                        ['Match', '/match'],
                        ['Inbox', '/inbox'],
                        ['Saved', '/saved']
                    ].map(([label, destination]) => (
                        <NavLink
                            key={label}
                            to={destination}
                            className={`max-h-full flex flex-col relative mb-[5rem] font-sans font-bold drop-shadow-lg transform scale-100 transition-transform duration-200 hover:scale-110 hover:text-gold active:scale-90 ${activePage === destination ? 'text-white text-2xl' : 'text-inactive_gray'}`}
                            onClick={() => setActivePage(destination)}
                        >
                            {label}
                            {activePage === destination && <div className="absolute bottom-0 left-0 w-full h-1 bg-gold"></div>}
                            <div className="absolute top-0 left-0 w-full h-full bg-maroon hover:bg-gold transition-all duration-200 opacity-0 group-hover:opacity-30"></div>
                        </NavLink>
                    ))}

                    <div className="text-inactive_gray transition-transform duration-200 hover:scale-110 hover:text-gold cursor-pointer inline-flex items-center">
                        <Logout id="logout" className="logout" /> <span className="ml-1" onClick={() => document.getElementById('logout').click()}>&#8594;</span>
                    </div>
                </div>
            </nav>
        </>
    );
}
