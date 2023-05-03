import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Helmet from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../providers/UserProvider';
import axios from 'axios';

import CustomLink from '../components/CustomLink';
import LabeledInput from '../components/LabeledInput';
import CTAButton from '../components/CTAButton';

import styles from './Register.module.css';

const friendlyFieldNames = {
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    dateOfBirth: 'Date of Birth',
};

/**
 * <Register />: Renders the register page, accepting sign up information from the user
 * @param {Object} props - The props passed to the component
 * @returns {JSX.Element} <Register />
 */
function Register(props) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    
    // If the user is already logged in, redirect them to their profile page
    useEffect(() => {
        // If the user is already logged in, redirect them to their profile page
        if (user?.loggedIn) {
            navigate('/matching');
        }
    }); // eslint-disable-line react-hooks/exhaustive-deps

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        disabled: false,
        errors: {},
    });

    // When the submit button is clicked, this function is called
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure the necessary fields are passed
        if (!formState.name || !formState.email || !formState.password || !formState.confirmPassword || !formState.dateOfBirth) {
            toast.error('Please fill out all fields.');
            return;
        }
        // Disable form while waiting for submit
        setFormState((prevState) => ({
            ...prevState,
            disabled: true,
        }));

        const res = await axios.post('/api/auth/register', formState)
            .then((response) => {
                return response;
            }).catch(
            (error) => {
                return error.response;
            }
        )

        if (res.status === 200 || res.status === 201) {
            toast.success('Registration successful! Please log in.');
            setFormState((prevState) => ({
                ...prevState,
                disabled: true,
                errors: {},
            }));
            navigate('/login');
        } else {
            toast.error('Something went wrong, please try again.');
            const { data } = res;
            // If the response doesn't have an errors object, it's a server error
            if (!data || !data.errors) {
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
        }
    }

    // Whenever a form input changes, this function is called
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Update the form state with the new value for the changed input
        setFormState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    // Handle the Facebook login
    // const handleFacebookLogin = async (response) => {
    //     // Disable form while waiting for submit
    //     setFormState((prevState) => ({
    //         ...prevState,
    //         disabled: true,
    //     }));

    //     if (!response.accessToken) {
    //         setFormState((prevState) => ({
    //             ...prevState,
    //             disabled: false,
    //             errors: {
    //                 ...prevState.errors,
    //                 general: {
    //                     friendlyName: "Facebook Login Error",
    //                     message: "Something went wrong, please try again.",
    //                 }
    //             }
    //         }));

    //         return handleFacebookLoginFailure(response);
    //     }

    //     // Send the form data to the backend
    //     const res = await axios.post('/api/auth/facebook/login', response)
    //         .then((response) => {
    //             return response;
    //         }).catch((error) => {
    //             return error.response || error;
    //         });

    //     if (res.status === 404) {
    //         // User not found, they need to register
    //         setFormState((prevState) => ({
    //             ...prevState,
    //             disabled: false,
    //             errors: {
    //                 ...prevState.errors,
    //                 general: {
    //                     friendlyName: "Facebook Login Error",
    //                     message: "You must register with Intrepid before logging in with Facebook.",
    //                 }
    //             }
    //         }));
    //     } else if (res.status !== 200) {
    //         // Some other error
    //         setFormState((prevState) => ({
    //             ...prevState,
    //             disabled: false,
    //             errors: {
    //                 ...prevState.errors,
    //                 general: {
    //                     friendlyName: "Facebook Login Error",
    //                     message: res?.data?.errors?.message || "Something went wrong, please try again.",
    //                 }
    //             }
    //         }));
    //     } else {
    //         // If the login is successful, get the CSRF token and user data from the response body
    //         const userData = res.data.user;
    //         const csrfToken = res.data.csrfToken;

    //         // Ensure our CSRF token is set in the headers for future requests
    //         axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

    //         // Update the global state with our info
    //         const newUser = {
    //             loggedIn: true,
    //             csrfToken: csrfToken,
    //             ...userData
    //         };
    //         setUser(newUser);
    //     }

    //     /*         setFormState((prevState) => ({
    //                 ...prevState,
    //                 disabled: false,
    //             })); */
    // };

    // const handleFacebookLoginFailure = (response) => {
    //     console.log(response);
    //     if (response.status === 'unknown') {
    //         toast.error('Something went wrong, please try again.');
    //     } else if (response.status === 'not_authorized') {
    //         toast.error('You must authorize Intrepid to use your Facebook account.');
    //     } else {
    //         toast.error('You must log in to Facebook to use this feature.');
    //     }
    // };

    return (
        <>
            <Helmet>
                <title>Intrepid - Register</title>
            </Helmet>
            <main className={styles.registerMain}>
                <div className={styles.registerContainer}>
                    <h1 className={styles.registerTitle}>Sign up with <span style={{ borderBottom: "5px solid var(--color-dark-green)" }}>Email</span></h1>
                    <div className={styles.noAccount}>
                        Get chatting with friends and family today by signing up for our chat app!
                        <br />
                        Already have an account? <CustomLink to="/login" type="green">Go to Login</CustomLink>
                    </div>
                    <form className={styles.registerForm} onSubmit={handleSubmit}>
                        <div className={styles.socials}>
                            <div className={styles.socialsButtons}>
                                <button onClick={e => e.preventDefault()}>
                                    <i className="fab fa-facebook-f" title="Sign up with Facebook"></i>
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
                                            <strong>{formState.errors[key].friendlyName}</strong>: {formState.errors[key].message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className={styles.registerInputs}>
                            <LabeledInput label="Your name" id="name" name="name" type="text" value={formState.name} onChange={(e) => handleInputChange(e)} required />
                            <LabeledInput label="Your email" id="email" name="email" type="email" value={formState.email} onChange={(e) => handleInputChange(e)} required />
                            <LabeledInput label="Password" id="password" name="password" type="password" value={formState.password} onChange={(e) => handleInputChange(e)} required />
                            <LabeledInput label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={formState.confirmPassword} onChange={(e) => handleInputChange(e)} required />
                            <LabeledInput label="Your Birth Date" id="dateOfBirth" name="dateOfBirth" type="date" value={formState.dateOfBirth} onChange={(e) => handleInputChange(e)} required />
                        </div>
                        <CTAButton theme="green" type="submit">
                            Create an account
                        </CTAButton>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register;
