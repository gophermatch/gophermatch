import Carousel from './Carousel'
import styles from '../../assets/css/profile.module.css'
import kanye from '../../assets/images/kanye.png'

export default function Profile() {

    let pictures = [kanye, kanye];


    return (
        <div className={styles.profile}>
            <div className={styles.leftSide}>
                <div className={styles.imageWrapper}>
                    <Carousel pictures={pictures} />
                </div>
                <div className={styles.profileOptions}>
                    Profile info here
                </div>
            </div>
            <div className={styles.rightSide}>
                <div className={styles.bioContainer}>
                    <p className={styles.name}>
                        Input name here
                    </p>
                    <p className={styles.bioText}>
                        This is my bio, and there will be a lot more to come from me
                    </p>
                </div>
            </div>
        </div>
    )
}