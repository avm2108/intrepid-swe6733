import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-hot-toast';

import CustomLink from '../components/CustomLink';
import LabeledInput from '../components/LabeledInput';
import CTAButton from '../components/CTAButton';

import styles from "./ForgotPassword.module.css";

/** 
 * <ForgotPassword />: Renders the forgot password page
 * @param {Object} props - The props passed to the component
 * @returns {JSX.Element} <ForgotPassword />
 */
export default function ForgotPassword(props) {
    const [formState, setFormState] = useState({});

    // When the submit button is clicked, this function is called
    const handleSubmit = (e) => {
        e.preventDefault();
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
                <title>Intrepid - Forgot Password</title>
            </Helmet>

            <main className={styles.loginMain}>
                <div className={styles.loginContainer}>
                    <h1 className={styles.loginTitle}>Forgot Password</h1>
                    <div className="flexDirectionRow justifyContentCenter">
                        <CustomLink to="/login" type="green">Go to Login</CustomLink>
                    </div>
                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <div className={styles.loginInputs}>
                            <LabeledInput labelClassName="AuthLabel" inputClassName="AuthInput" label="Your email" id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} required />
                        </div>
                        <CTAButton type="submit">
                            Submit
                        </CTAButton>
                    </form>
                </div>
            </main>
        </>
    )
}
