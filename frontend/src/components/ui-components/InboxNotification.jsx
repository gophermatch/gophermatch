import React, { useState, useEffect } from 'react';
import backend from '../../backend';
import currentUser from '../../currentUser';

const InboxNotification = ({ inboxClicked }) => {
    const [unseenMatches, setUnseenMatches] = useState(0);

    useEffect(() => {
        const fetchUnseenMatches = async () => {
            try {
                const response = await backend.get(`/match/inbox-notif`, {
                    params: {
                        userId: currentUser.user_id,
                    },
                });
                setUnseenMatches(response.data);
            } catch (error) {
                console.error('Failed to retrieve matches:', error);
            }
        };

        fetchUnseenMatches();



        const intervalId = setInterval(fetchUnseenMatches, 5000);
    
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            {!inboxClicked && unseenMatches > 0 && (
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