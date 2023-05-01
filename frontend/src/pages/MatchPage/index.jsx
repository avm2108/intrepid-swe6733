
import React, { useState, useContext, useEffect } from 'react';
import { MatchesDisplay } from './MatchesDisplay';
import { matchAlgo } from './matchAlgo';
// import { prospectsArray } from './prospectsArray';
import { styles } from './matchPageStyles';
import CTAButton from '../../components/CTAButton';
import { UserContext } from '../../providers/UserProvider';
import axios from "axios";



export function MatchPage() {
  

  const { user } = useContext(UserContext);
  const { profile } = user;

  const calcAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age
  }

  

  // const user = {
  //   id: 0,
  //   name: 'Heidi',
  //   age: 32,
  //   gender: 'Female',
  //   city: 'Los Angeles',
  //   state: 'CA',
  //   country: 'USA',
  //   interests: [
  //     'reading',
  //     'writing',
  //     'yoga',
  //     'traveling',
  //     'cooking',
  //     'learning new things',
  //     'photography',
  //   ],
  // }

  const [matches, setMatches] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleMatch = async () => {
    // TODO: redux/saga api call to pull prospectsArray
    // TODO: redux/saga api call to pull user pref data for matchAlgo args
    // TODO: matchAlgo may include more args per user prefs for age/gender/proximity

    var newMatches 

    await axios.get("/api/matches/prospects").then(res => {
  
      if (res.data) {

        const prospectsArray = res.data
        
        const userEmail = user.email;
        const userDateOfBirth = user.dateOfBirth;

        const index = prospectsArray.findIndex(obj => obj.email === userEmail && obj.dateOfBirth === userDateOfBirth);
        if (index !== -1) {
          prospectsArray.splice(index, 1);
        }

        newMatches = matchAlgo(user, prospectsArray);
      }
      
  
  }).catch(err => {
      console.log(err.response?.data);
  });

    setMatches(newMatches);
    handleOpenModal();
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
      <div style={styles.card}>
        <div style={styles.container}>
          <h1 style={styles.h1}>Begin Matching, {user?.name}</h1>
          <h2 style={styles.name}>Your profile:</h2>
          <p style={styles.text}>{calcAge(user?.dateOfBirth)}, {profile?.gender}</p>
          <p style={styles.text}>
            {profile?.location.state} 
          </p>
          <p style={{ marginBottom: '0px', }}>Interests:</p>
          <p style={styles.interestsText}>{profile?.interests.length > 1 ? profile?.interests.join(', ') : profile?.interests}</p>
          <button style={{ ...styles.button, margin: 5 }} onClick={handleMatch}>
            Start Here
          </button>
          {matches.length > 0 && showModal && (
            <div style={styles.modal}>
              <MatchesDisplay matches={matches} />
            </div>
          )}
          {showModal && (
            <div
              data-testid="modal-background"
              style={styles.modalBackground}
              onClick={handleClose}
            ></div>
          )}
        </div>
      </div>
  );
}
