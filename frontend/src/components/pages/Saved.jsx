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

export default function Saved() {
    const [openProfile, setOpenProfile] = useState(false);
    const [matchedProfiles, updateMatchedProfiles] = useState([])
    const [updateDep, stepUpdateDep] = useState(1);
    const [matches, updateMatches] = useState([]); // {matchId: userid, timestamp: ???}[]


    let people = [];
    // get matches
    // people.push(dummyData);
    // people.push(secondData);
    people = matchedProfiles

    // useEffect(() => {
    //     backend.get('profile', {params: {user_id: 54 /*54*/}, withCredentials: true}).then((res) => {
    //         console.log(res.data)
    //     })
    // }, [])

    useEffect(() => {
        (async () => {
            const matchesRes = await backend.get('/match/saved-matches', {params: {
                userId: currentUser.user_id
            }})

            const profilePromises = matchesRes.data.map((matchId) => Promise.all([
                backend.get('/profile', {params: {user_id: matchId}}),
                backend.get('account/fetch', {params: {user_id: matchId}, withCredentials: true})
            ]));

            Promise.all(profilePromises).then((promiseResults) => {
                const translatedData = promiseResults.map(([profileRes, accountRes]) => {
                    return {...profileRes.data, ...accountRes.data.data}
                })
                updateMatchedProfiles(translatedData);
            });
        })();
    }, [updateDep]);

    function unmatch(profileId) {
        return backend.delete('/match/remove', {params: {
            user1Id: currentUser.user_id,
            user2Id: profileId,
            decision: "unsure"
        }}).then(() => stepUpdateDep(s => s + 1));
    }

    function match(profileId) {
        unmatch(profileId).then(() => {
            backend.post('/match/matcher', {
                user1Id: currentUser.user_id,
                user2Id: profileId,
                decision: "match"
            }).then(() => stepUpdateDep(s => s + 2))
        })
    }

    function displayProfile(id) {
        setOpenProfile(true); //todo: request an actual profile and update state from data
    }

    const profilePopup = openProfile && (
        <>
        <div id='inbox-profile-popup' onClick={(e) => {if (!isOnProfilePopup(e.target)) setOpenProfile(null)}} className="bg-[#000000a9] fixed inset-0">
            <Profile data={TemplateProfile} editable={false} />
        </div>
        <button onClick={() => setOpenProfile(null)} className="absolute top-[5px] right-[5px] text-5xl text-white">X</button>
        </>
    );

    return (
        <div className="p-8">
            {profilePopup}
            <h1 className="text-center text-[4vw] text-maroon mb-[5vh]">Saved Profiles</h1>
            {people.map((person) => (
                <div className="flex flex-col relative">
                    <Link to="/showMatch">
                        <div className="bg-white rounded-md border-[0.25vh] border-maroon p-[1vw] ml-[0.5vw] h-[14vh] m-[2vh] w-[59vw] flex cursor-pointer">
                                <div onClick={() => displayProfile(person.user_id)} className="cursor-pointer h-[80px] w-[80px]">
                                    <img src={kanye} className="rounded-md"></img>
                                </div>
                                <div className="flex items-center text-center flex-1 justify-center p-5">
                                    <div onClick={() => displayProfile(person.user_id)} className="cursor-pointer">
                                        <p className="text-maroon_new text-[4vh] m-0 inline-block">{person.first_name}</p>
                                        <p className="text-maroon_new text-[4vh] m-0 inline-block">&nbsp;{person.last_name}</p>
                                    </div>
                                </div>
                        </div>
                    </Link>
                    <div className="flex flex-row absolute top-0 right-[4vw]">
                        <button className="bg-offgold h-[14vh] w-[8vw] rounded-lg text-white mt-[2vh] m-[1vw] text-[4vh]" onClick={() => match(person.user_id)}>
                            <svg 
                            fill="black" 
                            width="10vw" 
                            height="10vh" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginLeft: '-1vw', pointerEvents: 'none'}}
                            ><path d="M2,21h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20,1,1,0,0,0,2,21ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5ZM23,16a1,1,0,0,1-1,1H19v3a1,1,0,0,1-2,0V17H14a1,1,0,0,1,0-2h3V12a1,1,0,0,1,2,0v3h3A1,1,0,0,1,23,16Z"/></svg>
                        </button>
                        <button className="bg-maroon_transparent h-[14vh] w-[8vw] rounded-lg mt-[2vh] m-[1vw] mr-[-4vw] text-[4vh]" onClick={() => unmatch(person.user_id)}>
                            <svg 
                            fill="black" 
                            width="10vw" 
                            height="10vh" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="mt-[0.25vh] ml-[-1vw]"
                            style={{pointerEvents: 'none'}}>
                                <path d="M1,20a1,1,0,0,0,1,1h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5Zm12.707,9.707L20.414,17l2.293,2.293a1,1,0,1,1-1.414,1.414L19,18.414l-2.293,2.293a1,1,0,0,1-1.414-1.414L17.586,17l-2.293-2.293a1,1,0,0,1,1.414-1.414L19,15.586l2.293-2.293a1,1,0,0,1,1.414,1.414Z"/></svg>
                        </button>
                    </div>
                </div>    
            ))}
        </div>
    );
}
