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

    const majorList = [
      'Accounting',
      'Aerospace Engineering',
      'Anthropology',
      'Architecture',
      'Biochemistry',
      'Biology',
      'Biomedical Engineering',
      'Business Administration',
      'Chemical Engineering',
      'Chemistry',
      'Civil Engineering',
      'Communications',
      'Computer Engineering',
      'Computer Science',
      'Economics',
      'Education',
      'Electrical Engineering',
      'English',
      'Environmental Science',
      'Finance',
      'Geography',
      'Graphic Design',
      'Health Sciences',
      'History',
      'Industrial Engineering',
      'Information Technology',
      'International Business',
      'Journalism',
      'Law',
      'Marketing',
      'Mathematics',
      'Mechanical Engineering',
      'Nursing',
      'Philosophy',
      'Physics',
      'Political Science',
      'Psychology',
      'Public Health',
      'Sociology',
      'Statistics'
  ];
  
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

                console.log("NAME BIO REQUESTED");

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
            const cb = () =>
              backend.post('/profile/set-gendata', {
                user_id: user_id,
                data: {
                  bio: bio,
                  major: major
                }
              });

            broadcaster.connect(cb);
            return () => broadcaster.disconnect(cb);
        }
    }, [broadcaster, bio, major]);

    const resizeFont = () => {
        if (nameRef.current) {
            const parentHeight = nameRef.current.parentElement.clientHeight;
            const fontSize = parentHeight * 0.115;
            nameRef.current.style.fontSize = `${fontSize}px`;
        }
        if (majorRef.current) {
            const parentHeight = majorRef.current.parentElement.clientHeight;
            const fontSize = parentHeight * 0.09; 
            majorRef.current.style.fontSize = `${fontSize}px`;
        }
        if (bioRef.current) {
            const parentHeight = bioRef.current.parentElement.clientHeight;
            const fontSize = parentHeight * 0.1;
            bioRef.current.style.fontSize = `${fontSize}px`; // Fixed typo here
        }
    };

    useEffect(() => {
        const observer = new ResizeObserver(resizeFont);
        if (nameRef.current && majorRef.current && bioRef.current) {
            observer.observe(nameRef.current.parentElement);
            observer.observe(majorRef.current.parentElement);
            observer.observe(bioRef.current.parentElement); 
        }

        resizeFont();

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.name}`} ref={nameRef}>
                {name}
            </div>
            <div className="mt-[-1vh] text-[2vh] font-[450]">
                {broadcaster ? 
                    <select
                        id="selectionBox"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="border-2 rounded-lg mt-[1vh]"
                    >
                        {majorList.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select> 
                    : major
                }
                <div className={`${styles.major} mt-[-1.3%]`} ref={majorRef}>
                    {major}
                </div>
            </div>
            <div className="w-full h-[12vh] rounded-lg mt-1.5 border border-maroon flex">
                <p className="flex-1 text-[1.8vh] text-left font-normal">
                    {broadcaster ? 
                        <textarea
                            className="w-full h-full p-2 border-none rounded-lg resize-none"
                            value={bio}
                            maxLength="200"
                            onChange={(e) => setBio(e.target.value)}
                        /> 
                        : bio
                    }
                </p>
                <div className={`${styles.bio} p-0 z-0 w-auto`} style={{ aspectRatio: '1 / 0.25' }}>
                    <div className={styles.bioText} ref={bioRef}>
                        {bio}
                    </div>
                </div>
            </div>
        </div>
    );
}
