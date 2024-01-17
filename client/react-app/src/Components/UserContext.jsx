// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: "Loading...",
        profilePictureUrl: "",
        userId: null
    });

    const setProfilePicture = (newUrl) => {
        setUser(current => ({ ...current, profilePictureUrl: newUrl }));
    };

    const jwtAccess = localStorage.getItem('jwtAccess');

    useEffect(() => {
        // Fetch user data
        fetch(`${import.meta.env.VITE_BASE_URL}auth/users/me/`, {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            
            setUser(prev => ({
                ...prev,
                username: data.username,
                userId: data.id
            }));

            return fetch(`${import.meta.env.VITE_BASE_URL}accounts/profile/${data.username}/` , {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
            });
        })
        .then(response => response.json())
        .then(profileInfo => {
            setUser(prev => ({
                ...prev,
                profilePictureUrl: profileInfo.profile_picture_url,
            }));
        })
        .catch(error => console.error('Error fetching user data:', error));
    }, [jwtAccess]);

    return (
        <UserContext.Provider value={{ ...user, setProfilePicture }}>
            {children}
        </UserContext.Provider>
    );
};
