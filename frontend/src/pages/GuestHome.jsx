import Helmet from "react-helmet";
import CustomLink from "../components/CustomLink";

// This is a "functional component" that renders the home page for guests (users who aren't logged in)
export default function GuestHome(props) {
    return (
        <>
            <Helmet>
                <title>Intrepid - Home</title>
            </Helmet>
            <p>Intrepid is a web application that allows you to connect with like-minded adventurers, and communicate and plan activities.</p>
            <img src="/img/Logo.png" alt="Intrepid Logo" width="150px" height="150px" />
            <p>
                <CustomLink to="/login">Login</CustomLink> or <CustomLink to="/register">Register</CustomLink> to get started.
            </p>
        </>
    );
}
