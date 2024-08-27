import { useEffect, useState } from "react";
import backend from "../../../backend";
import styles from '../../../assets/css/name.module.css';
import male from '../../../assets/images/male-svgrepo-com.svg';
import woman from '../../../assets/images/woman-svgrepo-com.svg';
import nonbinary from '../../../assets/images/gender-nonbinary-fill-svgrepo-com.svg';

// TODO: add edit state, is in edit if broadcaster is not null

export default function NameAndBio({ user_id, broadcaster }) {
    const [bio, setBio] = useState('');
    const [major, setMajor] = useState('');
    const [name, setFullName] = useState('');
    const [year, setYear] = useState('');
    const [gender, setGender] = useState('');
    const [internationalStudent, setInternationalStudent] = useState('');
    const [hometown, setHometown] = useState('');

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
                            'first_name', 'last_name', 'major', 'bio', 'graduating_year', 'gender', 'hometown', 'international', 'date_of_birth'
                        ]
                    }
                });

                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    if (user) {
                        setFullName(`${user.first_name} ${user.last_name}`);
                        setMajor(user.major);
                        setBio(user.bio);
                        setHometown(user.hometown);
                        setGender(user.gender); // Set the gender

                        // Extract the last two digits of the graduating year
                        const yearString = user.graduating_year.toString();
                        const lastTwoDigits = yearString.slice(-2);
                        setYear(lastTwoDigits); // Set the formatted year

                        // Set international student status and log it for debugging
                        const intlStudent = user.international.toString(); // Ensure it's a string
                        setInternationalStudent(intlStudent);
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
                        major: major,
                        graduating_year: `20${year}`, // Format the year as needed
                        gender: gender, // Use the correct field name
                        hometown: hometown,
                    }
                });

            broadcaster.connect(cb);
            return () => broadcaster.disconnect(cb);
        }
    }, [broadcaster, bio, major, year, gender]); // Include `gender` in dependency array

    return (
        <div className={styles.container}>
            <div className="text-[3vh] font-bold flex items-center">
                {name} 
                {gender === 'male' ? (
                  <img src={male} alt="Male" className="ml-[1px]" />
              ) : gender === 'female' ? (
                  <img src={woman} alt="Female" className="ml-[1px]" />
              ) : gender === 'nonbinary' ? (
                  <img src={nonbinary} alt="Non-Binary" className="ml-[1px]" />
              ) : null}
            </div>
            <div className="mt-[-1vh] text-[2vh] font-[450]">
              {broadcaster ? 
                <select
                  id="selectionBox"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="border-2 rounded-lg mt-[1vh] hover:bg-maroon_transparent2 cursor cursor-pointer"
                >
                  {majorList.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select> 
              : major}
            </div>
            <div className="mt-[-0.9vh] text-[2vh] font-[450]">
                  {hometown}
                  {internationalStudent === '1' && (
                  <span className="ml-2 text-[2vh] font-normal">(International Student)</span>
              )}
            </div>
            <div className="w-full h-[12vh] rounded-lg mt-1 border border-maroon flex">
                <p className="flex-1 text-[1.8vh] text-left font-normal">
                    {broadcaster ?
                        <textarea
                            className="w-full h-full p-2 border-none rounded-lg resize-none"
                            value={bio}
                            maxLength="200"
                            onChange={(e) => setBio(e.target.value)}
                        />
                        : bio}
                </p>
            </div>
        </div>
    );
}