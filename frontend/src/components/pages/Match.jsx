import { useRef, useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
import Filter from '../ui-components/Filter';
import styles from '../../assets/css/match.module.css'
import TemplateProfile from '../../TemplateProfile.json'
import TemplateProfile2 from '../../TemplateProfile2.json'
import backend from '../../backend';
import currentUser from '../../currentUser';


const tempIdGrabber = () => {
    return new Promise((resolve) => {
        const tempIds = [48, 47, 56, 57];
        resolve({data: tempIds});
    })
};

const deepClone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

export default function Match() {
    const [filterResults, setFilterResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextProfiles, setNextProfiles] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
        setNextProfiles([]);
    }, [filterResults]);

    function loadNextProfiles() {
        if (isRequesting || currentIndex >= filterResults.length) {
            // console.log("Not loading more profiles");
            return;
        }
        // console.log("Loading more profiles")

        const LOAD_COUNT = 3;
        setIsRequesting(true);

        // console.log("Index: " + currentIndex + " To: " + (currentIndex + LOAD_COUNT));
        const nextIds = filterResults.slice(currentIndex, currentIndex + LOAD_COUNT);
        setCurrentIndex(i => i + LOAD_COUNT);
        // console.log("Next ids are: ", nextIds);

        Promise.all(nextIds.map(id => backend.get('account/fetch', {params: {user_id: id}})))
            .then((responses) => {
                const profiles = responses.map((response, i) => ({
                    user_id: nextIds[i],
                    data: response.data
                }));
                // console.log("More profiles recieved for: ", nextIds)
                setNextProfiles(s => [...s, ...profiles]);
                setIsRequesting(false);
            });
    }




    // const [filteredIds, setFilteredIds] = useState([]);
    // const [filterIndex, setFilterIndex] = useState(0);
    // const [nextProfiles, setNextProfiles] = useState([]);
    // const [requestLock, setRequestLock] = useState(false);

    // useEffect(() => {
    //     console.log("Got new filter results: ", filteredIds)
    //     setFilterIndex(0);
    //     setNextProfiles([]);
    //     storeNextProfiles();
    // }, [filteredIds]);

    // console.log(filterIndex);

    // if (nextProfiles.length <= 2 && !requestLock) {
    //     storeNextProfiles();
    // }

    // function storeNextProfiles() {
    //     if (filteredIds.length === 0 || filterIndex >= filteredIds.length) {console.log("Nope"); return}
    //     const LOAD_COUNT = 3;
    //     setRequestLock(true);

    //     console.log("Index: " + filterIndex + " To: " + (filterIndex + LOAD_COUNT))
    //     const nextIds = filteredIds.slice(filterIndex, filterIndex + LOAD_COUNT);
    //     console.log("Next ids are: ", nextIds)

    //     Promise.all(nextIds.map(id => backend.get('account/fetch', {params: {user_id: id}})))
    //         .then((responses) => {
    //             setFilterIndex(i => i + LOAD_COUNT);
    //             const profiles = responses.map((response, i) => ({
    //                 user_id: nextIds[i],
    //                 data: response.data
    //             }));
    //             // console.log(profiles)
    //             setNextProfiles(s => [...s, ...profiles]);
    //             setRequestLock(false);
    //         })
    // }

    // if (nextProfiles.length === 0) {
    //     return (
    //         <div>
    //             <Filter setFilterResults={setFilteredIds} />
    //             <p>No profiles! Please change your filters.</p>
    //         </div>
    //     )
    // }

    function goToNext(decision) {
        backend.post('/match/matcher', {
            user1Id: currentUser.user_id,
            user2Id: nextProfiles[0].user_id,
            decision: decision
        });
        setNextProfiles(s => s.slice(1));
    }

    // console.log(nextProfiles.length, " remaining loaded profiles")

    if (nextProfiles.length <= 3) {
        loadNextProfiles();
    }

    if (nextProfiles.length === 0) {
        return (
            <div>
                <Filter setFilterResults={setFilterResults} />
                <p>Out of results, please change your filters!</p>
            </div>
        )
    }

    return (
      <div>
          <Filter setFilterResults={setFilterResults} />
          <Profile user_data={nextProfiles[0].data.data} editable={false} />
          {/* <Profile user_data={currentUser.user_data} data={nextProfiles[0].data} editable={false} /> */}
          <div className="absolute bottom-[3vh] justify-around left-1/2 transform -translate-x-1/2 space-x-5">
              <button onClick={() => goToNext("reject")}
                      className="w-[8vh] h-[8vh] bg-maroon_new rounded-full text-center align-middle text-white font-bold hover:bg-red-600 shadow-md">
                  <p className={"text-gold"}>X</p>
              </button>
              <button onClick={() => goToNext("unsure")}
                       className="w-[8vh] h-[8vh] bg-offwhite border-black border-[1px] rounded-full text-center align-middle text-white font-bold hover:bg-slate-300 shadow-md">💾</button>
              <button onClick={() => goToNext("match")}
                      className="w-[8vh] h-[8vh] bg-gold rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md">
                  <p className={"text-maroon_new"}>&#10003;</p>
              </button>
          </div>
      </div>
    );
}
