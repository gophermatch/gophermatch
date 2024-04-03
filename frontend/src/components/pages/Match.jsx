import { useRef, useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
import Filter from '../ui-components/Filter';
import styles from '../../assets/css/match.module.css'
import TemplateProfile from '../../TemplateProfile.json'
import TemplateProfile2 from '../../TemplateProfile2.json'
import backend from '../../backend';
import currentUser from '../../currentUser';


const tempIdGrabber = (() => {
    const tempIds = [48, 47, 56, 57];
    let pointer = 0;
    return function() {
        return new Promise((resolve) => {
            const selected = [];
            for (let i = 0; i < 10; i++) {
                selected.push(tempIds[pointer]);
                pointer = (pointer + 1) % tempIds.length;
            }
            resolve({data: selected});
        });
    }
})();

const deepClone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

export default function Match() {
    const [nextProfiles, setNextProfiles] = useState([]);
    const [requestLock, setRequestLock] = useState(false);

    if (nextProfiles.length < 5 && !requestLock) {
        setRequestLock(true);
        tempIdGrabber().then((res) => {
            const newData = res.data.map(async (id) => {
                const response = await backend.get('account/fetch', {
                    params: {user_id: id},
                    withCredentials: true
                });
                return {user_id: id, data: response.data};
            });
            Promise.all(newData).then((data) => {
                setNextProfiles(s => [...s, ...data]);
                setRequestLock(false);
            })
        }).catch(() => console.error("WAAAH"));
    }
    //     setRequestLock(true);
    //     tempIdGrabber().then((res) => {
    //         Promise.all(res.data.map((id) => (
    //             backend.get('/profile', {params: {user_id: id}})
    //         ))).then((profileDatas) => {
    //             setNextProfiles(s => [...s, ...profileDatas]);
    //             setRequestLock(false);
    //             console.log("Got profiles");
    //         }).catch(() => console.error("WAAAH"));
    //     })
    // }



    function goToNext(decision) {
        console.log("Going to next");
        console.log(nextProfiles[0].user_id)
        backend.post('/match/matcher', {
            user1Id: currentUser.user_id,
            user2Id: nextProfiles[0].user_id,
            decision: decision
        }).then(() => console.log("Success matching"));
        setNextProfiles(s => s.slice(1));
        console.log(nextProfiles);
    }

    if (nextProfiles.length == 0) {
        return <p>Loading profiles</p>
    }

    return (
      <div>
          <Filter />
          <Profile user_data={nextProfiles[0].data.data} data={nextProfiles[0].data} editable={false} />
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
