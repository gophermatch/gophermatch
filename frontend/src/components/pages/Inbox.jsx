import kanye from '../../assets/images/kanye.png';
import { useEffect, useState } from 'react';
import { ProfileCard } from '../ui-components/ProfileCard';
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
                    backend.get('account/fetch', { params: { user_id: matchId }, withCredentials: true }),
                    backend.get('/profile/user-pictures', { params: { user_id: matchId } })
                ]));

                Promise.all(profilePromises).then((promiseResults) => {
                    const translatedData = promiseResults.map(([profileRes, accountRes, picsRes]) => {
                        return { ...profileRes.data, ...accountRes.data.data, pics: picsRes.data.pictureUrls };
                    });
                    updateMatchedProfiles(translatedData);
                });
            } catch (error) {
                console.error("Error fetching matched profiles:", error);
            }
            try {
                const subleaseRes = await backend.get('/sublease/saved-subleases', { params: { user_id: currentUser.user_id } });
                console.log("HEHEHE", subleaseRes);
                const subleasePromises = subleaseRes.data.map(sublease =>
                    backend.get('/profile/get-gendata', {
                        params: {
                            user_id: sublease.user_id,
                            filter: ['first_name', 'last_name', 'contact_email']
                        }
                    }).then(userRes => ({ ...sublease, ...userRes.data[0] }))
                );

                Promise.all(subleasePromises).then((subleasesWithUserData) => {
                    updateMatchedSubleases(subleasesWithUserData);
                });
            } catch (error) {
                console.error("Failed fetching subleases: ", error);
            }
        })();
    }, []);

    useEffect(() => {
        backend.post('/match/mark-seen', { userId: currentUser.user_id });
    }, []);

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
        setSelectedSublease(sublease);
    }

    return (
        <div className="p-8">
            {selectedProfile && (
                <div className="ml-[7vw]" style={{ width: '80%', height: '40%' }}>
                    <ProfileCard user_data={selectedProfile} editedBio={selectedProfile.bio} qnaAnswers={selectedProfile.qnaAnswers} dormMode={1} editable={false} />
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
                    {matchedProfiles.map((person, index) => (
                        <div className="flex flex-col h-[9.5vh] w-full" key={index}>
                            <div className="flex" key={index}>
                                <div className="flex flex-row w-full">
                                    <img src={person.pics[0] || kanye} className="rounded-full h-[8vh] w-[8vh] mt-[0.5vh] ml-[0.5vw] cursor-pointer" alt="Profile" onClick={() => displayProfile(person)}></img>
                                    <div className="flex flex-col w-full text-start items-start justify-start">
                                        <button className="text-[2.5vh] mt-[0.75vh] w-auto ml-[1vw] font-roboto font-light text-start text-maroon" onClick={() => displayProfile(person)}>{`${person.first_name} ${person.last_name}`}</button>
                                        <button className="text-[2vh] font-thin ml-[1vw]" onClick={() => displayProfile(person)}>{person.contact_phone}</button>
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
                                        <p className="text-[2.5vh] mt-[1.5vh] ml-[1vw] w-[30vw] font-roboto font-[390] text-maroon">{`${sublease.building_name} - ${sublease.building_address}`}</p>
                                        <div className="flex flex-row">
                                            <p className="ml-[1vw] text-xs text-left text-[1.5vh] w-[25vw] font-roboto font-light">{`${sublease.first_name} ${sublease.last_name}`}</p>
                                            <p className="ml-[1vw] text-xs text-left text-[1.5vh] w-[25vw] font-roboto font-light">{sublease.contact_email}</p>
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
                            <SubleaseEntry sublease={selectedSublease} refreshFunc={() => {
                                // Optional: Function to refresh the sublease list after an action
                            }} />
                            <button onClick={() => setSelectedSublease(null)} className="absolute top-5 right-5 text-5xl text-maroon">X</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
