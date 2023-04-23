import React, { useState, createContext, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// We can use this context to pass the user object to any component that needs it
export const UserContext = createContext({});

// This is the provider that will wrap the entire app, giving User Context access to necessary components
const UserProvider = ({ children }) => {
    const navigate = useNavigate();

    const getInitialState = () => ({
        _id: null,
        loggedIn: false,
        name: null,
        email: null,
        dateOfBirth: null,
        csrfToken: null,
        profile: {
            gender: null,
            location: {
                city: null,
                state: null,
                country: null,
            },
            bio: null,
            interests: [],
            preferences: {
                gender: [],
                ageRange: {
                    min: null,
                    max: null,
                },
                distance: null,
            },
            profilePictures: [],
        },
        // Temporary representation of the user's social media accounts
        facebookId: null,
        instagramId: null,
        matches: [],
    });

    const [user, setUser] = useState(getInitialState());
    
    const updateUser = (userInfo) => {
        setUser((prev) => ({ ...prev, ...userInfo }));
    };
    
    // Check if the user is logged in on page load (used when the user refreshes the page, or enters the site via a direct link)
    // TODO: Will this affect redirects e.g. when social provider redirects back to our site via callback?
    const checkLoggedIn = async () => {
        try {
            const res = await axios.get('/api/auth/checkLoggedIn');
            if (res.status === 200 && res.data.loggedIn) {
                setUser((prev) => ({ ...prev, ...res.data }));
                // Also apply the csrf token to axios headers
                axios.defaults.headers.common['X-CSRF-Token'] = res.data.csrfToken;
                return true;
            } 
            return false;
        } catch (err) {
            console.error(err);
            toast.error("Please login again.");  // err.response?.data?.errors?.message);
            // navigate('/login');
            return false;
        }
    };

    const logout = async (e) => {
        // Have to reset all keyvalue pairs in this temp object before assigning it to state
        // Otherwise, the state will be set to the initial state, but state will still have any new keys added
        const stateReset = Object.keys(user).reduce((acc, v) => ({ ...acc, [v]: undefined }), {});
        setUser({ ...stateReset, ...getInitialState() });
        await axios.post('/api/auth/logout');
        // Remove the loggedIn cookie, via setting the expiration date to the past
        document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/");
    };

    return (
        // The value prop is what will be available to any component that consumes this context
        <UserContext.Provider value={{ user, checkLoggedIn, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
