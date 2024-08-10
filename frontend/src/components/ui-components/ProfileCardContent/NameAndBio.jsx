import { useEffect, useState, useRef } from "react";
import backend from "../../../backend";
import styles from '../../../assets/css/name.module.css';

export default function NameAndBio({ user_id, broadcaster }) {
    const [bio, setBio] = useState('');
    const [major, setMajor] = useState('');
    const [name, setFullName] = useState('');
    
    const nameRef = useRef(null);
    const majorRef = useRef(null);
    const bioRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await backend.get('/profile/get-gendata', {
                    params: {
                        user_id: user_id,
                        filter: ['first_name', 'last_name', 'major', 'bio']
                    }
                });

                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
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
            const cb = () => {
                return new Promise((resolve) => {
                    console.log("Saving data");
                    resolve();
                });
            };

            broadcaster.connect(cb);
            return () => broadcaster.disconnect(cb);
        }
    }, [broadcaster]);

    const resizeFont = () => {
        if (nameRef.current) {
            const parentHeight = nameRef.current.parentElement.clientHeight;
            const fontSize = Math.max(12, parentHeight * 0.115); // Minimum font size for readability
            nameRef.current.style.fontSize = `${fontSize}px`;
        }
        if (majorRef.current) {
            const parentHeight = majorRef.current.parentElement.clientHeight;
            const fontSize = Math.max(10, parentHeight * 0.09); // Minimum font size for readability
            majorRef.current.style.fontSize = `${fontSize}px`;
        }
        if (bioRef.current) {
            const parentHeight = bioRef.current.parentElement.clientHeight;
            const fontSize = Math.max(10, parentHeight * 0.1); // Minimum font size for readability
            bioRef.current.style.fontSize = `${fontSize}px`;
        }
    };

    useEffect(() => {
        const observer = new ResizeObserver(resizeFont);

        if (nameRef.current && majorRef.current && bioRef.current) {
            observer.observe(nameRef.current.parentElement);
            observer.observe(majorRef.current.parentElement);
            observer.observe(bioRef.current.parentElement);
        }

        resizeFont(); // Initial resize

        window.addEventListener('resize', resizeFont); // Re-calculate on window resize

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', resizeFont);
        };
    }, []);

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.name}`} ref={nameRef}>
                {name}
            </div>
            <div className={`${styles.major} mt-[-1.3%]`} ref={majorRef}>
                {major}
            </div>
            <div className={`${styles.bio} p-0 z-0 w-auto`} style={{ aspectRatio: '1 / 0.25' }}>
                <div className={styles.bioText} ref={bioRef}>
                    {bio}
                </div>
            </div>
        </div>
    );
}
