import { useEffect, useState } from "react";
import backend from "../../../backend";
import styles from '../../../assets/css/name.module.css';

export default function NameAndBio({ name, major, bio, broadcaster }) {
    const [userInfo, setUserInfo] = useState([]);
    const [editValues, setEditValues] = useState({});
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        if (broadcaster) {
            const cb = () => {
                return new Promise(() => {
                    console.log("Saving data")
                })
            }
    
            broadcaster.connect(cb)
            return () => broadcaster.disconnect(cb)
        }
    }, [])

    // const fetchUserInfo = async () => {
    //     try {
    //         const response = await backend.get('/account/fetch', {
    //             params: { user_id: userID }
    //         });
    //         if (response.status === 200) {
    //             const data = response.data.data;
    //             const filteredData = Object.entries(data).filter(([key, value]) => key !== 'user_id' && key !== 'hear_about_us' && key !== 'date_of_birth');
    //             setUserInfo(filteredData);
    //             setEditValues(Object.fromEntries(filteredData.map(([key, value]) => [key, value])));
    //             setFirstName(data.first_name); // Assuming the response has 'first_name'
    //             console.log("data", data);
    //             console.log("first_name", data.first_name);
    //             console.log("firstName", firstName);
    //             return data;
    //         } else {
    //             console.log('Error fetching user data', error);
    //         }
    //     } catch (error) {
    //         console.log('Error fetching user data', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchUserInfo();
    // }, [userID]);

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {name}
            </div>
            <div className={styles.major}>
                {major}
            </div>
            <div className={styles.bio}>
                <div className={styles.bioText}>
                    {bio}
                </div>
            </div>
        </div>
    );
}
