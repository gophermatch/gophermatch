import kanye from '../../assets/images/kanye.png';
import { useEffect, useState } from 'react';
import Profile from '../ui-components/Profile.jsx';
import SubleaseEntry from '../ui-components/SubleaseEntry.jsx';
import backend from '../../backend.js';
import currentUser from '../../currentUser.js';

export default function Inbox({ user_data }) {
    const [matchedProfiles, updateMatchedProfiles] = useState([]);
    const [matchedSubleases, updateMatchedSubleases] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedSublease, setSelectedSublease] = useState(null);
    const [activeButton, setActiveButton] = useState('Roommates'); // Initially set to 'Roommates'

    useEffect(() => {
        (async () => {
            try {
                const matchesRes = await backend.get('/match/inbox', { params: { userId: currentUser.user_id } });
                const profilePromises = matchesRes.data.map(({ matchId, timestamp }) => Promise.all([
                    backend.get('/profile', { params: { user_id: matchId } }),
                    backend.get('account/fetch', { params: { user_id: matchId }, withCredentials: true })
                ]));

                Promise.all(profilePromises).then((promiseResults) => {
                    const translatedData = promiseResults.map(([profileRes, accountRes]) => {
                        return { ...profileRes.data, ...accountRes.data.data };
                    });
                    updateMatchedProfiles(translatedData);
                });
            } catch (error) {
                console.error("Error fetching matched profiles:", error);
            }
            try {
                const subleaseRes = await backend.get('/sublease/get-saves', { params: { user_id: currentUser.user_id } });
                updateMatchedSubleases(subleaseRes.data);
            } catch (error) {
                console.error("Failed fetching subleases: ", error)
            }
        })();
    }, []);

    useEffect(() => {
        backend.post('/match/mark-seen', { userId: currentUser.user_id });
    }, []);

    const fetchPictureUrls = async () => {
        try {
            if (!user_id) {
                console.error("User ID is missing");
                return;
            }

            const response = await backend.get("/profile/user-pictures", {
                params: { user_id: user_id },
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
        backend.delete('/match/inbox-delete', { params: { user1_id: currentUser.user_id, user2_id: profileId } })
            .then(() => {
                updateMatchedProfiles(prevProfiles => prevProfiles.filter(profile => profile.user_id !== profileId));
            })
            .catch((error) => {
                console.error("Error unmatching profiles:", error);
            });
    }

    function deleteSublease(sublease_id) {
        backend.delete('/sublease/delete-save', {
            params: {
                user_id: currentUser.user_id,
                sublease_id: sublease_id
            }
        })
        .then(() => {
            updateMatchedSubleases(prevSubleases => prevSubleases.filter(sublease => sublease.sublease_id !== sublease_id));
        })
        .catch((error) => {
            console.error("Error deleting sublease:", error);
        });
    }

    function displayProfile(profile) {
        setSelectedProfile(profile);
    }

    function displaySublease(sublease) {
        backend.get('/sublease/get', { params: { user_id: sublease.user_id } }).then((res) => {
            setSelectedSublease(res.data);
        });
    }

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length !== 10) {
            return phoneNumber;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    };

    return (
        <div className="p-8">
            {selectedProfile && (
                <div className="ml-[7vw]" style={{ width: '80%', height: '40%' }}>
                    <Profile user_data={selectedProfile} editable={false} />
                    <button onClick={() => setSelectedProfile(null)} className="absolute top-5 right-5 text-5xl text-maroon">X</button>
                </div>
            )}
            <div className="p-8">
                <div className="flex flex-col items-center text-center justify-center">
                    <div className="flex flex-row bg-maroon h-[5vh] mt-[-2.8vh] w-[47vw] rounded-tl-[0.5vh] rounded-tr-[0.5vh]">
                        <svg
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-[4vh] w-full mt-[0.5vh]"
                            fill="white">
                            <path className="cls-1" d="M6.47,10.71a2,2,0,0,0-2,2h0V35.32a2,2,0,0,0,2,2H41.53a2,2,0,0,0,2-2h0V12.68a2,2,0,0,0-2-2H6.47Zm33.21,3.82L24,26.07,8.32,14.53" />
                        </svg>
                    </div>
                    <div className="bg-white h-[87vh] w-[47vw] rounded-br-[0.5vh] mb-[2vh] rounded-bl-[0.5vh] items-center text-center justify-center">
                        <div className="flex text-start justify-start font-medium">
                            <span className="text-maroon text-start text-[2vh] ml-[0.5vw] mt-[2vh] mb-[1vh] font-roboto justify-start">Roommates</span>
                        </div>
                        {matchedProfiles.map((person, index) => (
                            <div className="flex flex-col h-[9.5vh] w-full" key={index}>
                                <div className="flex" key={index}>
                                    <div className="flex flex-row w-full">
                                        <img src={person.profileURL || kanye} className="rounded-full h-[8vh] mt-[0.5vh] ml-[0.5vw] cursor-pointer" alt="Profile" onClick={() => displayProfile(person)} />
                                        <div className="flex flex-col w-full text-start items-start justify-start">
                                            <button className="text-[2.5vh] mt-[0.75vh] w-auto ml-[1vw] font-roboto font-light text-start text-maroon" onClick={() => displayProfile(person)}>{`${person.first_name} ${person.last_name}`}</button>
                                            <button className="text-[2vh] font-thin ml-[1vw]" onClick={() => displayProfile(person)}>{formatPhoneNumber(person.contact_phone)}</button>
                                        </div>
                                        <div className="w-full text-right">
                                            <button className="text-[2.5vh] text-inactive_gray hover:text-maroon w-[4vw] mr-[1vw] mt-[2.5vh]" onClick={() => unmatch(person.user_id)}>X</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex text-start justify-start font-medium">
                            <span className="text-maroon text-start text-[2vh] ml-[0.5vw] mt-[2vh] mb-[1vh] font-roboto justify-start">Subleases</span>
                        </div>
                        {matchedSubleases.map((sublease, index) => (
                            <div className="flex flex-col h-[9.5vh] w-full" key={index}>
                                <div className="flex" key={index}>
                                    <div className="flex flex-row w-full">
                                        <div className="flex flex-col w-full text-start justify-start">
                                            <p className="text-[2.5vh] mt-[1.5vh] ml-[1vw] w-[30vw] font-roboto font-[390] text-maroon">{`${sublease.address} - ${sublease.room_type}`}</p>
                                            <div className="flex flex-row">
                                                <p className="ml-[1vw] text-xs text-left text-[1.5vh] w-[25vw] font-roboto font-light">{sublease.email}</p>
                                            </div>
                                        </div>
                                        <div className="w-full text-right">
                                            <button className="text-[1.5vh] bg-white hover:bg-red-500 hover:text-white w-[4vw] h-[2.5vh] rounded-lg mr-[1vw] mt-[1.5vh] border-2 border-maroon" onClick={() => displaySublease(sublease)}>View</button>
                                            <button className="text-[1.5vh] bg-white hover:bg-red-500 hover:text-white w-[4vw] h-[2.5vh] rounded-lg mr-[1vw] mt-[1.5vh] border-2 border-maroon" onClick={() => deleteSublease(sublease.sublease_id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {selectedSublease && (
                            <div>
                                <SubleaseEntry subleaseData={selectedSublease} editable={false} />
                                <button onClick={() => setSelectedSublease(null)} className="absolute top-5 right-5 text-5xl text-maroon">X</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}