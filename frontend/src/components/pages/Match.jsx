import { useRef, useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
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

    // const ref = useRef(null)

    // const handleYesButtonClick = () => {
    //     console.log('Yes button clicked');
    //     document.querySelector(`.${styles.ImageDiv}`).style.transform = 'translateX(1000%) translateY(-100%) rotate(-180deg)';
    //     newCard();
    // };

    // const handleNoButtonClick = () => {
    //     console.log('No button clicked');
    //     document.querySelector(`.${styles.ImageDiv}`).style.transform = 'translateX(-1000%) translateY(-100%) rotate(180deg)';
    //     newCard();
    // };

    // function delay(ms) {
    //     return new Promise(resolve => {
    //         setTimeout(resolve, ms);
    //     });
    // }

    // async function newCard() {
    //     console.log("ref")
    //     console.log(ref)

    //     document.querySelector(`.${styles.ProfileDiv}`).style.transform = 'scaleY(0)';
        
    //     document.querySelector(`.${styles.LookingForTraits}`).style.transform = 'scale(0) translateY(-1000%)';
    //     document.querySelector(`.${styles.PositiveTraits}`).style.transform = 'scale(0) translateY(-1000%)';
    //     document.querySelector(`.${styles.BioParagraph}`).style.transform = 'scale(0) translateY(-1000%)';
    //     document.querySelector(`.${styles.NameLabel}`).style.transform = 'scale(0) translateY(-1000%)';

    //     //TODO: update profile to new one right here

    //     await delay(500)

    //     document.querySelector(`.${styles.ImageDiv}`).style.transform = 'translateX(0%) translateY(-200%) rotate(0deg)';

    //     await delay(500);
        
    //     document.querySelector(`.${styles.ProfileDiv}`).style.transform = 'scaleY(1)';

    //     document.querySelector(`.${styles.LookingForTraits}`).style.transform = 'scale(1) translateY(0%)';
    //     document.querySelector(`.${styles.PositiveTraits}`).style.transform = 'scale(1) translateY(0%)';
    //     document.querySelector(`.${styles.BioParagraph}`).style.transform = 'scale(1) translateY(0%)';
    //     document.querySelector(`.${styles.NameLabel}`).style.transform = 'scale(1) translateY(0%)';

    //     document.querySelector(`.${styles.ImageDiv}`).style.transform = 'translateX(0%) translateY(0%) rotate(0deg)';

    // }

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
            <Profile data={profileDataQueue[0]} editable={false} />
            {/* Replace this button where you want it in your UI */}
            <button onClick={goToNext}>Next Profile</button>
        </div>
    );
    
}

/*
        <div id={styles.MatchPage}>
            <link href='https://fonts.googleapis.com/css?family=Comfortaa' rel='stylesheet'></link>
            <div ref={ref} className={styles.MatchDiv}>
                <div className={styles.ProfileDiv}>
                    <div className={styles.TopHalf}>
                        <div className={styles.ImageDiv}>
                            <img src="../../assets/images/testprofile.png" className={styles.ProfileImage}></img>
                            <div className={styles.ProfileBanner}></div>
                        </div>
                        <div className={styles.BioWrapper}>
                            <b className={styles.NameLabel}>Test Person</b>
                            <p className={styles.BioParagraph}>Hello! I'm Test Person, Class of 2027. This is my bio, I'm super cool. Be my roommate. aaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                    </div>
                    <div className={styles.BottomHalf}>
                        <ul className={styles.PositiveTraits}>
                            <b>About me</b>
                            <li>Midnight bed time</li>
                            <li>Computer science major</li>
                            <li>Okay with sharing stuff</li>
                        </ul>
                        <ul className={styles.LookingForTraits}>
                            <b>My preferences</b>
                            <li>No smoking</li>
                            <li>Wants to be friends</li>
                            <li>Likes to workout</li>
                        </ul>
                    </div>
                </div>
                <br></br>
                <div className={styles.ButtonWrapper}>
                    <button className={styles.MatchButton} id={styles.YesButton}><img className={styles.ButtonIcon} src="../../assets/images/check.png" onClick={handleYesButtonClick}></img></button>
                    <button className={styles.MatchButton} id={styles.NoButton}><img className={styles.ButtonIcon} src="../../assets/images/x.png" onClick={handleNoButtonClick}></img></button>
                </div>
                
            </div>
        </div>
        */