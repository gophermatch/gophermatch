import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [update, setUpdate] = useState(0);

    const triggerUpdate = () => {
        setUpdate(prev => prev + 1); // increment to trigger effect
    };

    return (
        <NotificationContext.Provider value={{ triggerUpdate }}>
            {children}
        </NotificationContext.Provider>
    );
};
