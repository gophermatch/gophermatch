import React from 'react'
import backend from '../../backend'
import Carousel from './Carousel'
import styles from '../../assets/css/profile.module.css'
import kanye from '../../assets/images/kanye.png'
import other from '../../assets/images/testprofile.png'

export default function Profile(props) {
    const [profileData, setProfileData] = React.useState(null)
    let pictures = [kanye, other, kanye];

    React.useEffect(() => {
        // backend.get(`profile_${props.userId}`).then((res) => {
        //     setProfileData(res) // probably need some checks?
        // })
        setProfileData({value: "idk"}) // delete this line
    }, [])

    if (!profileData) {
        return <p>Profile Loading</p>
    }

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
                </div>
            </div>
            <div className={styles.rightSide}>
                <div className={styles.bioContainer}>
                    <p className={styles.name}>
                        Kanye East
                    </p>
                    <p className={styles.bioText}>
                        Hi, this is my bio. I'm just a lyrical
                        genuis looking for some  guys who
                        can match my flow putting out beats in
                        the dorms. My favorite show is stranger
                        things, and I like to just chill on a friday
                        night with a boba tea and some pop tarts.
                        Really living the life out here. You should
                        match me if you're another cool gemini with
                        a fire pair of Yeezys and a touch of swag.
                        This year is gonna be lit, Ye out.
                    </p>
                </div>
            </div>
        </div>
    )
}