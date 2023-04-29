import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from './CreateProfile.module.css';
import CTAButton from "../components/CTAButton";
import STATES from "../services/StateMapping";
import INTERESTS from "../services/InterestsEnum";

// This is only to for demonstration purposes to show
// how the image upload works, and how data can be pulled
// from the user context. it doesn't have all the proper fields or validation
// TODO: We need to detect if a user has already "created" their profile and
// if so don't show this page, instead redirect them to their view/edit profile page
export default function CreateProfile(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, checkLoggedIn, checkProfileComplete, updateUser, logout } = useContext(UserContext);

    // If a non-logged in user reaches this page, redirect them to the login page
/*     useEffect(() => {
        async function ensureLoggedIn() {
            if (!user.loggedIn) {
                navigate("/login");
            }

            // If the user is logged in, but their profile is already complete,
            // redirect them to the matching
            if (user.loggedIn && checkProfileComplete()) {
                navigate("/matching");
            }
        }
        ensureLoggedIn();
    }, []); */

    const [errors, setErrors] = useState({});
    const [profilePictureCaption, setProfilePictureCaption] = useState("");
    const [formState, setFormState] = useState({
        bio: "",
        gender: "",
        location: {
            // city: "",
            state: "",
            // country: ""
        },
        profilePicture: null, // Represents the actual file object
        profilePictureName: "",
        profilePictureCaption: "",
        interests: [],
        preferences: {
            gender: [],
            ageRange: {
                min: null,
                max: null
            },
            // TODO: Are we taking max distance into account since using only state w/o city?
            distance: 50 // null
        }
    });

    // Handles most form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        // If it's a nested key (e.g. location.city), split it into an array and use the first element as the parent key
        if (name.includes(".")) {
            // Need to account for doubly nested keys (e.g. preferences.ageRange.min)
            const [parent, child, subchild=null] = name.split(".");

            if (subchild) {
                setFormState(prevState => ({
                    ...prevState,
                    [parent]: {
                        ...prevState[parent],
                        [child]: {
                            ...prevState[parent][child],
                            [subchild]: value
                        }
                    }
                }));
            } else {
                setFormState(prevState => ({
                    ...prevState,
                    [parent]: {
                        ...prevState[parent],
                        [child]: value
                    }
                }));
            }

            return;
        }
        setFormState({ ...formState, [name]: value });
    }

    const handleInterestChange = (ev) => {
        const value = ev.target.value;
        setFormState(prevState => ({
            ...prevState,
            interests: (prevState.interests.includes(value)) ?
                [...prevState.interests.filter(el => el !== value)] : [...prevState.interests, value]
        }));
    }

    const handlePrefGenderChange = ({ target }) => {
        // Update or remove from the formState.preferences.gender array
        setFormState(prevState => ({
            ...prevState,
            preferences: {
                ...prevState.preferences,
                gender: (target.checked) ? [...prevState.preferences?.gender, target.value] :
                    [...prevState.preferences?.gender?.filter?.(el => el !== target.value)]
            }
        }));
    }

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        setFormState({ ...formState, profilePicture: files[0], profilePictureName: files[0].name });
    }

    const handleRemoveImage = () => {
        setFormState({ ...formState, profilePicture: null, profilePictureName: "", profilePictureCaption: "" });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Represent the form's data as a FormData object because we need to send files 
        // in addition to JSON data while maintaining the multipart/form-data content type
        const formData = new FormData();

        // Append profile text fields to formData as JSON
        // Exclude profilePictures since we need it appended as files
        const { profilePicture, ...profile } = formState;
        formData.append("profile", JSON.stringify(profile));
        formData.append("profilePicture", profilePicture);

        // Send formData to backend
        await axios.post("/api/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(res => {
            if (res.status === 201 && res.data?.profileComplete) {
                toast.success("Profile created successfully!");
                updateUser({
                    profile: res.data.profile,
                    // profileComplete: true
                });
                // navigate to match page
                navigate("/matching");
            }
        }).catch(err => {
            if (err.response?.status === 409) {
                toast.error("You've already created a profile. If you want to edit your profile, go to the profile page.");
                // Fetch their profile
                try {
                    axios.get("/api/profile").then(res => {
                    if (res.status === 200) {
                        updateUser({
                            profile: res.data?.profile
                        });
                        navigate("/matching");
                    }
                    });
                } catch (err) {
                    console.log(err);
                }

                return navigate("/profile");
            }
            toast.error("Error creating profile");
            setErrors(err.response?.data);
        });
    };

    const tap = () => {
        navigate("/matching");
    }

    return (
        <div className={styles.createContainer}>
            <button onClick={tap}>Tap</button>
            <h2 className={styles.createHeader}>Welcome to Intrepid{user.name ? ", " + user.name : ""}</h2>
            <p>
                Please enter the following information to create your user profile and begin your matching experience
                {/* Your email is: {user.email} <br />
                and your date of birth is: {user.dateOfBirth} */}
            </p>

            {/* Display validation errors if any */}
            {errors && Object.keys(errors).length > 0 && (
                <div className="errorsContainer">
                    Validation Errors:
                    <ul className="errorsList">
                        {/* Check if it's a string or a nested object */}
                        {errors && typeof errors === "string" && <li className="errorItem">{errors}</li>}
                        {errors && typeof errors === "object" && Object.keys(errors).map(key => {
                            // If it's a nested object, loop through the keys and display the errors
                            if (typeof errors[key] === "object") {
                                return Object.keys(errors[key]).map(nestedKey => {
                                    return <li className="errorItem" key={nestedKey}>{errors[key][nestedKey]}</li>
                                })
                            }
                            return <li className="errorItem" key={key}>{errors[key]}</li>
                        })}
                    </ul>
                </div>
            )}

            <form className={styles.createForm} onSubmit={handleSubmit}>
                <div className={styles.interestsContainer}>
                    <h3 className={styles.formHeader}>Select Your Adventure Interests <Required /></h3>
                    <div className={styles.interestsForm}>
                        <select key="interests" name="interests" multiple value={formState?.interests} onChange={handleInterestChange} required>
                            {INTERESTS.map((interest, idx) => (
                                <option key={interest} value={interest}>
                                    {interest}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.genderContainer}>
                    <div className={styles.userGender}>
                        <h3 className={styles.formHeader}>Your Gender <Required /></h3>
                        <fieldset required>
                            <label>
                                <input
                                    key="male"
                                    className={styles.genderInput}
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formState.gender === "Male"}
                                    onChange={(e) => handleChange(e)}
                                />
                                Male
                            </label>

                            <label>
                                <input
                                    key="female"
                                    className={styles.genderInput}
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formState.gender === "Female"}
                                    onChange={(e) => handleChange(e)}
                                />
                                Female
                            </label>

                            <label>
                                <input
                                    key="non-binary"
                                    className={styles.genderInput}
                                    type="radio"
                                    name="gender"
                                    value="Non-binary"
                                    checked={formState.gender === "Non-binary"}
                                    onChange={(e) => handleChange(e)}
                                />
                                Non-binary
                            </label>

                            <label>
                                <input
                                    key="other"
                                    className={styles.genderInput}
                                    type="radio"
                                    name="gender"
                                    value="Other"
                                    checked={formState.gender === "Other"}
                                    onChange={(e) => handleChange(e)}
                                />
                                Other (transgender, gender-fluid, agender, etc.)
                            </label>
                        </fieldset>
                    </div>
                </div>

                <div className={styles.prefGender}>
                    <h3 className={styles.formHeader}>Preferred Dating Genders <Required /></h3>
                    <div>
                        <fieldset>
                            <legend>Choose all that apply</legend>
                            <label><input className={styles.genderInput} 
                            type="checkbox" 
                            name="preferences.gender" 
                            value="Male" 
                            checked={formState.preferences?.gender?.includes("Male")}
                            onChange={(ev) => handlePrefGenderChange(ev)} /> Male</label>
                            <label><input className={styles.genderInput} 
                            type="checkbox" 
                            name="preferences.gender" 
                            value="Female" 
                            checked={formState.preferences?.gender?.includes("Female")}
                            onChange={(ev) => handlePrefGenderChange(ev)} /> Female</label>
                            <label><input className={styles.genderInput} 
                            type="checkbox" 
                            name="preferences.gender" 
                            value="Non-binary" 
                            checked={formState.preferences?.gender?.includes("Non-binary")}
                            onChange={(ev) => handlePrefGenderChange(ev)} /> Non-binary</label>
                            <label><input className={styles.genderInput} 
                            type="checkbox" 
                            name="preferences.gender" 
                            value="Other" 
                            checked={formState.preferences?.gender?.includes("Other")}
                            onChange={(ev) => handlePrefGenderChange(ev)} /> Other (transgender, gender-fluid, agender, etc.)</label>
                        </fieldset>
                    </div>
                </div>

                <div className={styles.locationForm}>
                    <h3 className={styles.formHeader}>Where are you located? <Required /></h3>
                    <select className={styles.locationList}
                        name="location.state"
                        id="state"
                        value={formState.location?.state}
                        onChange={(e) => handleChange(e)}
                        required>
                        {STATES.map(state => (
                            <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <h3 className={styles.formHeader}>Tell us about yourself</h3>
                    <textarea className={styles.bioInput} name="bio" value={formState.bio} onChange={(e) => handleChange(e)} />
                </div>

                <div>
                    <h3 className={styles.formHeader}>Add a profile picture</h3>
                    {!!formState.profilePicture && (
                    <>
                        <div className={styles.profilePictureContainer}>
                            <img src={URL.createObjectURL?.(formState.profilePicture || "")} width="125" height="125" alt="Profile" />
                                <div className={styles.profilePictureControls}>
                                    <div>
                                        <label htmlFor="profilePictureCaption">Give your profile picture a caption</label>
                                        <input key="profilePictureCaption"
                                            className={styles.profilePictureCaption}
                                            type="text" name="profilePictureCaption"
                                            placeholder="Caption"
                                            onChange={(e) => setProfilePictureCaption(e.target.value)} />
                                    </div>
                                    <button onClick={e => handleRemoveImage(e)}>Remove Profile Picture</button>
                            </div>
                        </div>
                    </>)}
                    <label htmlFor="profilePicture" className={styles.profilePictureAddBtn}>
                        {formState.profilePictureName ? "Change Profile Picture" : "Add Profile Picture"}
                        <input type="file" id="profilePicture" name="profilePicture" onChange={(e) => handleImageChange(e)} style={{ display: "none" }} />
                    </label>
                </div>
                
                <div>
                    <h3 className={styles.formHeader}>Choose your preferred age range <Required /></h3>
                    <div className="flexDirectionRow justifyContentSpaceAround">
                        <div className="flexDirectionColumn">
                            <label htmlFor="minAge">Minimum: </label>
                            <input key="minAge" className={styles.numberInput}    
                            type="number" 
                            name="preferences.ageRange.min" 
                            id="minAge" 
                            min="18" 
                            max="99" 
                            value={formState.preferences.ageRange?.minAge} 
                            onChange={(e) => handleChange(e)}
                            required />
                        </div>
                        <div className="flexDirectionColumn">
                            <label htmlFor="maxAge">Maximum: </label>
                            <input key="maxAge" className={styles.numberInput} type="number" 
                            name="preferences.ageRange.max" 
                            id="maxAge" 
                            min="18" 
                            max="99" 
                            value={formState.preferences.ageRange?.maxAge} 
                            onChange={(e) => handleChange(e)}
                            required />
                        </div>
                    </div>
                </div>

                {/* TODO: Not sure what we're doing with this exactly */}
{/*                 <div>
                    <h3 className={styles.formHeader}>Choose your preferred distance <Required /></h3>
                    <label htmlFor="distance">Maximum Distance (mi.)</label>
                    <input className={styles.numberInput} type="number" name="preferences.distance" id="distance" min="1" max="100" value={formState.preferences.maxDistance} onChange={(e) => handleChange(e)} required />
                </div>
 */}
                <div className="flexDirectionRow">
                    <CTAButton type="submit" theme="green" onClick={handleSubmit}> Submit </CTAButton>
                    <CTAButton theme="white-border" onClick={(e) => logout(e)}> Logout </CTAButton>
                </div>
            </form>
            {/* <div style={{ height: "300px", width: "300px", overflow: "scroll" }}>{JSON.stringify(formState) ?? ''}</div> */}
        </div>
    );
}


const Required = () => <span className={styles.required}>*</span>;
