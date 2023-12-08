import React, { useEffect, useState } from 'react';
import Carousel from './Carousel';
import styles from '../../assets/css/profile.module.css';
import templateProfile from '../../TemplateProfile.json';
import ProfileSplitter from '../../ProfileSplitter'
import kanye from '../../assets/images/kanye.png';
import other from '../../assets/images/testprofile.png';

export default function Profile({ user_Id, editable, bio, onBioChange, onSaveBio }) {
    const [profileData, setProfileData] = useState(null);

    let pictures = [kanye, other, kanye];

    useEffect(() => {
        // Fetch profile data logic...
        setProfileData(templateProfile); // Temporary
    }, []);

    if (!profileData) {
        return <p>Profile Loading</p>;
    }

    const splitter = new ProfileSplitter(profileData);

    return (
        <div className={styles.profile}>
            <div className={styles.leftSide}>
                <div className={styles.imageWrapper}>
                    <Carousel pictures={pictures} />
                </div>
                <div className={styles.profileOptions}>
                    <p className={styles.profileItem}>Night Owl</p>
                    <p className={styles.profileItem}>May partake in zaza</p>
                    <p className={styles.profileItem}>Likes to get lit!!</p>
                    <p className={styles.profileItem}>Divorced :(</p>
                    <p className={styles.profileItem}>If swifite swipe left</p>
                    <p className={styles.profileItem}>Avid Christian</p>
                </div>
            </div>
            <div className={styles.rightSide}>
                {editable ? (
                    <div className={styles.bioContainer}>
                        <textarea 
                            className={styles.editableBio} // Apply existing and new styles
                            value={bio} 
                            onChange={onBioChange} 
                            placeholder="Enter your bio" 
                        />
                        <button onClick={onSaveBio}>Save Bio</button>
                    </div>
                ) : (
                    <div className={styles.bioContainer}>
                        <p className={styles.name}>
                            {splitter.general.name}
                        </p>
                        <p className={styles.bioText}>
                            {splitter.general.bio}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
