import { useRef, useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
import Filter from '../ui-components/Filter';
import styles from '../../assets/css/match.module.css'
import TemplateProfile from '../../TemplateProfile.json'
import TemplateProfile2 from '../../TemplateProfile2.json'
import backend from '../../backend';
import currentUser from '../../currentUser';


const tempIdGrabber = (() => {
    const tempIds = [42,43,44,45,46,47,48,54,56,57,58,59,60,61,62,63];
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
                const data = await backend.get('profile', {params: {user_id: id}});
                return {user_id: id, data: data};
            });
            setNextProfiles(s => [...s, ...newData]);
            setRequestLock(false);
        }).catch(() => console.error("WAAAH"));

        // setRequestLock(true);
        // tempIdGrabber().then((res) => {
        //     Promise.all(res.data.map((id) => (
        //         backend.get('/profile', {params: {user_id: id}})
        //     ))).then((profileDatas) => {
        //         setNextProfiles(s => [...s, ...profileDatas]);
        //         setRequestLock(false);
        //         console.log("Got profiles");
        //     }).catch(() => console.error("WAAAH"));
        // })
    }

    function goToNext(decision) {
        console.log("Going to next");
        backend.post('/match/matcher', {
            user1Id: currentUser.user_id,
            user2Id: nextProfiles[0].user_id,
            decision: decision
        });
        setNextProfiles(s => s.slice(1));
        console.log(nextProfiles);
    }

    if (nextProfiles.length == 0) {
        return <p>Loading profiles</p>
    }

    return (
        <div>
            <Filter/>
            <Profile user_data={currentUser.user_data} data={nextProfiles[0].data} editable={false} />
            <div className="flex justify-around">
                <button onClick={() => goToNext("reject")} className="w-[40px] h-[40px] bg-red-500 rounded-full text-center align-middle text-white font-bold hover:bg-red-600 shadow-md">X</button>
                <buttonm onClick={() => goToNext("save")} className="w-[40px] h-[40px] bg-slate-200 rounded-full text-center align-middle text-white font-bold hover:bg-slate-300 shadow-md"></buttonm>
                <button onClick={() => goToNext("match")} className="w-[40px] h-[40px] bg-green-500 rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md">&#10003;</button>
            </div>
        </div>
    );
}
