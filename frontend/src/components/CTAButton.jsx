import styles from './CTAButton.module.css';

/**
 * Large styled button used typically for calls to action esp. for authentication
 * @param {Object} props - The props passed to the component
 * @param {string} props.className - The class name to apply to the button
 * @returns {JSX.Element} <BigButton /> 
 */
export default function CTAButton(props) {
    return (
        // TODO: Add a way to pass in a custom className while still using the module styles
        <button className={`${styles.CTAButton}`} {...props.rest}>
            {props.children}
        </button>
    );
};
