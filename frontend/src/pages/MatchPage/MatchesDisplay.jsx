import React, { useState, useEffect } from 'react';
import { modalStyles as styles } from './matchPageStyles';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import toast from "react-hot-toast";



export const MatchesDisplay = ({ matches }) => {

  // console.log("** matches:", matches)

  const [currentProspectIndex, setCurrentProspectIndex] = useState(0);
  const [prospectImage, setProspectImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);
  
  const calcAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age
  }

  // TODO: redux/saga api call to pull prospect profile based on id passed via matches prop 
  const currentProspect = matches[currentProspectIndex].prospect;
  

  // TODO: this is temporary for image area; redux/saga api call to pull prospect image
  const getProspectImage = async gender => {
    const response = await fetch(
      `https://source.unsplash.com/random/600x800/?office+${gender}`,
    );
    return response.url;
  };

  const handleNext = () => {
    setIsLoading(true);
    setProspectImage('');
    if (currentProspectIndex < matches.length - 1) {
      setCurrentProspectIndex(currentProspectIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsLoading(true);
    if (currentProspectIndex > 0) {
      setCurrentProspectIndex(currentProspectIndex - 1);
    }
  };


  const handleLike = async () => {

    let data = {
      user2: currentProspect._id
    }

    try {
    const res = await axios.post("/api/matches", data)
    console.log(res.data)
    toast.success("Added to Favorites!");
  } catch(err) {
      console.log(err.response?.data);
  };
  };

  const isFirstProspect = currentProspectIndex === 0;
  const isLastProspect = currentProspectIndex === matches.length - 1;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // TODO: later update getProspectImage by currentProspect.id 
        const image = await getProspectImage(currentProspect.profile?.gender);
        setProspectImage(image);
      } catch (error) {
        setIsImageError(true);
      }
      setIsLoading(false);
    };
    fetchImage();
  }, [currentProspectIndex]);

  return (
    <>
    <Helmet>
      <title>Intrepid - Match Page</title>
      <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
    </Helmet>
    <h4 style={styles.h4}>Home - Matching</h4>
        {isLoading ? (
          <div style={styles.column}>
            Summoning
            <br />
            image...
          </div>
        ) : isImageError ? (
          <div style={styles.column}>
            Failed to load image...
          </div>
        ) : (
          <div className='card-container' style={styles.column}>
            <img
              style={styles.image}
              src={prospectImage}
              alt="Prospect"
            />

            <div style={styles.prospectInfo}>
              <p style={styles.name}>{currentProspect.name}</p>
              <p style={styles.text}>
                {calcAge(currentProspect.dateOfBirth)}, {currentProspect.profile?.gender}
              </p>
              <p style={styles.text}>
                {currentProspect.profile?.location.state}{', '}
                {currentProspect.profile?.location.country}
              </p>
              <p style={{ color: 'white', fontSize: '16px', marginBottom: '0px' }}>Interests:</p>
              <p style={styles.interestsText}>
                {/* {currentProspect.interests.join(', ')} */}


                {currentProspect.profile?.interests.length > 1 ? currentProspect.profile?.interests.join(', ') : currentProspect.profile?.interests}
              </p>
              </div>
          </div>
        )}
        <div className='recommend-container' style={styles.column}>
              <div style={styles.recommendContainer}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{...styles.recommendText, margin:0}}>
                  Intrepid recommends:
                  </p>
                  <p style={{...styles.recommendText, marginTop:0}}>
                  {matches[currentProspectIndex].rating}
                </p>
                </div>
              </div>
              <div style={styles.buttonContainer}>
                <button
                  style={{
                    ...styles.buttonPrev,
                    marginRight: '10px',
                    opacity: isFirstProspect ? 0.5 : 1,
                  }}
                  disabled={isFirstProspect}
                  onClick={handlePrev}
                >
                  &lt; Prev
                </button>
                {/* TODO: add feature to add prospect to favorites */}
                <i
                  title="Click to add to favorites"
                  className="fas fa-fire fa-3x"
                  style={{ cursor: 'pointer', color: '#FFA500' }}
                  onClick={handleLike}
                ></i>
                &nbsp;&nbsp;&nbsp;
                <button
                  style={{
                    ...styles.buttonNext,
                    opacity: isLastProspect ? 0.5 : 1,
                  }}
                  disabled={isLastProspect}
                  onClick={handleNext}
                >
                  Next &gt;
                </button>
              </div>
          </div>
          
      </>

  );
};

