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
                setUnseenMatches(response.data.length);
            } catch (error) {
                console.error('Failed to retrieve matches:', error);
            }
        };

        fetchUnseenMatches();

        const intervalId = setInterval(fetchUnseenMatches, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ position: 'relative', minHeight: '20px', minWidth: '20px' }}> {/* Ensure minimum size for visibility */}
            {!inboxClicked && unseenMatches > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-1550%', // Adjust position for better visibility
                        right: '50px',
                        backgroundColor: 'gold', // Use a more visible color
                        borderRadius: '50%',
                        width: '30px', // Increase size for better visibility
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                    }}
                >
                    {/* Optionally, display the number of unseen matches */}
                    {unseenMatches}
                </div>
            )}
        </div>
    );
};

export default InboxNotification;