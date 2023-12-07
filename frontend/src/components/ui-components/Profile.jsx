import React from 'react'
import backend from '../../backend'
import ProfileSplitter from '../../ProfileSplitter'

import Carousel from './Carousel'
import styles from '../../assets/css/profile.module.css'

import templateProfile from '../../TemplateProfile.json'
import kanye from '../../assets/images/kanye.png'
import other from '../../assets/images/testprofile.png'


export default function Profile(props) {
    const [profileData, setProfileData] = React.useState(null)
    let pictures = [kanye, other, kanye];

    React.useEffect(() => {
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

        console.log("Rendering profile for user: " + props.userId)
        setProfileData(templateProfile) // delete this line
    }, [])

    if (!profileData) {
        return <p>Profile Loading</p>
    }

    const splitter = new ProfileSplitter(profileData);
    const preferences = splitter.mapPreferences((value, key) => {
        return <p key={key} enabled={props.enabled}>{key}: {value}</p> //todo use an actual component
    })

    return (
        <div className={styles.profile}>
            <div className={styles.leftSide}>
                <div className={styles.imageWrapper}>
                    <Carousel pictures={pictures} />
                </div>
                <div className={styles.profileOptions}>
                    {/* Make these colored based on preference compatibility eventually */}
                    <p className={styles.profileItem}>profile item one</p>
                    <p className={styles.profileItem}>profile item two</p>
                    <p className={styles.profileItem}>profile item three</p>
                    <p className={styles.profileItem}>profile item four</p>
                    <p className={styles.profileItem}>profile item five</p>
                    <p className={styles.profileItem}>profile item six</p>
                      {/*Put preferences array here*/}
                </div>
            </div>
            <div className={styles.rightSide}>
                <div className={styles.bioContainer}>
                    <p className={styles.name}>
                        {splitter.general.name + props.userId}
                    </p>
                    <p className={styles.bioText}>
                        {splitter.general.bio}
                    </p>
                    <button onClick={() => props.goNextProfile(true)}></button>
                </div>
            </div>
        </div>
    )
}
