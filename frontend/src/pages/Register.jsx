import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Helmet from 'react-helmet';

import CustomLink from '../components/CustomLink';
import LabeledInput from '../components/LabeledInput';
import CTAButton from '../components/CTAButton';

import styles from './Register.module.css';

/**
 * <Register />: Renders the register page, accepting sign up information from the user
 * @param {Object} props - The props passed to the component
 * @returns {JSX.Element} <Register />
 */
function Register(props) {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthdate: '',
        disabled: false,
        errors: {},
    });

    // When the submit button is clicked, this function is called
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('You clicked the register button');
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
                        <div className={styles.registerInputs}>
                            <LabeledInput label="Your name" id="name" name="name" type="text" value={formState.name} onChange={(e) => handleInputChange(e)} required />
                            <LabeledInput label="Your email" id="email" name="email" type="email" value={formState.email} onChange={(e) => handleInputChange(e)} required />
                            <LabeledInput label="Password" id="password" name="password" type="password" value={formState.password} onChange={(e) => handleInputChange(e)} required />
                            <LabeledInput label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={formState.confirmPassword} onChange={(e) => handleInputChange(e)} required />
                            <LabeledInput label="Your birthdate" id="birthdate" name="birthdate" type="date" value={formState.birthdate} onChange={(e) => handleInputChange(e)} required />
                        </div>
                        <CTAButton type="submit">
                            Create an account
                        </CTAButton>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register;
