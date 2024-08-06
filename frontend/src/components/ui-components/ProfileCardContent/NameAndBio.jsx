import { useEffect, useState } from "react";
import backend from "../../../backend";
import styles from '../../../assets/css/name.module.css';

//TODO: add edit state, is in edit if broadcaster is not null

export default function NameAndBio({ user_id, broadcaster }) {
    const [bio, setBio] = useState('');
    const [major, setMajor] = useState('');
    const [name, setFullName] = useState('');

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await backend.get('/profile/get-gendata', {
              params: {
                user_id: user_id,
                filter: [
                  'first_name', 'last_name', 'major', 'bio'
                ]
              }
            });

            console.log("NAME BIO REQUESTED")

            if (response.data && response.data.length > 0) {
              const user = response.data[0];
              console.log("User data:", user);
              if (user) {
                setFullName(`${user.first_name} ${user.last_name}`);
                setMajor(user.major);
                setBio(user.bio);
              }
            }
          } catch (error) {
            console.error('Error fetching user name, major, and bio:', error);
          }
        }

        fetchData();
      }, [user_id]);


    useEffect(() => {
        if (broadcaster) {
            //TODO: return promise from backend put request ex: `const cb = () => backend.put('/something')`
            const cb = () => {
                return new Promise(() => {
                    console.log("Saving data")
                    resolve()
                })
            }

            broadcaster.connect(cb)
            return () => broadcaster.disconnect(cb)
        }
    }, [broadcaster])

    // we should probably be using tailwind rather than css modules but doesn't really matter

    return (
        <div className={`${styles.container} ml-[0.25rem] sm:ml-[0rem] md:ml-[-0.25rem] lg:ml-[-]`}>
            <div className={styles.name}>
                {name}
            </div>
            <div className={styles.major}>
                {major}
            </div>
            <div className={`${styles.bio} p-0 z-0 sm:h-[3.5rem] sm:w-[20.7rem] md:h-[3.5rem] md:w-[24rem] lg:h-[4rem] lg:w-[30rem] xl:h-[7rem] sm:mt-[-0.1rem] xl:w-[40rem]`}>
                <div className={styles.bioText}>
                    {bio}
                </div>
            </div>
        </div>
    );
}
