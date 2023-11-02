import currentUser from '../../currentUser.js'
import styles from '../../assets/css/profile.module.css'

export default function Profile() {
    return (
        <div className={styles.test}>
            {currentUser.logged_in ? currentUser.email+"'s" : ""} profile stuff here
        </div>
    )
}
