import React, { useCallback, useState, createContext, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// We can use this context to pass the user object to any component that needs it
export const UserContext = createContext({});

// This is the provider that will wrap the entire app, giving User Context access to necessary components
const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const firstRender = useRef(true);

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
        IGPhotos: [],
        profileComplete: false,
    });

    const [user, setUser] = useState(getInitialState());
    
    const updateUser = (userInfo) => {
        setUser((prev) => ({ ...prev, ...userInfo }));
    };
    
/*     useEffect(() => {
        // console.log("UserProvider: user state updated: " + JSON.stringify(user));
        if (user?.loggedIn && checkProfileComplete()) {
            console.log("UserProvider: adding ProfileCOmplete to user");
            updateUser({ profileComplete: true });
        }
    }); */

    // Check if the user is logged in on page load (used when the user refreshes the page, or enters the site via a direct link)
    // TODO: Will this affect redirects e.g. when social provider redirects back to our site via callback?
    const checkLoggedIn = async (e) => {
        // e?.preventDefault();
        try {
            const res = await axios.get('/api/auth/checkLoggedIn');
            // console.log("UserProvider.checkLoggedIn got: " + JSON.stringify(res.data));
            if (res.status === 200 && res.data?.loggedIn) {
                // Update the user state with the user info returned from the server
                // Which will contain the user's profile and account info, as well as the csrf token
                // Apply the csrf token to axios headers
                axios.defaults.headers.common['X-CSRF-Token'] = res.data.csrfToken;
                // TODO: Specify what we need from the user object or remove this entirely
                const userData = {
                    _id: res?.data?._id,
                    loggedIn: res?.data?.loggedIn,
                    name: res?.data?.name,
                    email: res?.data?.email,
                    dateOfBirth: res?.data?.dateOfBirth,
                    profile: res?.data?.profile,
                    facebookId: res?.data?.facebookId,
                    instagramId: res?.data?.instagramId,
                    matches: res?.data?.matches,
                    profileComplete: res?.data?.profileComplete,
                    csrfToken: res?.data?.csrfToken,
                };
                return res.data;
            } else if (res.status === 401) {
                // If the user is not logged in, clear the user state
                toast.error("Please login to continue.")
                await logout();
            } else throw new Error(res);
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    // We need to prevent the user from reaching certain routes if they're logged in but haven't
    // completed their profile yet.
    // TODO: There's probably a better way to do this
/*     const checkProfileComplete = (data) => { //useCallback(() => {
        if (!user?.profile || !data?.profile) return false;

        const { profile } = data ?? user;
        if (!data) console.log("UserProvider.checkProfileComplete: data is null");
        // console.log("UserProvider.checkProfileComplete: profile: " + JSON.stringify(profile));
        // Check for mandated fields
        const fields = {
            gender: profile?.gender,
            state: profile?.location?.state,
            interests: profile?.interests?.length,
            genderPreferences: profile?.preferences?.gender?.length,
            ageRangeMin: profile?.preferences?.ageRange?.min,
            ageRangeMax: profile?.preferences?.ageRange?.max
        };

        let item = Object.entries(fields).find(([key, value]) => !!value === false);

        if (item) {
            console.log('UserProvider.checkProfileComplete: User profile not complete; Missing: ' + item[0] + ' (' + item[1] + ')');
            return false;
        }

        return true;
    }; */ //, [user]);

    const logout = async () => {
        // Have to reset all keyvalue pairs in this temp object before assigning it to state
        // Otherwise, the state will be set to the initial state, but state will still have any new keys added
        const stateReset = Object.keys(user).reduce((acc, v) => ({ ...acc, [v]: undefined }), {});
        setUser({ ...stateReset, ...getInitialState() });
        await axios.post('/api/auth/logout');
        // Remove the loggedIn cookie, via setting the expiration date to the past
        document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        toast.success("You have been logged out.")
        navigate("/");
    };


    // Assign profileComplete to the user object if the user is logged in
    // useEffect(() => {
    //     checkLoggedIn();
    // }, []);

    // When this first loads, check if the user is logged in and update the user state accordingly
    useEffect(() => {
        async function check() {
            const data = await checkLoggedIn().then((data) => data);
            // console.log("UserProvider: UECHECK: " + JSON.stringify(data));
            updateUser({ ...data });
        }
        if (firstRender.current) {
            // console.log("UserProvider: user state updated first render: " + JSON.stringify(user));
            check();
        } // else console.log("UserProvider: user state updated else: " + JSON.stringify(user));
    }, []);

    return (
        // The value prop is what will be available to any component that consumes this context
        <UserContext.Provider value={{ user, checkLoggedIn, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
