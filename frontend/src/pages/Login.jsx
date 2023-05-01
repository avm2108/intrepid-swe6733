import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '../providers/UserProvider';
// Might need to use this later
// import FacebookLogin, { FacebookLoginClient } from '@greatsumini/react-facebook-login';

import CustomLink from '../components/CustomLink';
import LabeledInput from '../components/LabeledInput';
import CTAButton from '../components/CTAButton';

import styles from "./Login.module.css";

const friendlyFieldNames = {
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    dateOfBirth: 'Date of Birth',
};

/** 
 * <Login />: Renders the login page
 * @param {Object} props - The props passed to the component
 * @returns {JSX.Element} <Login />
 */
export default function Login(props) {
    const navigate = useNavigate();
    const { user, updateUser } = useContext(UserContext);

    // On first load of this page, check if the user is already logged in
/*     useEffect(() => {
        // If the user is already logged in, redirect them to their profile page
        if (user.loggedIn) {
            navigate('/profile');
        }
    }, []); */

    const [formState, setFormState] = useState({
        email: '',
        password: '',
        disabled: false,
        errors: {},
    });

    // When the submit button is clicked, this function is called
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure the necessary fields are passed
        if (!formState.email || !formState.password) {
            toast.error('Please fill out all fields.');
            return;
        }

        // Disable form while waiting for submit
        setFormState((prevState) => ({
            ...prevState,
            disabled: true,
            errors: {},
        }));

        // Send the form data to the backend
        const res = await axios.post('/api/auth/login', formState).then((response) => {
            return response;
        }).catch((error) => {
            return error.response;
        });

        // If the response is not 200, it's an error
        if (res.status !== 200) {
            const { data } = res;

            // If the response doesn't have an errors object, it's a server error
            if (!res.data || !res.data.errors) {
                setFormState((prevState) => ({
                    ...prevState,
                    disabled: false,
                    errors: {
                        ...prevState.errors,
                        general: {
                            friendlyName: "Server Error",
                            message: "Something went wrong, please try again.",
                        }
                    },
                }));
                return;
            }

            // Otherwise, we'll transform the errors object into a more friendly format
            // "Username": "Username is already taken"
            // TODO: Extract this into a helper function
            const transformedErrors = {};
            Object.keys(data.errors).forEach((key) => {
                // The error value might be an array ex. "dateOfBirth": ["You must be at least 18 to register", "Date of Birth must be a valid date"]
                if (Array.isArray(data.errors[key])) {
                    // TODO: Might not be necessary to show all of those array vals - we can just take the first value for now
                    data.errors[key] = data.errors[key][0];
                }
                transformedErrors[key] = {
                    friendlyName: friendlyFieldNames[key],
                    message: data.errors[key],
                };
            });

            setFormState((prevState) => ({
                ...prevState,
                disabled: false, // Re-enable the form
                errors: transformedErrors,
            }));
            return;
        }

        // If the login is successful, get the CSRF token from the response body
        // and add it to the all our future requests' headers
        const csrfToken = res.data.csrfToken;
        axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

        // Set another clientside cookie to represent that we're logged in
        // So that if we refresh the page, we'll know that we did login 
        // previously and to check the serverside login status to ensure its valid
        // before redirecting away from the GuestHome page that it'll put us on if
        // we refresh the page
        document.cookie = `loggedIn=true; path=/`;

        // Update the global state with our info 
        const newUser = {
            loggedIn: true,
            csrfToken: csrfToken,
            ...res.data.user,
        };

        console.log("newUser: ", newUser);

        updateUser(newUser);

        navigate('/matching');
    };

    // Whenever a form input changes, this function is called
    const handleInputChange = (e) => {
        // Get the ID and value of the input that changed
        const { id, value } = e.target;
        // Update the form state with the new value for the changed input
        setFormState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

//     // Handle the Facebook login
//     const handleFacebookLogin = async (response) => {
//         // Disable form while waiting for submit
//         setFormState((prevState) => ({
//             ...prevState,
//             disabled: true,
//         }));
        
//         if (!response.accessToken) {
//             setFormState((prevState) => ({
//                 ...prevState,
//                 disabled: false,
//                 errors: {
//                     ...prevState.errors,
//                     general: {
//                         friendlyName: "Facebook Login Error",
//                         message: "Something went wrong, please try again.",
//                     }
//                 }
//             }));

//             return handleFacebookLoginFailure(response);
//         }

//         // Send the form data to the backend
//         const res = await axios.post('/api/auth/facebook/login', response)
//             .then((response) => {
//                     return response;
//             }).catch((error) => {
//                     return error.response || error;
//             });
                
//         if (res.status === 404) {
//             // User not found, they need to register
//             setFormState((prevState) => ({
//                 ...prevState,
//                 disabled: false,
//                 errors: {
//                     ...prevState.errors,
//                     general: {
//                         friendlyName: "Facebook Login Error",
//                         message: "You must register with Intrepid before logging in with Facebook.",
//                     }
//                 }
//             }));
//         } else if (res.status !== 200) {
//             // Some other error
//             setFormState((prevState) => ({
//                 ...prevState,
//                 disabled: false,
//                 errors: {
//                     ...prevState.errors,
//                     general: {
//                         friendlyName: "Facebook Login Error",
//                         message: res?.data?.errors?.message || "Something went wrong, please try again.",
//                     }
//                 }
//             }));
//         } else {
//             // If the login is successful, get the CSRF token and user data from the response body
//             const userData = res.data.user;
//             const csrfToken = res.data.csrfToken;

//             // Ensure our CSRF token is set in the headers for future requests
//             axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

//             // Update the global state with our info
//             const newUser = {
//                 loggedIn: true,
//                 csrfToken: csrfToken,
//                 ...userData
//             };
//             setUser(newUser);
//         }
        
// /*         setFormState((prevState) => ({
//             ...prevState,
//             disabled: false,
//         })); */
//     };

//     const handleFacebookLoginFailure = (response) => {
//         console.log(response);
//         if (response.status === 'unknown') {
//             toast.error('Something went wrong, please try again.');
//         } else if (response.status === 'not_authorized') {
//             toast.error('You must authorize Intrepid to use your Facebook account.');
//         } else {
//             toast.error('You must log in to Facebook to use this feature.');
//         }
//     };

    return (
        <>
            {/* This allows us to change the page title, meta tags, etc. */}
            <Helmet>
                <title>Intrepid - Login</title>
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
            </Helmet>

            <main className={styles.loginMain}>
                <div className={styles.loginContainer}>
                    <h1 className={styles.loginTitle}>Login to Intrepid</h1>
                    <div className={styles.noAccount}>
                        Welcome back! Sign in using your social account or email to continue.
                        <br />
                        Don't have an account? <CustomLink to="/register" type="green">Register today</CustomLink>
                    </div>
                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <div className={styles.socials}>
                            <div className={styles.socialsButtons}>
                               {/*  <FacebookLogin
                                    initParams={{
                                        version: 'v16.0',
                                        xfbml: true,
                                    }}
                                    className="fab fa-facebook-f"
                                    appId=`${process.env.REACT_APP_FACEBOOK_APP_ID}`
                                    fields="public_profile"
                                    onSuccess={(response) => {
                                        handleFacebookLogin(response);
                                    }}
                                    onFail={(error) => {
                                        handleFacebookLoginFailure(error);
                                    }}
                                    render={({ onClick, logout }) => (
                                        <button disabled={formState.disabled} onClick={(e) => { e.preventDefault(); onClick(e); }}>
                                            <i className="fab fa-facebook-f" title="Sign ui with Facebook"></i>
                                        </button>
                                    )}
                                /> */}
                                <button disabled={formState.disabled} onClick={(e) => { e.preventDefault(); }}>
                                    <i className="fab fa-facebook-f" title="Sign ui with Facebook"></i>
                                </button>
                                <button onClick={e => e.preventDefault()}>
                                    <i className="fab fa-google" title="Sign up with Google"></i>
                                </button>
                                <button onClick={e => e.preventDefault()}>
                                    <i className="fab fa-apple" title="Sign up with Apple"></i>
                                </button>
                            </div>
                            <div className={styles.socialsDivider}>
                                <hr /><span>OR</span><hr />
                            </div>
                        </div>
                        {Object.keys(formState.errors).length > 0 && (
                            <div className="errorsContainer">
                                <h3>Please fix the following errors:</h3>
                                <ul className="errorsList">
                                    {Object.keys(formState.errors).map((key) => (
                                        <li className="errorItem" key={key}>
                                            <strong>{formState.errors[key]?.friendlyName}</strong>: {formState.errors[key].message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className={styles.loginInputs}>
                            <LabeledInput labelClassName="AuthLabel" inputClassName="AuthInput" label="Your email" id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} required />
                            <LabeledInput labelClassName="AuthLabel" inputClassName="AuthInput"
                                label="Password" id="password" name="password" type="password" value={formState.password} onChange={handleInputChange} required />
                        </div>
                        <CTAButton theme="green" type="submit">
                            Log in
                        </CTAButton>
                    </form>
                    <div className={styles.forgotPassword}>
                        <CustomLink theme="green" to="/forgot-password">Forgot password?</CustomLink>
                    </div>
                </div>
            </main>
        </>
    )
}
