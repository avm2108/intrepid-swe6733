import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { MatchPage } from '../pages/MatchPage/index';

import { UserContext } from '../providers/UserProvider';
import axios from 'axios';

jest.mock('axios');

const user = {
    _id: 0,
    name: 'Heidi',
    dateOfBirth: "2001-01-01",
    email: "heidi@sample.com",
    faceBookId: null,
    instagramId: null,
    loggedIn: true,
    matches: [],
    profile: {
      bio: "test",
      gender: 'Female',
      interests: ['Archery', 'Camping'],
      location: {
        state: "HI",
        country: "USA",
        showOnProfile: true,
      },
      preferences: {
        gender: ['Male'],
        ageRange: {
          min: 20,
          max: 30
        },
        distance: 50
      },
      profilePicture: {
        file:'',
        caption: '',
        href: '',
        position: 0
      }
    },
    profileComplete: true
  }

  const matches = [
    {
      _id: 1,
      name: 'John',
      email: 'john@sample.com',
      interests: ['Hiking', 'Camping'],
    },
    {
      _id: 2,
      name: 'Sarah',
      email: "sarah@sample.com",
      interests: ['Traveling', 'Photography'],
    },
  ];

describe('MatchPage', () => {
  it('renders user profile', () => {
    render(
      <UserContext.Provider value={{ user }}>
      <MatchPage />
    </UserContext.Provider>
      );
    expect(screen.getByText('Begin Matching, Heidi')).toBeInTheDocument();
    expect(screen.getByText('Your profile:')).toBeInTheDocument();
    expect(screen.getByText(/22, female/i)).toBeInTheDocument();
    expect(screen.getByText('HI')).toBeInTheDocument();
    expect(screen.getByText('Archery, Camping')).toBeInTheDocument();
  });

  it('renders Start Here button', () => {
    render(
      <UserContext.Provider value={{ user }}>
      <MatchPage />
    </UserContext.Provider>

    );

    const button = screen.getByRole('button', { name: /start here/i });
    expect(button).toBeInTheDocument();
  });

  // it('should show MatchesDisplay modal when the button is clicked', async () => {
  //   axios.get.mockResolvedValueOnce({ data: matches });
  //   render(
  //     <UserContext.Provider value={{ user }}>
  //       <MatchPage />
  //     </UserContext.Provider>
  //   );
  //   const button = screen.getByRole('button', { name: /start here/i });
  //   fireEvent.click(button);
  //   await waitFor(() => {
  //     const modalTitle = screen.getByText(/intrepid recommends:/i);
  //     expect(modalTitle).toBeInTheDocument();
  //   });
  // });

  // it('closes the modal when clicked outside the modal area', () => {
  //   render(<MatchPage />);
  //   const button = screen.getByRole('button', { name: /start here/i });
  //   fireEvent.click(button);

  //   try {
  //     const modalBackground = screen.getByTestId('modal-background');
  //   } catch (error) {
  //     console.log(error)
  //   }

  //   // const modalBackground = screen.getByTestId('modal-background');
  //   fireEvent.click(modalBackground);

  //   try {
  //   const modal = screen.queryByText(/Intrepid recommends:/i);
  //   expect(modal).not.toBeInTheDocument();      

  //   } catch (error) {
  //     console.log(error)
  //   }    
  //   // const modal = screen.queryByText(/Intrepid recommends:/i);
  //   // expect(modal).not.toBeInTheDocument();
  // });  
});
