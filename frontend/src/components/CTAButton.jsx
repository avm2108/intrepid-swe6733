import "./CTAButton.css";

/**
 * Large styled button used typically for calls to action esp. for authentication
 * @param {Object} props - The props passed to the component
 * @returns {JSX.Element} <BigButton /> 
 */
export default function CTAButton(props) {
    return (
        <button className={"CTAButton " + props.className} onClick={props.onClick}>
            {props.children}
        </button>
    );
};
