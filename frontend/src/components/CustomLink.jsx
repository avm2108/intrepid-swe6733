import { Link } from 'react-router-dom';

import styles from './CustomLink.module.css';


/**
 * Renders a custom Link component
 * @param {string to} props.to - The path to navigate to
 * @param {string type} props.theme - The type of link to render (green or default)
 * @param {*} props.children - The text or elements to display within the link 
 * @returns {JSX.Element} <CustomLink />
 */
export default function CustomLink(props) {
        return (
            <Link className={(props.theme === "green") ? `${styles.Link} ${styles.GreenLink}` : `${styles.Link}`} to={props.to} style={props.style}>
            {props.children}
        </Link>
    );
}
