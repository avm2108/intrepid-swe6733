import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-hot-toast';

import CustomLink from '../components/CustomLink';
import LabeledInput from '../components/LabeledInput';

import "./LoginPage.css";

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

            <main>
                <div className="bgLogin"></div>
                <div className="contentContainer">
                    <div className="logintittle">
                        <h1>Login</h1>
                    </div>
                    <div className="noAccount">
                        <p>Don't have an account yet? <CustomLink to="/register">Register today.</CustomLink></p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="emailHeader">
                            <LabeledInput label="Email" id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} required />
                        </div>

                        <LabeledInput className="inputArea"
                            label="Password" id="password" name="password" type="password" value={formState.password} onChange={handleInputChange} required />

                        <button type="submit">Login</button>

                    </form>

                    <div className='forgotPassword'>
                        <h6>Forgot password?</h6>
                    </div>

                    {/* This is just for debugging purposes */}
                    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                        <h2>Debugging</h2>
                        <p>Form state:</p>
                        <pre>{JSON.stringify(formState, null, 2)}</pre>
                    </div>
                </div>
            </main >
        </>
    )
}
