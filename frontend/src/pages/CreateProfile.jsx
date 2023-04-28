import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import axios from "axios";
import toast from "react-hot-toast";
import styles from './CreateProfile.module.css';
import CTAButton from "../components/CTAButton";

const INTERESTS = [
    "Archery", "Backpacking", "Biking", "Boating", "Camping", "Climbing", "Fishing", "Golfing", "Hiking", "Hunting", "Kayaking", "Mountain Biking", "Paddling",
    "Paragliding", "Photography", "Rafting", "Rock Climbing", "Snowshoeing", "Surfing", "Sailing", "Scuba Diving", "Skiing", "Snowboarding", "Snowmobiling",
    "Swimming", "Tennis", "Trail Running", "Traveling", "Wakeboarding", "Water Skiing", "Whitewater Rafting", "Windsurfing", "Volleyball", "Yoga", "Ziplining",
];

const states = [ 
    { value: '', label: 'Select a state' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'DC', label: 'District Of Columbia' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];

// This is only to for demonstration purposes to show
// how the image upload works, and how data can be pulled
// from the user context. it doesn't have all the proper fields or validation
// TODO: We need to detect if a user has already "created" their profile and
// if so don't show this page, instead redirect them to their view/edit profile page
export default function CreateProfile(props) {
    const { user, updateUser, logout } = useContext(UserContext);

    const [errors, setErrors] = useState({});
    const [ selectedState, setSelectedState ] = useState('')
    const [ selectedInterests, setSelectedInterests ] = useState([]);
    const [ userGender, setUserGender ] = useState('');
    const [ preferredGender, setPreferredGender ] = useState('');

    const [formState, setFormState] = useState({
        bio: "",
        gender: "",
        location: {
            city: "",
            state: "",
            country: ""
        },
        profilePicture: null, // Represents the actual file object
        profilePictureName: "",
        profilePictureCaption: "",
        interests: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // If it's a nested key (e.g. location.city), split it into an array and use the first element as the parent key
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormState(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: value
                }
            }));
            return;
        }
        setFormState({ ...formState, [name]: value });
    }

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        setFormState({ ...formState, profilePicture: files[0], profilePictureName: files[0].name });
    }

    const handleRemoveImage = () => {
        setFormState({ ...formState, profilePicture: null, profilePictureName: "", profilePictureCaption: "" });
    }

    const handleInterestChange = (ev) => {
        const value = ev.target.value;

        setSelectedInterests((selectedInterests) => {
            if (selectedInterests.includes(value)) {
              return selectedInterests.filter((interest) => interest !== value);
            } else {
              return [...selectedInterests, value];
            }
          });
    }

   const handleUserGenderChange = (event) => {
        setUserGender(event.target.value);
    }

    const handlePrefGenderChange = (event) => {
        setPreferredGender(event.target.value);
    }

/*     const handleImageChange = (e) => {
        const { name, files } = e.target;

        const filesToUpload = [...Array.from(files)];
        // Ensure it's an image 
        for (let i = 0; i < filesToUpload.length; i++) {
            console.log(filesToUpload[i].type, filesToUpload[i].name)
            if (!filesToUpload[i].type.includes("image") || !filesToUpload[i].name.match(/\.(jpg|jpeg|png)$/)) {
                // Remove the file from the array
                filesToUpload.splice(i, 1);
                toast.error("Please upload an image file (jpg, jpeg, or png)");
            }
        }

        setFormState((prevState) => ({ ...prevState, profilePictures: [...prevState.profilePictures, ...filesToUpload] }));
    }

    const handleImageRemove = index => {
        const profilePictures = [...formState.profilePictures];
        profilePictures.splice(index, 1);
        setFormState(prevState => ({ ...prevState, profilePictures: profilePictures }));
    }; */

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
        
        // Append profile pictures to formData
/*         profilePictures.forEach((picture, index) => {
            formData.append(`profilePictures`, picture);
        }); */

        // Send formData to backend
        await axios.post("/api/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                toast.success("Profile created successfully!");
                // navigate to match page/dashboard
                console.log(res);
            }).catch(err => {
                toast.error("Error creating profile");
                setErrors(err.response.data);
            });
    };

    return (
        <div className={styles.createContainer}>
            <h2 className={styles.createHeader}>Welcome to Intrepid, {user.name ?? ""}</h2>
            <p>
                Please enter the following information to create your user profile and begin your matching experience
                {/* Your email is: {user.email} <br />
                and your date of birth is: {user.dateOfBirth} */}
            </p>

            <div className={styles.interestsContainer}>
                <h3 className={styles.formHeader}>Select Your Adventure Interests</h3>
                <form className={styles.interestsForm}>
                        <select multiple value={selectedInterests} onChange={handleInterestChange}>
                            {INTERESTS.map((interest) => (
                                <option key={interest} value={interest}>
                                {interest}
                                </option>
                            ))}
                        </select>
                </form>
            </div>

            <div className={styles.genderContainer}>
                <form className={styles.userGender}>
                    <h3 className={styles.formHeader}>Your Gender </h3>
                        <div>
                        <label>
                            <input
                            className={styles.genderInput}
                            type="radio"
                            value="male"
                            checked={userGender === "male"}
                            onChange={handleUserGenderChange}
                            />
                            Male
                        </label>

                        <label>
                            <input
                            className={styles.genderInput}
                            type="radio"
                            value="female"
                            checked={userGender === "female"}
                            onChange={handleUserGenderChange}
                            />
                            Female
                        </label>

                        <label>
                            <input
                            className={styles.genderInput}
                            type="radio"
                            value="other"
                            checked={userGender === "other"}
                            onChange={handleUserGenderChange}
                            />
                            Other/Non-binary
                        </label>
                        </div>
                </form>

                <form className={styles.prefGender}>
                <h3 className={styles.formHeader}>Preferred Dating Gender </h3>
                        <div>
                        <label>
                            <input
                            className={styles.genderInput}
                            type="radio"
                            value="male"
                            checked={preferredGender === "male"}
                            onChange={handlePrefGenderChange}
                            />
                            Male
                        </label>

                        <label>
                            <input
                            className={styles.genderInput}
                            type="radio"
                            value="female"
                            checked={preferredGender === "female"}
                            onChange={handlePrefGenderChange}
                            />
                            Female
                        </label>

                        <label>
                            <input
                            className={styles.genderInput}
                            type="radio"
                            value="other"
                            checked={preferredGender === "other"}
                            onChange={handlePrefGenderChange}
                            />
                            Other/Non-binary
                        </label>
                        </div>
                </form>
            </div>

            <div className={styles.locationForm}>
            <h3 className={styles.formHeader}>Where are you located?</h3>
                <select 
                    className={styles.locationList}
                    id="state" 
                    value={selectedState} 
                    onChange={(ev) => setSelectedState(ev.target.value)}
                >
                    {states.map(state => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                    ))}
                </select>
            </div>

            {/* Breakpoint for new and old styles */}
            <button onClick={(e) => logout(e)}>
                Logout
            </button>
            {JSON.stringify(formState) ?? ''}
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
            <form onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data" style={{ height: "45vh", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                {/* Show profile fields */}
                <div>
                    <label htmlFor="gender">Gender</label>
                    <input type="text" name="gender" defaultValue={formState.gender} onChange={(e) => handleChange(e)} />
                </div>
                <div>
                    Location:
                    <div>
                        <label htmlFor="location.city">City</label>
                        <input type="text" name="location.city" defaultValue={formState.location?.city} onChange={(e) => handleChange(e)} />
                        <label htmlFor="location.state">State</label>
                        <input type="text" name="location.state" defaultValue={formState.location?.state} onChange={(e) => handleChange(e)} />
                        <label htmlFor="location.country">Country</label>
                        <input type="text" name="location.country" defaultValue={formState.location?.country} onChange={(e) => handleChange(e)} />
                    </div>
                </div>
                <div>
                    {!!formState.profilePicture && <img src={URL.createObjectURL?.(formState.profilePicture || "")} width="125" height="125" alt="Profile" />}
                    {!!formState.profilePicture && <input type="text" name="profilePictureCaption" placeholder="Caption" onChange={(e) => handleChange(e)} />}
                    <label htmlFor="profilePicture" style={{ border: "1px solid black", cursor: "pointer", padding: "5px" }}>Add Profile Picture
                        <input type="file" id="profilePicture" name="profilePicture" onChange={(e) => handleImageChange(e)} style={{ display: "none" }} />
                    </label>
                    {formState.profilePicture && <button onClick={e => handleRemoveImage(e)}>X</button>}
                    {/* TODO: We need to support multiple photo uploads */}
{/*                     <div>
                        <label htmlFor="profilePictures" style={{ border: "1px solid black", cursor: "pointer", padding: "5px" }}
                        >Add Profile Pictures</label>
                        <input
                            type="file"
                            id="profilePictures"
                            name="profilePictures"
                            multiple
                            accept=".jpg,.jpeg,.png, image/jpeg, image/png, image/jpg"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        <p>You added {formState.profilePictures?.length || 0} profile pictures</p>
                        {formState.profilePictures?.length > 0 && (
                            <ul>
                                {formState.profilePictures?.map?.((picture, index) => (
                                    <li key={index}>
                                        {/* Allow the user to preview the image before uploading */}
                                        {/* <img src={URL.createObjectURL(picture)} width="125" height="125" alt={picture?.name} /> */}
                                        {/* <button type="button" onClick={() => handleImageRemove(index)}> */}
                                            {/* Remove */}
                                        {/* </button> */}
                                    {/* </li> */}
                                {/* ))} */}
                            {/* </ul> */}
                        {/* )} */}
                    {/* </div> **/} 
                </div>
                <CTAButton type="submit" theme="green" onClick={handleSubmit}> Submit </CTAButton>
                <CTAButton theme="white-border" onClick={(e) => logout(e)}> Logout </CTAButton>
                {/* <button type="submit" onClick={handleSubmit}>Submit</button> */}
            </form>
        </div>
    );
}
