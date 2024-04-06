import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logout from './Logout';
import currentUser from "../currentUser.js";

export default function Sidebar() {
    const [activePage, setActivePage] = useState('/match');
    const [logoClicked, setLogoClicked] = useState(false);

    const handleLogoClick = () => {
        setLogoClicked(true);
        setActivePage('/match');
    };

    return (
        <>
            <nav className="flex flex-col items-left items-center text-left p-5 w-full text-[24px] font-roboto h-screen bg-maroon_new rounded-none shadow-md" id="nav">
                <div className={"flex pl-[0.5vw] space-x-[1vw] w-[13vw] items-center whitespace-no-wrap"}>
                <NavLink exact to="/" className={"w-1/4"} onClick={handleLogoClick}>
                    <img src="../assets/images/logo.png" className="" alt="Logo" />
                </NavLink>
                    <p className={"w-3/4 text-[10px] sm:text-[12px] md:text-[14px] xl:text-[16px] 2xl:text-[18px] font-bold text-white"}>Welcome, {currentUser.user_data.first_name}!</p>
                </div>
                <div className={"mt-[3vh] w-[14vw] h-[0.1vh] bg-gold rounded-full"}></div>
                <div className="mt-[2.5vh] relative">
                    {[
                        ['Match', '/match'],
                        ['Profile', '/profile'],
                        ['Settings', '/settings'],
                        ['Inbox', '/inbox'],
                        ['Saved', '/saved'],
                        ['Subleases', '/sublease']
                    ].map(([label, destination]) => (
                        <NavLink
                            key={label}
                            to={destination}
                            className={`max-h-full text-[10px] sm:text-[12px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] pl-[1vw] py-[0.7vw] flex flex-col relative mb-[2vh] font-roboto w-[14vw] font-bold rounded-2xl duration-200 ${activePage === destination ? 'text-maroon_new bg-white' : 'hover:bg-maroon_dark text-white'}`}
                            onClick={() => setActivePage(destination)}
                        >
                            {label}
                            {/*{activePage === destination && <div className="absolute bottom-0 left-0 w-full h-1 bg-gold"></div>}*/}
                        </NavLink>
                    ))}

                    <div className="text-white text-[10px] sm:text-[12px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] pl-[1vw] py-[0.7vw] font-bold w-[14vw] duration-200 rounded-2xl hover:bg-maroon_dark cursor-pointer inline-flex items-center">
                        <Logout id="logout" className="logout" /> <span className="ml-1" onClick={() => document.getElementById('logout').click()}>&#8594;</span>
                    </div>
                </div>
            </nav>
        </>
    );
}
