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

    useEffect(() => {
        // If inbox is clicked and there are unseen matches, set unseenMatches to 0
        if (inboxClicked) {
            setUnseenMatches(0);
        }
    }, [inboxClicked, unseenMatches]);

    return (
        <div style={{ position: 'relative', /*minHeight: '20px', minWidth: '20px' */ }}>
            {!inboxClicked && unseenMatches > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-32.3vh', // Adjust position for better visibility
                        right: '4.4vw',
                        backgroundColor: 'gold', // Use a more visible color
                        borderRadius: '2vh',
                        width: '2vw', // Increase size for better visibility
                        height: '3.25vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontSize: '1.85vh',
                        opacity: 0.75,
                        //fontWeight: 'bold',
                    }}
                >
                    {unseenMatches}
                </div>
            )}
        </div>
    );
};

export default InboxNotification;

