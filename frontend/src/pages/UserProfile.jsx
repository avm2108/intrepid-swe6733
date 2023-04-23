import React, {useEffect, useState} from "react";
import { Helmet } from "react-helmet";
import image from '../img_avatar.png';
import styles from './UserProfile.module.css';
import CTAButton from "../components/CTAButton";
import CustomLink from "../components/CustomLink";

export default function UserProfile() {
    const [ agePref, setAgePref ] = useState('');
    const [ maxDist, setMaxDist ] = useState('50');

    const user = {
        id: 0,
        name: 'Heidi Huntington',
        age: 32,
        gender: 'Female',
        genderPref: 'Men',
        email: 'heidihuntington4@gmail.com',
        phone: '(320)-555-0104',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        interests: [
          'reading',
          'writing',
          'yoga',
          'traveling',
          'cooking',
          'learning new things',
          'photography',
        ],
      }

      const handleChange = (e) => {
        let obj = {};
        obj[e.target.name] = e.target.value;
        setMaxDist(obj);
      }

    return (
        <>
            <Helmet>
                <title>Intrepid - Profile</title>
                <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
            </Helmet>
            <main className={styles.profileContainer}>
                <h1>Profile</h1>

                <div className={styles.userInfo}>
                    <img src={image}
                    alt='User Avatar' className={styles.avatar}></img>
                    <h2>{user.name}, {user.age}</h2>
                    <div className={styles.socials}>
                        <div className={styles.socialsButtons}>
                        <button onClick={e => e.preventDefault()}>
                                    <i className="fab fa-facebook-f" title="Sign up with Facebook"></i>
                                </button>
                                <button onClick={e => e.preventDefault()}>
                                    <i className="fab fa-google" title="Sign up with Google"></i>
                                </button>
                                <button onClick={e => e.preventDefault()}>
                                    <i className="fab fa-apple" title="Sign up with Apple"></i>
                                </button>
                        </div>
                        </div>
                </div>

                <div className={styles.editableInfo}>
                    <h3>Display Name</h3>
                    <div className={styles.userDetails}>{user.name}</div>
                    <h3>Email Address</h3>
                    <div className={styles.userDetails}>{user.email}</div>
                    <h3>Address</h3>
                    <div className={styles.userDetails}>{user.city}, {user.state}</div>
                    <h3>Phone Number</h3>
                    <div className={styles.userDetails}>{user.phone}</div>
                    <h3>Media Shared</h3>
                    {/* Needs image rendering I think for user images on their profile, this section could also be removed */}

                    <h3 className={styles.h3Black}>Discovery Settings</h3>
                    <div className={styles.location}>
                        <h3>Location</h3>
                        <p>My Current Location</p>
                    </div>
                    <div className={styles.showMe}>
                        <h3>Show Me</h3>
                        <p>{user.genderPref}</p>
                    </div>
                    <div className={styles.ageRange}>
                        <h3>Age Range</h3>
                        
                    </div>
                    <div className={styles.maxDistance}>
                        <h3>Maximum Distance</h3>
                        
                        <input className={styles.slider} type="range" min="1" max="100" value={maxDist} id="myRange" onChange={(e) => { handleChange(e)}}></input> 
                    </div>

                <hr className={styles.divider}></hr>

                <CTAButton theme="white-border">Logout</CTAButton>
                <CTAButton theme="red">Delete Account</CTAButton>
                </div>

            </main>
        </>
    )
}
