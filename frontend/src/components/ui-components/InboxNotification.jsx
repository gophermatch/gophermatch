import React, { useState, useEffect } from 'react';
import backend from '../../backend';
import currentUser from '../../currentUser';

const InboxNotification = ({ inboxClicked, setInboxClicked }) => {
    const [unseenMatches, setUnseenMatches] = useState(0);

    useEffect(() => {
        const fetchUnseenMatches = async () => {
            try {
                const response = await backend.get(`/match/inbox-notif`, {
                    params: {
                        userId: currentUser.user_id,
                    },
                });
                setUnseenMatches(response.data.length);
            } catch (error) {
                console.error('Failed to retrieve matches:', error);
            }
        };

        fetchUnseenMatches();

        const intervalId = setInterval(fetchUnseenMatches, 5000);
    
        return () => clearInterval(intervalId);
    }, []);

    const markMatchesAsSeen = async () => {
        try {
            await backend.post('/match/mark-seen', { userId: currentUser.user_id });
            setUnseenMatches(0);
            setInboxClicked(true); // Set inboxClicked to true
        } catch (error) {
            console.error('Failed to mark matches as seen:', error);
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '20px', minWidth: '20px' }}>
            {!inboxClicked && unseenMatches > 0 && (
                <div
                    onClick={markMatchesAsSeen}
                    style={{
                        position: 'absolute',
                        top: '-1700%', // Adjust position for better visibility
                        right: '105px',
                        backgroundColor: 'gold', // Use a more visible color
                        borderRadius: '50%',
                        width: '30px', // Increase size for better visibility
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                >
                    {unseenMatches}
                </div>
            )}
        </div>
    );
};

export default InboxNotification;
