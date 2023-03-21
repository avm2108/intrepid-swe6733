import { Link } from 'react-router-dom';

import './CustomLink.css';

export default function CustomLink(props) {
    return (
        <Link className="Link" {...props}>
            {props.children}
        </Link>
    );
}
