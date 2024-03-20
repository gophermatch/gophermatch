import { useRef, useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
import Filter from '../ui-components/Filter';
import styles from '../../assets/css/match.module.css'
import TemplateProfile from '../../TemplateProfile.json'
import TemplateProfile2 from '../../TemplateProfile2.json'

import currentUser from '../../currentUser';

const deepClone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

export default function Match() {
    const [profileDataQueue, updateProfileDataQueue] = useState([]);

    function goToNext() {
        updateProfileDataQueue(q => {
            const copy = deepClone(q)
            copy.shift();
            return copy
        })
    }

    if (profileDataQueue.length == 0) {
                // get some ids from backend
                //todo swap out the routes and uncomment all this code once backend good
        // let generalPromise = backend.get(`profile_${props.user_Id}`);
        // let preferencePromise = backend.get(`preferences_${props.userId}`);
        // let final = {}
        // Promise.all([generalPromise, preferencePromise]).then(tables => {
        //     values.forEach(value => {
        //         final = {...final, ...value}
        //     })
        //     setProfileData(final);
        // })
        const fetchedDataList = [TemplateProfile, TemplateProfile2] // backend request
        updateProfileDataQueue(q => [...deepClone(q), ...fetchedDataList])
        return <p>Loading profiles</p>
    }

    return (
        <div>
            <Filter/>
            <Profile user_data={currentUser.user_data} data={profileDataQueue[0]} editable={false} />
            {/* Replace this button where you want it in your UI */}
            <button onClick={goToNext}>Next Profile</button>
        </div>
    );
    
}