import React, { useState, useEffect } from 'react';
import backend from '../../backend';
import currentUser from '../../currentUser';

const InboxNotification = () => {
    const [unseenMatches, setUnseenMatches] = useState(0);
    useEffect(() => {
        const fetchUnseenMatches = async () => {
            try {
                console.log('In block')
                const response = await backend.get(`/match/inbox-notif`, {
                    params: {
                        userId: currentUser.user_Id,
                    },
                });
                console.log('After response')
                setUnseenMatches(response.data);
            } catch (error) {
                console.error('Failed to retrieve matches:', error);
            }
        };
    
        // Fetch unseen matches initially
        fetchUnseenMatches();
    
        // Set up interval to fetch unseen matches every 5 seconds
        const intervalId = setInterval(fetchUnseenMatches, 5000);
    
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    });    

    return (
        <div style={{ position: 'relative' }}>
            {unseenMatches > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'gold',
                        borderRadius: '50%',
                        width: '10px',
                        height: '10px',
                    }}
                />
            )}
        </div>
    );
};

export default InboxNotification;
