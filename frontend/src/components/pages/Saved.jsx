import kanye from '../../assets/images/kanye.png';
import TemplateProfile from '../../TemplateProfile.json';
import backend from '../../backend.js';
import { useEffect, useState } from 'react';
import { ProfileCard } from '../ui-components/ProfileCard';
import currentUser from '../../currentUser.js';
import { Link } from 'react-router-dom';


export default function Saved() {
    const [openProfile, setOpenProfile] = useState(null);
    const [matchedProfiles, updateMatchedProfiles] = useState([]);
    const [updateDep, stepUpdateDep] = useState(1);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [matches, updateMatches] = useState([]); // {matchId: userid, timestamp: ???}[]
    const [activeButton, setActiveButton] = useState('Roommates'); // Initially set to 'Roommates'
    const [profilePictures, setProfilePictures] = useState({});

    let people = [];
    people = matchedProfiles;

    useEffect(() => {
        (async () => {
            const matchesRes = await backend.get('/match/saved-matches', { params: { userId: currentUser.user_id } });

            const columnsToFetch = ['first_name', 'last_name', 'major', 'graduating_year', 'user_id'];

            const profilePromises = matchesRes.data.map((matchId) =>
                Promise.all([
                    backend.get('/profile/get-gendata', {
                        params: {
                            user_id: matchId,
                            filter: columnsToFetch
                        }
                    }),
                    backend.get("/profile/user-pictures", { params: { user_id: matchId } })
                ])
            );

            Promise.all(profilePromises).then((promiseResults) => {
                const translatedData = promiseResults.map(([profileResponse, pictureResponse]) => ({
                    ...profileResponse.data[0],
                    pictureUrl: pictureResponse.data.pictureUrls.length > 0 ? pictureResponse.data.pictureUrls[0] : kanye // Check if pictureUrls array is empty
                }));
                updateMatchedProfiles(translatedData);

                // Create an object with user_id as key and picture URL as value
                const picturesObj = translatedData.reduce((acc, profile) => {
                    acc[profile.user_id] = profile.pictureUrl;
                    return acc;
                }, {});
                setProfilePictures(picturesObj);
            });
        })();
    }, [updateDep]);

    function removeSave(profileId) {
        backend.delete('/match/remove', { params: { user1Id: currentUser.user_id, user2Id: profileId, decision: "unsure" } })
            .then(() => {
                updateMatchedProfiles(prevProfiles => prevProfiles.filter(profile => profile.user_id !== profileId));
            })
            .catch((error) => {
                console.error("Error removing a save:", error);
            });
    }

    function unmatch(profileId) {
        backend.delete('/match/inbox-delete', { params: { user1_id: currentUser.user_id, user2_id: profileId } })
            .then(() => {
                updateMatchedProfiles(prevProfiles => prevProfiles.filter(profile => profile.user_id !== profileId));
            })
            .catch((error) => {
                console.error("Error unmatching profiles:", error);
            });
    }

    async function match(profileId) {
        try {
            await unmatch(profileId);
            await backend.post('/match/matcher', {
                user1Id: currentUser.user_id,
                user2Id: profileId,
                decision: "match"
            });
            stepUpdateDep(s => s + 2);
        } catch (error) {
            console.error("Error matching profiles:", error);
        }
    }

    function displayProfile(profile) {
        setSelectedProfile(profile);
    }

    return (
        <div className="p-8">
            {selectedProfile && (
                <div className="ml-[7vw]" style={{ width: '80%', height: '40%' }}>
                    <ProfileCard user_data={selectedProfile} editedBio={selectedProfile.bio} qnaAnswers={selectedProfile.qnaAnswers} dormMode={1} editable={false} />
                    <button onClick={() => setSelectedProfile(null)} className="absolute top-5 right-5 text-5xl text-maroon">X</button>
                </div>
            )}
            <div className="flex flex-col items-center justify-center h-[500px] w-[200px]">
                <div className="h-[100%] w-[100%] mt-[1vh] bg-maroon rounded-tr-[0.5vh] rounded-tl-[0.5vh] flex items-center justify-center">
                    <svg
                        width="4vw"
                        height="4vh"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white">
                        <rect width="24" height="24" fill="none" />
                        <path d="M5 19.6693V4C5 3.44772 5.44772 3 6 3H18C18.5523 3 19 3.44772 19 4V19.6693C19 20.131 18.4277 20.346 18.1237 19.9985L12 13L5.87629 19.9985C5.57227 20.346 5 20.131 5 19.6693Z" stroke="white" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="bg-white h-[87vh] w-[47vw] rounded-br-[0.5vh] rounded-bl-[0.5vh] items-center text-center justify-center">
                    {people.map((person, index) => (
                        <div className="flex flex-col h-[11vh] w-full" key={person.user_id}>
                            <div className="flex">
                                <div className="flex flex-row w-full">
                                    <img
                                        src={profilePictures[person.user_id] || kanye}
                                        className="rounded-full h-[8vh] w-[8vh] mt-[0.5vh] ml-[0.5vw] cursor-pointer"
                                        onClick={() => displayProfile(person)}
                                        alt={`${person.first_name}'s profile`}
                                    />
                                    <div className="flex flex-col w-full text-start justify-start">
                                        <div className="flex flex-row">
                                            <button className="text-[2.5vh] mt-[1.5vh] ml-[1vw] font-roboto font-[390] text-maroon" onClick={() => displayProfile(person)}>{`${person.first_name} ${person.last_name}`}</button>
                                        </div>
                                        <div className="flex flex-row">
                                            <button className="ml-[1vw] text-[2vh] font-[200] text-black" onClick={() => displayProfile(person)}>{`${person.major} Major, Class of ${person.graduating_year}`}</button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-end">
                                        <button className="" onClick={() => match(person.user_id)}>
                                            <svg width="3vw" height="3vh" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" className="hover:stroke-gold" stroke="#000000"><polyline points="12 28 28 44 52 20" /></svg>
                                        </button>
                                        <button className="hover:text-maroon text-inactive_gray mr-[1.1vw] text-[2.125vh]" onClick={() => removeSave(person.user_id)}>X</button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[40vw] h-[0.1vh] ml-[3.5vw] bg-gray font-thin mt-[1.75vh]"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
