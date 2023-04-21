
import React, { useState } from 'react';
import { MatchesDisplay } from './MatchesDisplay';
import { matchAlgo } from './matchAlgo';
import { prospectsArray } from './prospectsArray';
import { styles } from './matchPageStyles';
import CTAButton from '../../components/CTAButton';


export function MatchPage() {
  // TODO: redux/saga api call to pull current user data
  const user = {
    id: 0,
    name: 'Heidi',
    age: 32,
    gender: 'Female',
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

  const [matches, setMatches] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleMatch = () => {
    // TODO: redux/saga api call to pull prospectsArray
    // TODO: redux/saga api call to pull user pref data for matchAlgo args

    // TODO: matchAlgo may include more args per user prefs for age/gender/proximity
    const newMatches = matchAlgo(user, prospectsArray);
    // console.log("*** newMatches: ", newMatches)
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
          <h1 style={styles.h1}>Begin Matching, {user.name}</h1>
          <h2 style={styles.name}>Your profile:</h2>
          <p style={styles.text}>{user.age}, {user.gender}</p>
          <p style={styles.text}>
            {user.city}, {user.state} {user.country}
          </p>
          <p style={{ marginBottom: '0px', }}>Interests:</p>
          <p style={styles.interestsText}>{user.interests.join(', ')}</p>
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
