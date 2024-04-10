import { useRef, useState, useEffect, createRef, Component } from 'react';
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
    const [filteredIds, setFilteredIds] = useState([]);
    const [filterIndex, setFilterIndex] = useState(0);
    const [filters, setFilters] = useState(null);
    const [nextProfiles, setNextProfiles] = useState([]);
    const [requestLock, setRequestLock] = useState(false);
    const [dorm, setDorm] = useState(true);
    const [apartment, setApartment] = useState(false);
    const [both, setBoth] = useState(false);

    useEffect(() => {
        // console.log("Getting new ids")
        tempIdGrabber().then((res) => {
            setFilteredIds(res.data); //todo: use filters in backend query here
            setFilterIndex(0);
            setNextProfiles([]);
        })
    }, [filters]);

    useEffect(storeNextProfiles, [filteredIds]);

    function storeNextProfiles() {
        if (filteredIds.length === 0) return;
        // console.log("Getting next profiles")
        const LOAD_COUNT = 3;
        setRequestLock(true);

        // console.log("Filtered ids now are: ", filteredIds)
        // console.log("Index: " + filterIndex + " To: " + (filterIndex + LOAD_COUNT))
        const nextIds = filteredIds.slice(filterIndex, filterIndex + LOAD_COUNT);
        // console.log("Next ids are: ", nextIds)

        Promise.all(nextIds.map(id => backend.get('account/fetch', {params: {user_id: id}})))
            .then((responses) => {
                setFilterIndex(filterIndex + LOAD_COUNT);
                const profiles = responses.map((response, i) => ({
                    user_id: nextIds[i],
                    data: response.data
                }));
                // console.log(profiles)
                setNextProfiles(s => [...s, ...profiles]);
                setRequestLock(false);
            })
    }

    if (nextProfiles.length === 0) {
        return <p>No results left! Please change your filters.</p>
    }

    // if (nextProfiles.length < 5 && !requestLock) {
    //     setRequestLock(true);
    //     tempIdGrabber().then((res) => {
    //         const newData = res.data.map(async (id) => {
    //             const response = await backend.get('account/fetch', {
    //                 params: {user_id: id},
    //                 withCredentials: true
    //             });
    //             return {user_id: id, data: response.data};
    //         });
    //         Promise.all(newData).then((data) => {
    //             setNextProfiles(s => [...s, ...data]);
    //             setRequestLock(false);
    //         })
    //     }).catch(() => console.error("WAAAH"));
    // }

    function goToNext(decision) {
        // console.log("Going to next");
        // console.log("Current profiles are: ", nextProfiles)
        // console.log(nextProfiles[0].user_id)
        backend.post('/match/matcher', {
            user1Id: currentUser.user_id,
            user2Id: nextProfiles[0].user_id,
            decision: decision
        }).then(() => console.log("Success matching"));
        setNextProfiles(s => s.slice(1));
        if (nextProfiles.length <= 2 && !requestLock) {
            storeNextProfiles();
        }
    }

    function changeSearchType(decision){
        if(decision == "dorm"){
            setDorm(true);
            setBoth(false);
            setApartment(false);
        }else if(decision == "both"){
            setDorm(false);
            setBoth(true);
            setApartment(false);
        } else if(decision == "apartment"){
            setDorm(false);
            setBoth(false);
            setApartment(true);
        }
    }

    if (nextProfiles.length == 0) {
        return <p>Loading profiles</p>
    }

    return (
      <div>
          <Filter />
          <Profile user_data={nextProfiles[0].data.data} dormMode = {dorm} apartmentMode = {apartment || both} editable={false} />
          {/* <Profile user_data={currentUser.user_data} data={nextProfiles[0].data} editable={false} /> */}
          <div className="absolute bottom-[3vh] justify-around left-1/2 transform -translate-x-1/2 space-x-[1vw]">
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

          <div className="absolute bottom-[3vh] ml-[70vw] space-x-[1vw] text-[1vw]">
              <button onClick={() => changeSearchType("dorm")}
                      className="w-[8vh] h-[8vh] bg-maroon_new rounded-full text-center align-middle text-white font-bold hover:bg-red-600 shadow-md">
                  <p>Dorm</p>
              </button>
              <button onClick={() => changeSearchType("both")}
                       className="w-[8vh] h-[8vh] bg-offwhite border-black border-[1px] rounded-full text-center align-middle text-black font-bold hover:bg-slate-300 shadow-md">Both</button>
              <button onClick={() => changeSearchType("apartment")}
                      className="w-[8vh] h-[8vh] bg-gold rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md">
                  <p>Apt.</p>
              </button>
          </div>
      </div>
    );
}
