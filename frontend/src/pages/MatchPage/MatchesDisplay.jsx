import React, { useState, useEffect } from 'react';
import { modalStyles as styles } from './matchPageStyles';
import { Helmet } from 'react-helmet';


export const MatchesDisplay = ({ matches }) => {

  const [currentProspectIndex, setCurrentProspectIndex] = useState(0);
  const [prospectImage, setProspectImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);
  
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

  const isFirstProspect = currentProspectIndex === 0;
  const isLastProspect = currentProspectIndex === matches.length - 1;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // TODO: later update getProspectImage by currentProspect.id 
        const image = await getProspectImage(currentProspect.gender);
        setProspectImage(image);
      } catch (error) {
        setIsImageError(true);
      }
      setIsLoading(false);
    };
    fetchImage();
  }, [currentProspect.gender]);

  return (
    <><Helmet>
      <title>Intrepid - Match Page</title>
      <script src="https://kit.fontawesome.com/37ce2b2559.js" crossorigin="anonymous"></script>
    </Helmet>
    <div style={styles.container}>
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
          <div style={styles.column}>
            <img
              style={styles.image}
              src={prospectImage}
              alt="Prospect"
            />
          </div>
        )}
        <div style={styles.column}>
          <div style={styles.card }>
            <div style={styles.cardBody}>
              <p style={styles.name}>{currentProspect.name}</p>
              <p style={styles.text}>
                {currentProspect.age}, {currentProspect.gender}
              </p>
              <p style={styles.text}>
                {currentProspect.city}, {currentProspect.state}{' '}
                {currentProspect.country}
              </p>
              <p style={{ marginBottom: '0px' }}>Interests:</p>
              <p style={styles.interestsText}>
                {currentProspect.interests.join(', ')}
              </p>

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
          </div>
        </div>
      </div></>

  );
};

