import kanye from '../../assets/images/kanye.png'
import TemplateProfile from '../../TemplateProfile.json'
import backend from '../../backend.js'
import { useState } from 'react'
import Profile from '../ui-components/Profile.jsx'

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

export default function Inbox() {
    const [openProfile, setOpenProfile] = useState(false);
    const people = [];
    // get matches
    people.push(dummyData);
    people.push(secondData);

    function unmatch(profileId) {
        // backend.put("/unmatch", profileId) ??
        console.log("Will attempt to unmatch: " + profileId)
    }

    function displayProfile(id) {
        setOpenProfile(true); //todo: request an actual profile and update state from data
    }

    const profilePopup = openProfile && (
        <>
        <div id='inbox-profile-popup' onClick={(e) => {if (!isOnProfilePopup(e.target)) setOpenProfile(null)}} className="bg-[#000000a9] fixed inset-0">
            <Profile data={TemplateProfile} editable={false} />
        </div>
        <button onClick={() => setOpenProfile(null)} className="absolute top-[1vh] right-[1vw] text-5xl text-white">X</button>
        </>
    );

    return (
        <div className="p-8">
            {profilePopup}
            <h1 className="text-center text-[4vw] mb-[5vh]">Matches</h1>
            {people.map((person) => (
                <div className="bg-white rounded-md border-2 border-maroon p-[1vw] m-[5vh] w-[50vw] flex">
                    <div onClick={() => displayProfile(person.id)} className="cursor-pointer h-[10vh] w-[6vw]">
                        <img src={kanye} className="rounded-md"></img>
                    </div>
                    <div className="flex items-center flex-1 justify-between p-[2vw]">
                        <div onClick={() => displayProfile(person.id)} className="cursor-pointer">
                            <p className="font-bold text-maroon_new text-[4vh] m-0 inline-block">{person.firstName}</p>
                            <p className="font-bold text-maroon_new text-[4vh] m-0 inline-block">&nbsp;{person.lastName}</p>
                        </div>
                        <button className="text-[3vh]">Info</button>
                        <button className="bg-red-500 h-[6vh] z-10 w-[4vw] rounded-lg text-white text-[5vh]" onClick={() => unmatch(person.id)}>X</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
