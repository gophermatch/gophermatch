import kanye from '../../assets/images/kanye.png';
import { useEffect, useState } from 'react';
import { ProfileCard } from '../ui-components/ProfileCard.jsx';
import SubleaseEntry from '../ui-components/SubleaseEntry.jsx';
import MatchEntry from '../ui-components/MatchEntry.jsx';
import SubleaseInboxEntry from '../ui-components/SubleaseInboxEntry.jsx';
import SavedEntry from '../ui-components/SavedEntry.jsx';
import backend from '../../backend.js';
import currentUser from '../../currentUser.js';

export default function People({ user_data }) {
    const [matchedProfileIds, updateMatchedProfiles] = useState([]);
    const [matchedSubleaseIds, updateMatchedSubleases] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedSublease, setSelectedSublease] = useState(null);
    const [activeButton, setActiveButton] = useState('Roommates'); // Initially set to 'Roommates'

    useEffect(() => {
        (async () => {
            try {
                const matchesRes = await backend.get('/match/inbox', { params: { userId: currentUser.user_id } });

                updateMatchedProfiles(matchesRes.data.map(item => item.matchId));
            } catch (error) {
                console.error("Error fetching matched profiles:", error);
            }
            try {
                const subleaseRes = await backend.get('/sublease/get-saves', { params: { user_id: currentUser.user_id } });

                console.log("sub data", subleaseRes.data);

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
                    {matchedProfileIds.map((person) => (
                        <MatchEntry user_id={person} deleteMatch={unmatch}/>
                        ))}
                    <div className="flex text-start justify-start font-medium">
                        <span className="text-maroon text-start text-[2vh] ml-[0.5vw] mt-[2vh] mb-[1vh] font-roboto justify-start">Subleases</span>
                    </div>
                        {matchedSubleaseIds.map((sublease) => (
                            <SubleaseInboxEntry user_id={sublease} deleteSub={deleteSublease}/>
                        ))}
                    </div>
                </div>
            </div>
    );
}