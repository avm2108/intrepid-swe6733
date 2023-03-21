import Helmet from "react-helmet";
import CustomLink from "../components/CustomLink";
import CTAButton from "../components/CTAButton";

import "./GuestHome.css";

/**
 * <GuestHome /> - The homepage for guests (users who aren't logged in)
 * @param {*} props 
 * @returns {JSX.Element} <GuestHome />
 */
export default function GuestHome(props) {
    return (
        <>
            {/* Helmet allows us to add custom meta tags without serverside rendering */}
            <Helmet>
                <title>Intrepid - Home</title>
                {/* Give us access to the FA icons */}
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
            </Helmet>
            <main>
                <div className="bgGradient"></div>
                <div className="contentContainer">
                    <div className="hero">
                        <h4>Intrepid</h4>
                        <h1>Where adventurers connect</h1>
                    </div>
                    <div className="content">
                        <div className="description">Our dating app is great for connecting with adventurers just like yourself!</div>
                        <div className="socials">
                            <div className="socials-buttons">
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
                            <div className="socials-divider">
                                <hr /><span>OR</span><hr />
                            </div>
                            <div>
                                <CTAButton className="CTAButton-white">
                                    <CustomLink style={{ display: "block", color: 'var(--color-black)' }} to="/register">Sign up with email</CustomLink>
                                </CTAButton>
                                <br />
                                <div className="existingAcctText">Existing account? <CustomLink to="/login">Login</CustomLink></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
