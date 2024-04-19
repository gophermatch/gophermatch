import kanye from '../../assets/images/kanye.png';
import { useEffect, useState } from 'react';
import Profile from '../ui-components/Profile.jsx';
import backend from '../../backend.js';
import currentUser from '../../currentUser.js';

export default function Inbox({ user_data }) {
    const [matchedProfiles, updateMatchedProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
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
        <div className="flex flex-col items-center text-center justify-center">
            <div className="flex flex-row">
            <button className={`bg-${activeButton === 'Roommates' ? 'maroon' : 'dark_maroon'} h-[5vh] w-[20vw]  rounded-tl-[1vh] text-[2vh] font-light font-roboto rounded-tr-[1vh] text-${activeButton === 'Roommates' ? 'white' : 'newwhite'}`}
                onClick={() => setActiveButton('Roommates')}>
                Roommates
            </button>
            <button className={`bg-${activeButton === 'Subleases' ? 'maroon' : 'dark_maroon'} h-[5vh] w-[20vw]  rounded-tl-[1vh] rounded-tr-[1vh] text-[2vh] font-light font-roboto text-${activeButton === 'Subleases' ? 'white' : 'newwhite'}`}
                onClick={() => setActiveButton('Subleases')}>
                Subleases
            </button>
            </div>
            <div className="text-newwhite"></div>
            <div className="bg-white h-[90vh] w-[40vw] items-center text-center justify-center">
            {matchedProfiles.map((person, index) => (
                <div className="flex flex-col h-[9.5vh] w-full">
                    <div className="flex" key={index}>
                        <div className="flex flex-row w-full">
                                <img src={person.profileURL || kanye} className="rounded-full h-[8vh] mt-[0.5vh] ml-[0.5vw]"></img>
                                <div className=" flex flex-col w-full text-start justify-start">
                                    <p className="text-[2.5vh] mt-[1.5vh] ml-[1vw] w-[30vw] font-roboto font-[390]  text-maroon">{`${person.first_name} ${person.last_name}`}</p>
                                    <div className="flex flex-row">
                                        <p className="ml-[1vw] text-[2vh] font-[200] text-black">{person.contact_phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-end">
                                <button 
                                    className="mr-[0.5vw]"
                                    onClick={() => displayProfile(person)}>
                                    <svg version="1.1"
                                        id="svg2" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" sodipodi:docname="eye-open.svg" inkscape:version="0.48.4 r9939"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="2.5vw" height="2.5vw"
                                        viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200" xml:space="preserve">
                                    <sodipodi:namedview  inkscape:cy="417.05123" inkscape:cx="455.50398" inkscape:zoom="0.37249375" showgrid="false" id="namedview30" guidetolerance="10" gridtolerance="10" objecttolerance="10" borderopacity="1" bordercolor="#666666" pagecolor="#ffffff" inkscape:current-layer="svg2" inkscape:window-maximized="1" inkscape:window-y="24" inkscape:window-height="876" inkscape:window-width="1535" inkscape:pageshadow="2" inkscape:pageopacity="0" inkscape:window-x="65">
                                        </sodipodi:namedview>
                                    <path id="path6686" inkscape:connector-curvature="0" d="M779.843,599.925c0,95.331-80.664,172.612-180.169,172.612
                                        c-99.504,0-180.168-77.281-180.168-172.612c0-95.332,80.664-172.612,180.168-172.612
                                        C699.179,427.312,779.843,504.594,779.843,599.925z M600,240.521c-103.025,0.457-209.814,25.538-310.904,73.557
                                        c-75.058,37.122-148.206,89.496-211.702,154.141C46.208,501.218,6.431,549,0,599.981c0.76,44.161,48.13,98.669,77.394,131.763
                                        c59.543,62.106,130.786,113.018,211.702,154.179c94.271,45.751,198.616,72.092,310.904,73.557
                                        c103.123-0.464,209.888-25.834,310.866-73.557c75.058-37.122,148.243-89.534,211.74-154.179
                                        c31.185-32.999,70.962-80.782,77.394-131.763c-0.76-44.161-48.13-98.671-77.394-131.764
                                        c-59.543-62.106-130.824-112.979-211.74-154.141C816.644,268.36,712.042,242.2,600,240.521z M599.924,329.769
                                        c156.119,0,282.675,120.994,282.675,270.251c0,149.256-126.556,270.25-282.675,270.25S317.249,749.275,317.249,600.02
                                        C317.249,450.763,443.805,329.769,599.924,329.769L599.924,329.769z"/>
                                    </svg>
                                </button>
                                <button 
                                className={`h-[4vh] w-[2.5vw] mr-[0.5vw] bg-${activeButton === 'Roommates' ? 'maroon' : 'maroon'} rounded-[0.5vh]`}
                                  onClick={() => unmatch(person.user_id)}>
                                    <svg 
                                    fill="white" 
                                    width="3vw" 
                                    height="3vh" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{marginLeft: "-0.2vw"}}
                                    ><path d="M1,20a1,1,0,0,0,1,1h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5Zm12.707,9.707L20.414,17l2.293,2.293a1,1,0,1,1-1.414,1.414L19,18.414l-2.293,2.293a1,1,0,0,1-1.414-1.414L17.586,17l-2.293-2.293a1,1,0,0,1,1.414-1.414L19,15.586l2.293-2.293a1,1,0,0,1,1.414,1.414Z"/></svg>
                                </button>
                            </div>
                            </div>
                        </div>
                        <div className="w-full h-[0.125vh] bg-black mt-[0.5vh]"></div>
                    </div>
            ))}
                </div>
            </div>
        </div>
    );
}
