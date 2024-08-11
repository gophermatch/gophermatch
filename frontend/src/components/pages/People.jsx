import { useEffect, useState } from 'react';
import { ProfileCard } from '../ui-components/ProfileCard.jsx';
import SubleaseEntry from '../ui-components/SubleaseEntry.jsx';
import MatchEntry from '../ui-components/MatchEntry.jsx';
import SubleaseInboxEntry from '../ui-components/SubleaseInboxEntry.jsx';
import SavedEntry from '../ui-components/SavedEntry.jsx';
import backend from '../../backend.js';
import currentUser from '../../currentUser.js';
import "../ui-components/ProfileCardContent/apartmentStyles.css"

export default function People({ user_data }) {
    const [matchedProfileIds, updateMatchedProfiles] = useState([]);
    const [matchedSubleaseIds, updateMatchedSubleases] = useState([]);
    const [savedProfileIds, updateSavedProfiles] = useState([]);


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
            try {
                const matchesRes = await backend.get('/match/saved-matches', { params: { userId: currentUser.user_id } });

                updateSavedProfiles(matchesRes.data);
            } catch (error) {
                console.error("Failed fetching saved: ", error)
            }
        })();
    }, []);

    useEffect(() => {
        backend.post('/match/mark-seen', { userId: currentUser.user_id });
    }, []);

    function unmatch(profileId) {

        console.log("removing match: ", profileId);

        backend.delete('/match/inbox-delete', { params: { user1_id: currentUser.user_id, user2_id: profileId } })
            .then(() => {
                updateMatchedProfiles(prevProfiles => prevProfiles.filter(uid => uid !== profileId));
                updateSavedProfiles(prevProfiles => prevProfiles.filter(uid => uid !== profileId));
            })
            .catch((error) => {
                console.error("Error unmatching profiles:", error);
            });
    }

    function confirmMatch(profileId) {
        backend.post('/match/matcher', { user1Id: currentUser.user_id, user2Id: profileId, decision: "match"})
            .then(() => {
                updateSavedProfiles(prevProfiles => prevProfiles.filter(uid => uid !== profileId));
            })
            .catch((error) => {
                console.error("Error matching profiles:", error);
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
            updateMatchedSubleases(prevProfiles => prevProfiles.filter(sid => sid !== sublease_id));
        })
        .catch((error) => {
            console.error("Error deleting sublease:", error);
        });
    }

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length !== 10) {
            return phoneNumber;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    };

    return (
        <div className="flex flex-col items-center h-[100%] w-[100%] text-center justify-center ">
                <div className="flex flex-col items-center h-[41.25vw] w-[36.95vw] text-center justify-center ">
                    <div className="flex flex-row bg-maroon h-[8%] w-[100%] rounded-tl-[10px] rounded-tr-[10px]">
                        <svg
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-[80%] w-full mt-[0.5vh]"
                            fill="white">
                            <path className="cls-1" d="M6.47,10.71a2,2,0,0,0-2,2h0V35.32a2,2,0,0,0,2,2H41.53a2,2,0,0,0,2-2h0V12.68a2,2,0,0,0-2-2H6.47Zm33.21,3.82L24,26.07,8.32,14.53" />
                        </svg>
                    </div>
                    <div className="bg-white pt-[2%] pb-[2%] h-[100%] w-[100%] rounded-br-[10px] rounded-bl-[10px] items-center text-center justify-center overflow-y-scroll custom-scrollbar">
                    
                    <div className="flex text-start justify-start font-medium">
                        <span className="text-maroon text-start text-[18px] ml-[2%] mt-[1%] mb-[2%] font-bold font-roboto_condensed justify-start">Roommates</span>
                    </div>
                    {matchedProfileIds.length > 0 ? matchedProfileIds.map((id) => (
                        <MatchEntry user_id={id} deleteMatch={unmatch}/>
                        )) : <div>No matches yet</div>}

                    <div className="flex text-start justify-start font-medium">
                        <span className="text-maroon text-start text-[18px] ml-[2%] mt-[1%] mb-[2%] font-bold font-roboto_condensed justify-start">Saved Profiles</span>
                    </div>
                    {savedProfileIds.length > 0 ? savedProfileIds.map((id) => (
                        <SavedEntry user_id={id} deleteMatch={unmatch} acceptMatch={confirmMatch}/>
                        )) : <div>No profiles saved, click the bookmark on a user's profile</div>}

                    <div className="flex text-start justify-start font-medium">
                        <span className="text-maroon text-start text-[18px] ml-[2%] mt-[1%] mb-[2%] font-bold font-roboto_condensed justify-start">Subleases</span>
                    </div>
                        {matchedSubleaseIds.length > 0 ? matchedSubleaseIds.map((id) => (
                            <SubleaseInboxEntry sublease_id={id} deleteSub={deleteSublease}/>
                        )) : <div>You aren't in contact with any subleases</div>}
                    </div>
                    </div>
        </div>
    );
}