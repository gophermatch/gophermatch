import kanye from '../../assets/images/kanye.png'
import TemplateProfile from '../../TemplateProfile.json'
import backend from '../../backend.js'
import { useEffect, useState } from 'react'
import Profile from '../ui-components/Profile.jsx'
import currentUser from '../../currentUser.js'
import { Link } from 'react-router-dom'

const dummyData = {
    id: 865728,
    firstName: "Someone",
    lastName: "Special",
    college: "cse"
}

const secondData = {
    id: 54125,
    firstName: "Kanye",
    lastName: "Western",
    college: "cfams"
}

function isOnProfilePopup(node) {
    let parent = node.parentNode;
    while (parent) {
        if (parent === document.getElementById("inbox-profile-popup")) {
            return true;
        }
        parent = parent.parentNode
    }
    return false;
}

export default function Inbox({ user_data }) {
    const [openProfile, setOpenProfile] = useState(false);
    const [matchedProfiles, updateMatchedProfiles] = useState([]);
    const [updateDep, stepUpdateDep] = useState(1);
    const [matches, updateMatches] = useState([]); // {matchId: userid, timestamp: ???}[]
    const [pictureUrls, setPictureUrls] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    let people = [];
    people = matchedProfiles;

    function selectProfile(profile, event) {
        const clickedBox = event.target.getBoundingClientRect();
        setSelectedProfile({...profile, clickedBox, showShortBox: true, showAdditionalInfo: true});
    } 
        

    useEffect(() => {
        (async () => {
            const matchesRes = await backend.get('/match/inbox', {params: {userId: currentUser.user_id}});

            const profilePromises = matchesRes.data.map(({matchId, timestamp}) => Promise.all([
                backend.get('/profile', {params: {user_id: matchId}}),
                backend.get('account/fetch', {params: {user_id: matchId}, withCredentials: true})
            ]));

            Promise.all(profilePromises).then((promiseResults) => {
                const translatedData = promiseResults.map(([profileRes, accountRes]) => {
                    return {...profileRes.data, ...accountRes.data.data};
                });
                updateMatchedProfiles(translatedData);
            });
        })();
    }, [updateDep]);

    useEffect(() => {
        fetchPictureUrls();
    }, []);

    const fetchPictureUrls = async () => {
        console.log(user_id);
        try {
            if (!user_id) {
                console.error("User ID is missing");
                return;
            }
    
            const response = await backend.get("/profile/user-pictures", {
                params: {user_id: user_id},
                withCredentials: true,
            });
            if (response && response.data) {
                console.log("Picture URLs:", response.data.pictureUrls);
                setPictureUrls(response.data.pictureUrls);
            } else {
                console.error("Failed to fetch picture URLs");
            }
        } catch (error) {
            console.error("Error fetching picture URLs:", error);
        }
    };
    
    

    function unmatch(profileId) {
        backend.delete('/match/inbox-delete', {params: {
            user1_id: currentUser.user_id,
            user2_id: profileId
        }}).then(() => {
            updateMatchedProfiles(prevProfiles => prevProfiles.filter(profile => profile.user_id !== profileId));
        });
    }

    function displayProfile(id) {
        setOpenProfile(true); //todo: request an actual profile and update state from data
    }

    const profilePopup = selectedProfile && selectedProfile.clickedBox && (
        <>
            {selectedProfile.showShortBox && (
                <div
                    id='inbox-profile-popup'
                    className="fixed inset-0 flex justify-center items-center"
                    onClick={() => setSelectedProfile(null)}
                >
                    <div
                        className="bg-white rounded-md border-[0.25vh] border-maroon p-[1vw] h-[14vh] w-[59vw] flex"
                        style={{
                            position: 'absolute',
                            top: `${selectedProfile.clickedBox.top}px`,
                            left: `17.61vw`,
                        }}
                    >
                        <img src={selectedProfile.profileURL || kanye} alt="Profile" className="rounded-md w-[7vw] h-[12vh] mt-[-1vh]"></img>
                        <div className="flex flex-col text-maroon text-[2vh] ml-[3vw] mt-[-1vh]">
                            <div className="flex flex-row">
                                <p className="text-maroon text-[2vh] ml-[3vw]">Email:</p>
                                <p className="ml-[7vw]">{selectedProfile.contact_email}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="text-maroon text-[2vh] ml-[3vw]">Phone Number: </p>
                                <p className="ml-[2vw]">{selectedProfile.contact_phone}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="text-maroon text-[2vh] ml-[3vw]">Snapchat: </p>
                                <p className="ml-[4.9vw]">{selectedProfile.contact_snapchat}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="text-maroon text-[2vh] ml-[3vw]">Instagram: </p>
                                <p className="ml-[4.6vw]">{selectedProfile.contact_instagram}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
    
    const WhiteBoxPopup = ({ onClick }) => {
        return (
          <div
            className="fixed inset-0 flex justify-center items-center"
            onClick={onClick}
            style={{ backgroundColor: 'offwhite' }}
          >
            <div
              className="bg-white rounded-md p-8"
              style={{ width: '60vw', height: '60vh' }}
            ></div>
          </div>
        );
      };

    return (
        <div className="p-8">
        {profilePopup}
        <h1 className="text-center text-[4vw] text-maroon mb-[5vh]">Matches</h1>
        {people.map((person, index) => (
            <div className="flex" key={index}>
                <div className="flex flex-col" key={index}>
                <Link to="/showMatch" className="bg-white rounded-md border-[0.25vh] border-maroon p-[1vw] ml-[0.5vw] h-[14vh] m-[2vh] w-[59vw] flex cursor-pointer">
                    {/* Content of the link */}
                
                        <img src={person.profileURL || kanye} className="rounded-md w-[7vw] h-[12vh] mt-[-1vh]"></img>
                        <div className="flex flex-1 text-center justify-center pt-[1.5vh]">
                            <p className="text-maroon text-center text-[4vh] inline-block">{`${person.first_name} ${person.last_name}`}</p>
                            <div className="h-[8vh] w-[5vw] inline-flex object-scale-down hover:scale-110 active:scale-90 justify-center items-center">
                                {/* <svg width="8vw" height="8vh" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                                    <g id="Group_718" data-name="Group 718" transform="translate(-50.5 -150.5)">
                                        <path id="Path_1496" data-name="Path 1496" d="M74.5,176.5h-5v-2h3.9l-6.9-6,1-2,7,6.1v-3.1h2v5A2.006,2.006,0,0,1,74.5,176.5Zm0-22.1-7,6.1-1-2,6.9-6H69.5v-2h5a2.006,2.006,0,0,1,2,2v5h-2Zm-17,20.1v2h-5a2.006,2.006,0,0,1-2-2v-5h2v3.1l7-6.1,1,2-6.9,6Zm2-14-7-6.1v3.1h-2v-5a2.006,2.006,0,0,1,2-2h5v2H53.6l6.9,6Z" fill="black" className=""/>
                                    </g>
                                </svg> */}
                            </div>  
                        </div>
                        </Link>
                    </div>
                    <button 
                        className="h-[14vh] w-[8vw] mt-[2vh] bg-offgold bordef border-black rounded-[1.5vh] ml-[1vw]"
                        onClick={(e) => selectProfile(person, e)}>
                        <div style={{pointerEvents: 'none'}}>
                            <svg width="10vw" height="10vh" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mt-[1vh] ml-[-1vw]">
                                <g id="ic-contact-message">
                                    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px" d="M19.89,3.25H4.11a2,2,0,0,0-2,2v9.06a2,2,0,0,0,2,2H5.75l2.31,4a.85.85,0,0,0,1.48,0l2.32-4h8a2,2,0,0,0,2-2V5.25A2,2,0,0,0,19.89,3.25Z"/>
                                    <line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px" x1="5.01" y1="7.86" x2="11.01" y2="7.86"/>
                                    <line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px" x1="5.01" y1="11.86" x2="18.01" y2="11.86"/>
                                </g>
                            </svg>
                        </div>
                    </button>
                    <button className="h-[14vh] w-[8vw] mt-[2vh] ml-[2vw] bg-maroon_transparent rounded-[1.5vh]"
                        onClick={() => unmatch(person.user_id)}>
                            <div style={{pointerEvents: 'none'}}>
                                <svg fill="black" width="10vw" height="10vh" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mt-[1.5vh] ml-[-1vw]"><path d="M1,20a1,1,0,0,0,1,1h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5Zm12.707,9.707L20.414,17l2.293,2.293a1,1,0,1,1-1.414,1.414L19,18.414l-2.293,2.293a1,1,0,0,1-1.414-1.414L17.586,17l-2.293-2.293a1,1,0,0,1,1.414-1.414L19,15.586l2.293-2.293a1,1,0,0,1,1.414,1.414Z"/></svg>
                            </div>
                    </button>
                </div>
            ))}
        </div>
    );
    
}
