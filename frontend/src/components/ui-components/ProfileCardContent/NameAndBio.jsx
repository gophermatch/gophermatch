import { useEffect, useState } from "react";
import backend from "../../../backend";
/*
name: string
major: string
bio: string
setBio?: React.Dispatch<React.SetStateAction<string>>
*/

export default function NameAndBio({ name, major, bio, setBio, userID }) {
    const [userInfo, setUserInfo] = useState([]);
    const [editValues, setEditValues] = useState({});
    const [firstName, setFirstName] = useState('');

    const fetchUserInfo = async () => {
        try {
            const response = await backend.get('/account/fetch', {
                params: { user_id: userID }
            });
            if (response.status === 200) {
                const data = response.data.data;
                const filteredData = Object.entries(data).filter(([key, value]) => key !== 'user_id' && key !== 'hear_about_us' && key !== 'date_of_birth');
                setUserInfo(filteredData);
                setEditValues(Object.fromEntries(filteredData.map(([key, value]) => [key, value])));
                setFirstName(data.first_name); // Assuming the response has 'first_name'
                console.log("data", data)
                console.log("first_name", data.first_name);
                console.log("firstName", firstName)
                return data;
            } else {
                console.log('Error fetching user data', error);
            }
        } catch (error) {
            console.log('Error fetching user data', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [userID]);

    return (
        <div>
            <div>
                First name: {firstName}
            </div>
        </div>
    );
}