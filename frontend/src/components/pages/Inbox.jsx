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
                const subleaseRes = await backend.get('/sublease/get-saves', {params: {user_id: currentUser.user_id}});
                updateMatchedSubleases(subleaseRes.data);
            } catch (error) {
                console.error("Failed fetching subleases: ", error)
            }
        })();
    }, []);

    // backend.get('/sublease/get-saves', {params: {user_id: 47}}).then(res => console.log(res))

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
        backend.delete('/sublease/delete-save', {params: {
            user_id: currentUser.user_id,
            sublease_id: sublease_id
        }})
    }

    function displayProfile(profile) {
        setSelectedProfile(profile);
    }

    function displaySublease(sublease) {
        console.log(sublease)
        backend.get('/sublease/get', {params: {user_id: sublease.user_id}}).then((res) => {
            setSelectedSublease(res.data)
            console.log("GOt: ", res.data)
        })
    }

    return (
        <div className="p-8">
            
            <div className="flex flex-col items-center text-center justify-center">
                <div className="flex flex-row bg-maroon h-[5vh] w-[40vw] rounded-tl-[1vh] rounded-tr-[1vh]">
                    <svg 
                        viewBox="0 0 48 48" 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-[4vh] w-full mt-[0.5vh]"
                        fill="white">
                        <path className="cls-1" d="M6.47,10.71a2,2,0,0,0-2,2h0V35.32a2,2,0,0,0,2,2H41.53a2,2,0,0,0,2-2h0V12.68a2,2,0,0,0-2-2H6.47Zm33.21,3.82L24,26.07,8.32,14.53"/>
                    </svg>
                </div>
                <div className="text-white"></div>
                <div className="bg-white h-[90vh] w-[40vw] items-center text-center justify-center">
                    <div className="flex text-start justify-start font-medium">
                        <span className="text-maroon text-start text-[2vh] ml-[0.5vw] mt-[2vh] mb-[1vh] font-roboto justify-start">Roommates</span>
                    </div>
                    {matchedProfiles.map((person, index) => (
                        <div className="flex flex-col h-[9.5vh] w-full" key={index}>
                            <div className="flex" key={index}>
                                <div className="flex flex-row w-full">
                                    <img src={person.profileURL || kanye} className="rounded-full h-[8vh] mt-[0.5vh] ml-[0.5vw]" alt="Profile"></img>
                                    <div className="flex flex-col w-full text-start justify-start">
                                        <p className="text-[2.5vh] ml-[1vw] mt-[0.75vh] w-[30vw] font-roboto font-[390]  text-maroon">{`${person.first_name} ${person.last_name}`}</p>
                                        <p className="text-[2vh] font-thin ml-[1vw]">{person.contact_phone}</p>
                                        <div className="flex flex-row">
                                            <p className="ml-[1vw] text-xs text-left text-[1.5vh] w-[25vw] font-roboto font-light">{person.email}</p>
                                        </div>
                                    </div>
                                    <div className="w-full text-right">
                                        <button className="text-[1.5vh] bg-white hover:bg-red-500 hover:text-white w-[4vw] h-[2.5vh] rounded-lg mr-[1vw] mt-[1.5vh] border-2 border-maroon" onClick={() => displayProfile(person)}>View</button>
                                        <button className="text-[1.5vh] bg-white hover:bg-red-500 hover:text-white w-[4vw] h-[2.5vh] rounded-lg mr-[1vw] mt-[1.5vh] border-2 border-maroon" onClick={() => unmatch(person.user_id)}>Unmatch</button>
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
                                        <p className="text-[2.5vh] mt-[1.5vh] ml-[1vw] w-[30vw] font-roboto font-[390]  text-maroon">{`${sublease.address} - ${sublease.room_type}`}</p>
                                        <div className="flex flex-row">
                                            <p className="ml-[1vw] text-xs text-left text-[1.5vh] w-[25vw] font-roboto font-light">{sublease.email}</p>
                                        </div>
                                    </div>
                                    <div className="w-full text-right">
                                        <button className="text-[1.5vh] bg-white hover:bg-red-500 hover:text-white w-[4vw] h-[2.5vh] rounded-lg mr-[1vw] mt-[1.5vh] border-2 border-maroon" onClick={() => displaySublease(sublease)}>View</button>
                                        <button className="text-[1.5vh] bg-white hover:bg-red-500 hover:text-white w-[4vw] h-[2.5vh] rounded-lg mr-[1vw] mt-[1.5vh] border-2 border-maroon" onClick={() => deleteSublease(sublease.sublease_id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}