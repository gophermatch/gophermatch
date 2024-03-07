import React, { useState } from 'react';

export default function Inbox() {
    const [user1Id, setUser1Id] = useState('');
    const [user2Id, setUser2Id] = useState('');
    const [decision, setDecision] = useState('');

    const handleButtonClick = async () => {
        try {
            const response = await fetch('/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user1Id, user2Id, decision }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result); // Handle success
        } catch (error) {
            console.error('Error:', error); // Handle error
        }
    };

    return (
        <div>
            <p>Inbox Stuff</p>
            <input
                type="text"
                placeholder="User 1 ID"
                value={user1Id}
                onChange={(e) => setUser1Id(e.target.value)}
            />
            <input
                type="text"
                placeholder="User 2 ID"
                value={user2Id}
                onChange={(e) => setUser2Id(e.target.value)}
            />
            <select value={decision} onChange={(e) => setDecision(e.target.value)}>
                <option value="">Select Decision</option>
                <option value="match">Match</option>
                <option value="reject">Reject</option>
                {/* Add more options as needed */}
            </select>
            <button onClick={handleButtonClick}>Test Match</button>
        </div>
    );
}
