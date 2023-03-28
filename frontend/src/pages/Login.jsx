import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-hot-toast';

import CustomLink from '../components/CustomLink';
import LabeledInput from '../components/LabeledInput';
import CTAButton from '../components/CTAButton';

import styles from "./Login.module.css";

/** 
 * <Login />: Renders the login page
 * @param {Object} props - The props passed to the component
 * @returns {JSX.Element} <Login />
 */
export default function Login(props) {
    const [formState, setFormState] = useState({});

    // When the submit button is clicked, this function is called
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('You clicked the login button');
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

    return (
        <>
            {/* This allows us to change the page title, meta tags, etc. */}
            <Helmet>
                <title>Intrepid - Login</title>
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
            </Helmet >

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
                                <button>
                                    <i className="fab fa-facebook-f" title="Sign up with Facebook"></i>
                                </button>
                                <button>
                                    <i className="fab fa-google" title="Sign up with Google"></i>
                                </button>
                                <button>
                                    <i className="fab fa-apple" title="Sign up with Apple"></i>
                                </button>
                            </div>
                            <div className={styles.socialsDivider}>
                                <hr /><span>OR</span><hr />
                            </div>
                        </div>
                        <div className={styles.loginInputs}>
                            <LabeledInput labelClassName="AuthLabel" inputClassName="AuthInput" label="Your email" id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} required />
                            <LabeledInput labelClassName="AuthLabel" inputClassName="AuthInput"
                                label="Password" id="password" name="password" type="password" value={formState.password} onChange={handleInputChange} required />
                        </div>
                        <CTAButton type="submit">
                            Log in
                        </CTAButton>
                    </form>
                    <div className={styles.forgotPassword}>
                        <CustomLink type="green" to="/forgot-password">Forgot password?</CustomLink>
                    </div>
                </div>
            </main>
        </>
    )
}
