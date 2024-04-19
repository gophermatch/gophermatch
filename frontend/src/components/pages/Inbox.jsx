import kanye from '../../assets/images/kanye.png';
import { useEffect, useState } from 'react';
import Profile from '../ui-components/Profile.jsx';
import backend from '../../backend.js';
import currentUser from '../../currentUser.js';

export default function Inbox({ user_data }) {
    const [matchedProfiles, updateMatchedProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);

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
        })();
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

    function displayProfile(profile) {
        setSelectedProfile(profile);
    }

    return (
        <div className="p-8">
            {selectedProfile && (
                <div className="ml-[7vw]" style={{ width: '80%', height: '40%' }}>
                    <Profile user_data={selectedProfile} editable={false} />
                    <button onClick={() => setSelectedProfile(null)} className="absolute top-5 right-5 text-5xl text-maroon">X</button>
                </div>
            )}
            <h1 className="text-center text-4xl text-maroon mb-5">Matches</h1>
            {matchedProfiles.map((person, index) => (
                <div className="flex" key={index}>
                    <div className="flex-row bg-white rounded-md border-2 border-maroon p-4 ml-2 h-48 w-72 flex cursor-pointer"
                        onClick={() => displayProfile(person)}>
                        <img src={person.profileURL || kanye} className="rounded-md w-28 h-40 mt-2"></img>
                        <div className="text-center justify-center">
                            <p className="text-maroon text-center text-2xl inline-block pt-2">{`${person.first_name} ${person.last_name}`}</p>
                        </div>
                    </div>
                    <button className="h-48 w-32 mt-2 bg-yellow-300 border border-black rounded-3xl ml-2"
                        onClick={() => unmatch(person.user_id)}>
                        Unmatch
                    </button>
                </div>
            ))}
        </div>
    );
}
