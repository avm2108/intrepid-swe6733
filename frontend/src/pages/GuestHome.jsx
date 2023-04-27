import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import CustomLink from "../components/CustomLink";
import CTAButton from "../components/CTAButton";
import { UserContext } from "../providers/UserProvider";
import styles from "./GuestHome.module.css";

/**
 * <GuestHome /> - The homepage for guests (users who aren't logged in)
 * @param {*} props 
 * @returns {JSX.Element} <GuestHome />
 */
export default function GuestHome(props) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // If the user is already logged in, redirect them to their profile page
        if (user.loggedIn) {
            navigate('/profile');
        } else {
            console.log('User not logged in at GuestHome');
            return;
        }
    }, [user.loggedIn, navigate]);

    return (
        <>
            {/* Helmet allows us to add custom meta tags without serverside rendering */}
            <Helmet>
                <title>Intrepid - Home</title>
                {/* Give us access to the FA icons */}
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
            </Helmet>
            <main className={styles.main}>
                <div className={styles.bgGradient}></div>
                <div className={styles.contentContainer}>
                    <div className={styles.hero}>
                        <h4>Intrepid</h4>
                        <h1>Where adventurers connect</h1>
                    </div>
                    <div className={styles.hero}>
                        <div className={styles.description}>Our dating app is great for connecting with adventurers just like yourself!</div>
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
                            <div>
                                <CTAButton>
                                    <CustomLink style={{ display: "block", color: 'var(--color-black)' }} to="/register">Sign up with email</CustomLink>
                                </CTAButton>
                                <br />
                                <div className={styles.existingAcctText}>Existing account? <CustomLink to="/login">Login</CustomLink></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
