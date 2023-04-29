import React, { useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import styles from './UserProfile.module.css';
import CTAButton from "../components/CTAButton";
import CustomLink from "../components/CustomLink";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import STATES, { getStateName } from "../services/StateMapping";

export default function UserProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, updateUser, logout } = React.useContext(UserContext);
    const { profile } = user;

    useEffect(() => {
        // If we're coming here via /instagram/nextStep, we need to make the
        // POST instagram/associate request to associate the user's Instagram
        // account with their profile
        if (location.pathname.startsWith("/instagram")) {
            axios.post("/api/auth/instagram/associate").then(res => {
                if (res.status === 200) {
                    toast.success("Successfully associated Instagram account");
                    console.log(JSON.stringify(res.data));
                    // updateUser();
                }
            }).catch(err => {
                console.log(err);
                if (err.response.status === 401) {
                    toast.error("Please log in again to associate your Instagram account");
                } else if (err.response.status === 409) {
                    toast.error("Instagram account already associated with another user");
                } else if (err.response.status === 404) {
                    toast.error("You must begin the linking process before you can associate your Instagram account");
                } else {
                    toast.error("Error associating Instagram account, please try again later");
                }
            });
        }
    });

    const [agePref, setAgePref] = useState('');
    const [maxDist, setMaxDist] = useState('50');

    const handleChange = (e) => {
        let obj = {};
        obj[e.target.name] = e.target.value;
        setMaxDist(obj);
    }

    const beginIGLinking = (e) => {
        e.preventDefault();
        // Navigate to Instagram login page
        window.location.href = `/api/auth/instagram`;
    }   

    const handleDelete = async (e) => {
        e.preventDefault();
        const password = window.prompt("Please enter your password to confirm account deletion");
        if (!password) {
            return;
        } else {
            try {
                const res = await axios.post('/api/account/delete', { password: password });
                if (res.status === 200) {
                    toast.success("Successfully deleted account");
                    logout();
                } else {
                    toast.error("Error deleting account, please try again later");
                }
            } catch (err) {
                console.log(err);
                if (err.response.status === 401) {
                    toast.error("Incorrect password");
                } else {
                    toast.error("Error deleting account, please try again later");
                }
            }
        }
    }


    return (
        <>
            <Helmet>
                <title>Intrepid - Profile</title>
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
            </Helmet>
            <main className={styles.profileContainer}>
                <h1>My Profile</h1>

                <div className={styles.userInfo}>
                    <img src={process.env.REACT_APP_API_URL + "/" + profile?.profilePicture?.href}
                        alt='User Avatar' className={styles.avatar}></img>
                    <h2>{user?.name}{user?.dateOfBirth && ", " + user?.dateOfBirth}</h2>
                    <div className={styles.socials}>
                        <div className={styles.socialsButtons}>
                            <button onClick={e => e.preventDefault()}>
                                <i className="fab fa-facebook-f" title="Sign up with Facebook"></i>
                            </button>
                            <button onClick={e => e.preventDefault()}>
                                <i className="fab fa-google" title="Sign up with Google"></i>
                            </button>
                            <button onClick={e => beginIGLinking(e)}>
                                <i className="fab fa-instagram" title="Link your profile with Instagram"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.editableInfo}>
                    <h3>Display Name</h3>
                    <div className={styles.userDetails}>{user?.name}</div>
                    <h3>Email Address</h3>
                    <div className={styles.userDetails}>{user?.email}</div>
                    <h3>Location</h3>
                    <div className={styles.userDetails}>{getStateName(profile?.location?.state)}, USA</div>
{/*                     <h3>Phone Number</h3>
                    <div className={styles.userDetails}>{user.phone}</div>
                    <h3>Media Shared</h3> */}
                    {/* Needs image rendering I think for user images on their profile, this section could also be removed */}
                    <h3>Bio / About Me</h3>
                    <div className={styles.userDetails}>{profile?.bio}</div>
                    <h3>Interests</h3>
                    <div className={styles.userDetails}>
                        {profile?.interests?.map?.((interest, idx) => {
                            return (idx !== profile?.interests.length - 1) ? `${interest}, ` : interest;
                        })}
                    </div>
                    <h3 className={styles.h3Black}>Discovery Settings</h3>
                    <div className={styles.location}>
                        <h3>Location</h3>
                        <p>My Current Location ({getStateName(profile?.location?.state) }, USA)</p>
                    </div>
                    <div className={styles.showMe}>
                        <h3>Show Me</h3>
                        <p>{profile?.preferences?.gender?.map?.((gender, idx) => {
                            return (idx !== profile?.preferences?.gender.length - 1) ? `${gender}, ` : gender;
                        })}
                        </p>
                    </div>
                    <div className={styles.ageRange}>
                        <h3>Age Range</h3>
                        <p>{profile?.preferences?.ageRange?.min} - {profile?.preferences?.ageRange?.max}</p>
                    </div>
                    <div className={styles.maxDistance}>
                        <h3>Maximum Distance: {profile?.preferences?.distance}mi.</h3>
                        <input className={styles.slider} type="range" min="1" max="100" value={profile?.preferences?.distance || 50} id="myRange" onChange={(e) => { handleChange(e) }}></input>
                    </div>

                    <hr className={styles.divider}></hr>

                    <div className="flexDirectionColumn justifyContentCenter width-100">
                        <CTAButton theme="white-border" onClick={(e) => logout(e)}>Logout</CTAButton>
                        <CTAButton theme="red" onClick={(e) => handleDelete(e)}>Delete Account</CTAButton>
                    </div>
                </div>

            </main>
        </>
    )
}
