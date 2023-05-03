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
/*         updateUser({
            IGPhotos: [
                "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/42937059_277357356219816_6325944643517415300_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=ep_ql21F4WQAX_ZozuF&_nc_ht=scontent-iad3-1.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfBrCguJLp7JvSN44i4TMt5NpboCweNjyRXyfsHkH26x2w&oe=6456F5B9",
                "https://scontent-iad3-2.cdninstagram.com/v/t51.2885-15/25015936_150287338951067_699869868685524992_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=VVKINRvwLYgAX9cf2in&_nc_oc=AQlARXMVVp7f5mNYQBYsHcE_aMykS-k-wNzJ8sXxBlE99ueegDVwBxnCItm5phibAtI&_nc_ht=scontent-iad3-2.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfBYKoBhkpU0UYr-jb081SM-P-_m3wjRFDVy9y6tbP5IFw&oe=64562191", "https://scontent-iad3-2.cdninstagram.com/v/t51.2885-15/25005343_1912912625703933_4674482198391291904_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=bfiH6XGYnkwAX8YXEND&_nc_ht=scontent-iad3-2.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfAcgJSPa5gkQp7Yfhyo1QdnKpFhLzo4qPYTtU9V6DL_7Q&oe=6455F5BA"
            ],
        });  */
        // POST instagram/associate request to associate the user's Instagram account with their profile
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
    }, []);

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

    const getPhotosFromIG = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get('/api/auth/instagram/test');
            if (res.status === 200) {
                toast.success("Successfully retrieved photos from Instagram");
                // Get only the image urls?
                const imgUrls = res.data?.data?.map(photo => photo?.media_url);
                console.log(imgUrls);
                updateUser({ IGPhotos: imgUrls });
            } else {
                toast.error("Error retrieving photos from Instagram, please try again later");
            }
        } catch (err) {
            console.log(err);
            if (err.response.status === 401) {
                toast.error("Please log in again to retrieve photos from Instagram");
            } else {
                toast.error("Error retrieving photos from Instagram, please try again later");
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
                    <img src={profile?.profilePicture?.href}
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
                            <button onClick={e => getPhotosFromIG(e)}>
                                <i className="fas fa-images" title="Get photos from Instagram"></i>
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
                    <div className={styles.userDetails}>{user.phone}</div>*/}
                    <h3>Media Shared</h3>
                    <div className={styles.userIGPhotos}>
                        {/* Display little thumbnail boxes for each one */}
                        {user?.IGPhotos?.map?.((photo, idx) => {
                            return <img key={idx} src={photo} alt={"Instagram Photo" + idx} className={styles.igPhoto}></img>
                        })}
                    </div>
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

                    <div className="flexDirectionColumn justifyContentCenter alignItemsCenter width-100">
                        <CTAButton theme="white-border" onClick={(e) => logout(e)}>Logout</CTAButton>
                        <CTAButton theme="red" onClick={(e) => handleDelete(e)}>Delete Account</CTAButton>
                    </div>
                </div>

            </main>
        </>
    )
}
