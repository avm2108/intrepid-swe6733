import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Helmet from 'react-helmet';

import CustomLink from '../components/CustomLink';
import LabeledInput from '../components/LabeledInput';


/**
 * <Register />: Renders the register page, accepting sign up information from the user
 * @param {Object} props - The props passed to the component
 * @returns {JSX.Element} <Register />
 */
function Register(props) {
    const [formState, setFormState] = useState({});

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
            <h1>Register</h1>
            <p>Already have an account? <CustomLink to="/login">Login here.</CustomLink></p>
            <form onSubmit={handleSubmit}>
                <LabeledInput label="Email" id="email" name="email" type="email" value={formState.email} onChange={(e) => handleInputChange(e)} required />
                <LabeledInput label="Password" id="password" name="password" type="password" value={formState.password} onChange={(e) => handleInputChange(e)} required />
                <LabeledInput label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={formState.confirmPassword} onChange={(e) => handleInputChange(e)} required />
                <button type="submit">Register</button>
            </form>

            <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                <h2>Debugging</h2>
                <p>Form state:</p>
                <pre>{JSON.stringify(formState, null, 2)}</pre>
            </div>
        </>
    )
}

export default Register;
