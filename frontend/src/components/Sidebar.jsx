import React, { useState, useRef, useEffect, Fragment } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logout from './Logout';
import InboxNotification from './ui-components/InboxNotification';
import FadeAlert from './ui-components/FadeAlert';
import UserStateBroadcaster from '../UserStateBroadcaster';
import currentUser from '../currentUser';

export default function Sidebar() {
    const [activePage, setActivePage] = useState('/match');
    const [logoClicked, setLogoClicked] = useState(false);
    const [inboxClicked, setInboxClicked] = useState(false);
    const inboxRef = useRef(null); // Ref for the Inbox NavLink
    const [notificationPosition, setNotificationPosition] = useState({ top: 0, left: 0 });
    const [showAlert, setShowAlert] = useState(false);

    const handleMatchClick = () => {
        navigate("/profile");
        setShowAlert(true);
        console.log("testest")
    };

    const handleAlertHide = () => {
        setShowAlert(false);
    };

    const location = useLocation();
    const navigate = useNavigate();

    // This will be called every time the location changes
    // Makes the most sense to have this be the only place setActivePage is called
    useEffect(() => {
        setActivePage(location.pathname);
    }, [location]);

    const [profileCompletion, setProfileCompletion] = useState(currentUser.profile_completion);

    useEffect(() => {
        setProfileCompletion(currentUser.profile_completion);
    }, [currentUser.profile_completion]);

    const handleLogoClick = () => {
        setLogoClicked(true);
        setInboxClicked(false);
    };

    useEffect(() => {
        const handleProfileStateChange = (newState) => {
            setProfileCompletion(newState);
        };

        UserStateBroadcaster.on('profileStateChange', handleProfileStateChange);

        return () => {
            UserStateBroadcaster.off('profileStateChange', handleProfileStateChange);
        };
    }, []);

    // Update notification position when inboxRef changes
    useEffect(() => {
        if (inboxRef.current) {
            const { offsetTop, offsetLeft } = inboxRef.current;
            setNotificationPosition({ top: offsetTop, left: offsetLeft + inboxRef.current.offsetWidth });
        }
    }, [inboxRef.current]);

    return (
        <>
            <nav className="flex flex-col items-left items-center text-left p-5 w-full text-[24px] font-roboto h-screen bg-maroon_new rounded-none shadow-md" id="nav">
                <div className={"flex pl-[0.5vw] space-x-[1vw] w-[13vw] items-center whitespace-no-wrap"}>
                <NavLink exact="true" to="/" className={"w-1/4"} onClick={handleLogoClick}>
                    <img src="../assets/images/logo.png" className="" alt="Logo" />
                </NavLink>
                    <p className={"w-3/4 text-[10px] sm:text-[12px] md:text-[14px] xl:text-[16px] 2xl:text-[18px] font-bold text-white"}>Welcome, {currentUser.gen_data.first_name}!</p>
                </div>
                <div className={"mt-[3vh] w-[14vw] h-[0.1vh] bg-gold rounded-full"}></div>
                <div className="mt-[2.5vh] relative">
                    {[
                        ['Match', '/match'],
                        ['Profile', '/profile'],
                        ['Settings', '/settings'],
                        ['People', '/people'],
                        ['Subleases', '/sublease']
                    ].map(([label, destination]) => (
                        <Fragment key={label}>
                            {destination == "/match" && profileCompletion != "complete" ? 

                        (
                            <span
                            onClick={handleMatchClick}
                            className={`cursor-pointer tooltip select-none max-h-full text-[10px] sm:text-[12px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] pl-[1vw] py-[0.7vw] flex flex-col relative mb-[2vh] font-roboto w-[14vw] font-bold rounded-2xl duration-200 text-dark_inactive_gray`}>
                                Match
                                <FadeAlert text="Your profile is incomplete! Ensure you have a photo and a bio!" trigger={showAlert} onHide={handleAlertHide} />
                            </span>
                        )
                        :
                            (<NavLink
                                key={label}
                                // Use # as destination for the match page when the match page is locked out
                                to={destination == "/match" && profileCompletion != "complete" ? "#" : destination}
                                id={label === 'Inbox' ? 'inbox-navlink' : null} // Assign ID to Inbox NavLink
                                className={`max-h-full text-[10px] sm:text-[12px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] pl-[1vw] py-[0.7vw] flex flex-col relative mb-[2vh] font-roboto w-[14vw] font-bold rounded-2xl duration-200 ${activePage === destination ? 'text-maroon_new bg-white' : 'hover:bg-maroon_dark text-white'}`}
                                onClick={() => {
                                    if (label === 'Inbox') {
                                        setInboxClicked(true);
                                    } else {
                                        setInboxClicked(false);
                                    }
                                }}
                                ref={label === 'People' ? inboxRef : null} // Assign ref only to the People NavLink
                            >
                                {label}
                                {/*{activePage === destination && <div className="absolute bottom-0 left-0 w-full h-1 bg-gold"></div>}*/}
                                {
                                    label === 'People' && <InboxNotification inboxClicked={inboxClicked} />
                                }
                            </NavLink>)}
                        </Fragment>
                    ))}

                    <div className="text-white text-[10px] sm:text-[12px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] pl-[1vw] py-[0.7vw] font-bold w-[14vw] duration-200 rounded-2xl hover:bg-maroon_dark cursor-pointer inline-flex items-center">
                        <Logout id="logout" className="logout" /> <span className="ml-1" onClick={() => document.getElementById('logout').click()}>&#8594;</span>
                    </div>
                </div>
            </nav>
        </>
    );
}
