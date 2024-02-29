import React, { useState, useEffect } from 'react';
import backend from '../../backend';

export default function Inbox() {
    // Function to handle the test match button click
    const handleTestMatchClick = async () => {
        // Example user1Id, user2Id, and decision values
        const user1Id = 56; // Assuming a test user ID
        const user2Id = 54; // Assuming another test user ID
        const decision = 'match'; // Test decision

        // Construct the request payload
        const payload = {
            user1Id,
            user2Id,
            decision,
        };

        // Make a POST request to the /match endpoint
        try {
            const response = await backend.get('/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            // Log or do something with the response
            console.log(data);
            alert(JSON.stringify(data)); // For testing purposes, show the result in an alert
        } catch (error) {
            console.error('Failed to process match decision:', error);
            alert('Failed to process match decision'); // Show error in an alert for testing
        }
    };

    return (
        <div>
            <p>Inbox Stuff</p>
            {/* Inbox Stuff Here */}
            <button onClick={handleTestMatchClick}>Test Match</button>
        </div>
    );
}
