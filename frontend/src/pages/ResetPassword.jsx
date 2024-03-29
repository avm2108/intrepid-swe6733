import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import CustomLink from '../components/CustomLink';
import LabeledInput from '../components/LabeledInput';
import CTAButton from '../components/CTAButton';

import styles from "./ResetPassword.module.css";

/** 
 * <Login />: Renders the login page
 * @param {Object} props - The props passed to the component
 * @returns {JSX.Element} <Login />
 */
export default function ResetPassword(props) {
    const [formState, setFormState] = useState({});
    const { key } = useParams();

    // When the submit button is clicked, this function is called
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('You clicked the reset password button');
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
                <title>Intrepid - Reset Password</title>
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
            </Helmet >

            <main className={styles.loginMain}>
                <div className={styles.loginContainer}>
                    <h1 className={styles.loginTitle}>Reset Password @ Intrepid</h1>
                    <h2 className={styles.loginTitle}>One Time Key: {key}</h2>
                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <div className={styles.loginInputs}>
                            <LabeledInput labelClassName="AuthLabel" inputClassName="AuthInput" label="Your email" id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} required />
                            <LabeledInput labelClassName="AuthLabel" inputClassName="AuthInput"
                            label="Password" id="password" name="password" type="password" value={formState.password} onChange={handleInputChange} required />
                        </div>
                        <CTAButton type="submit">
                            Reset Password
                        </CTAButton>
                    </form>
                </div>
            </main>
        </>
    )
}
