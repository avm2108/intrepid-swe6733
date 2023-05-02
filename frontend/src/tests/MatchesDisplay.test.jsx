import React from 'react';
import { render, screen, fireEvent, cleanup  } from '@testing-library/react';
import { MatchesDisplay } from '../pages/MatchPage/MatchesDisplay';

const matches = [
  {
    "_id": "64500ad59a3276987bb06025",
    "email": "emma@example.com",
    "dateOfBirth": "Thu Apr 01 1993 00:00:00 GMT-1000 (Hawaii-Aleutian Standard Time)",
    "name": "Emma Johnson",
    "profile": {
        "gender": "Female",
        "location": {
            "city": "New York",
            "state": "NY",
            "country": "USA",
            "showOnProfile": true
        },
        "profilePicture": {
            "file": "",
            "href": "https://source.unsplash.com/random/600x800/?office+male",
            "position": 0,
            "caption": "This is my profile picture"
        },
        "bio": "I'm a dummy user",
        "interests": [
            "Traveling"
        ],
        "preferences": {
            "gender": [
                "Male",
                "Female",
                "Non-binary"
            ],
            "ageRange": {
                "min": 18,
                "max": 99
            },
            "distance": 500
        }
    },
    "profileComplete": true
},
{
    "_id": "64500ad59a3276987bb06026",
    "email": "noah@example.com",
    "dateOfBirth": "Sun Mar 22 1998 00:00:00 GMT-1000 (Hawaii-Aleutian Standard Time)",
    "name": "Noah Smith",
    "profile": {
        "gender": "Non-binary",
        "location": {
            "city": "New York",
            "state": "NY",
            "country": "USA",
            "showOnProfile": true
        },
        "profilePicture": {
            "file": "",
            "href": "https://source.unsplash.com/random/600x800/?office+female",
            "position": 0,
            "caption": "This is my profile picture"
        },
        "bio": "I'm a dummy user",
        "interests": [
            "Whitewater Rafting"
        ],
        "preferences": {
            "gender": [
                "Male",
                "Female",
                "Non-binary"
            ],
            "ageRange": {
                "min": 18,
                "max": 99
            },
            "distance": 500
        }
    },
    "profileComplete": true
},
{
    "_id": "64500ad69a3276987bb06028",
    "email": "olivia@example.com",
    "dateOfBirth": "Wed Feb 02 1994 00:00:00 GMT-1000 (Hawaii-Aleutian Standard Time)",
    "name": "Olivia Davis",
    "profile": {
        "gender": "Female",
        "location": {
            "city": "New York",
            "state": "HI",
            "country": "USA",
            "showOnProfile": true
        },
        "profilePicture": {
            "file": "",
            "href": "https://source.unsplash.com/random/600x800/?office+female",
            "position": 0,
            "caption": "This is my profile picture"
        },
        "bio": "I'm a dummy user",
        "interests": [
            "Archery"
        ],
        "preferences": {
            "gender": [
                "Male",
                "Female",
                "Non-binary"
            ],
            "ageRange": {
                "min": 18,
                "max": 99
            },
            "distance": 500
        }
    },
    "profileComplete": true
},
];

describe('MatchesDisplay', () => {

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });  


  // it('renders the prospect image, details, and rating', async () => {
  //   const mockImage = 'https://source.unsplash.com/random/600x800/?office+male';
  //   jest.spyOn(global, 'fetch').mockImplementation(() =>
  //     Promise.resolve({ url: mockImage })
  //   );
  //   render(<MatchesDisplay matches={matches} />);
  //   const image = await screen.findByRole('img', {  name: /prospect/i});
  //   expect(image).toBeInTheDocument();
  //   expect(image.src).toBe(mockImage);
  //   expect(screen.getByText(matches[0].prospect.name)).toBeInTheDocument();
  //     expect(screen.getByText(`${matches[0].prospect?.profile?.location.state}, ${matches[0].prospect?.profile?.location.country}`)).toBeInTheDocument();
  //     expect(screen.getByText('Interests:')).toBeInTheDocument();
  //     expect(screen.getByText(matches[0].prospect.profile.interests.join(', '))).toBeInTheDocument();
  //     expect(screen.getByText(`${matches[0].rating}`)).toBeInTheDocument();    
  //   global.fetch.mockRestore();
  // });


  // it('displays the next prospect when the Next > button is clicked', async () => {
  //   const mockImage = 'https://source.unsplash.com/random/600x800/?office+male';
  //   jest.spyOn(global, 'fetch').mockImplementation(() =>
  //     Promise.resolve({ url: mockImage })
  //   );
  // render(<MatchesDisplay matches={matches} />);

  //   fireEvent.click(screen.getByRole('button', { name: 'Next >' }));

  //   const image = await screen.findByAltText('Prospect');
  //   expect(image).toBeInTheDocument();
  //   expect(image.src).toBe(mockImage);
  //   expect(screen.getByText(matches[1].prospect.name)).toBeInTheDocument();
  //     expect(screen.getByText(`${matches[1].prospect.age}, ${matches[1].prospect.gender}`)).toBeInTheDocument();
  //     expect(screen.getByText(`${matches[1].prospect.city}, ${matches[1].prospect.state} ${matches[1].prospect.country}`)).toBeInTheDocument();
  //     expect(screen.getByText('Interests:')).toBeInTheDocument();
  //     expect(screen.getByText(matches[1].prospect.interests.join(', '))).toBeInTheDocument();
  //     expect(screen.getByText(`${matches[1].rating}`)).toBeInTheDocument();    
  //   global.fetch.mockRestore();

  // });


  // it('displays the previous prospect when the < Prev button is clicked', async () => {
  //   const mockImage = 'https://source.unsplash.com/random/600x800/?office+male';
  //   jest.spyOn(global, 'fetch').mockImplementation(() =>
  //     Promise.resolve({ url: mockImage })
  //   );
  // render(<MatchesDisplay matches={matches} />);

  //   fireEvent.click(screen.getByRole('button', { name: 'Next >' }));
  //   fireEvent.click(screen.getByRole('button', { name: '< Prev' }));
  //   const image = await screen.findByAltText('Prospect');
  //   expect(image).toBeInTheDocument();
  //   expect(image.src).toBe(mockImage);
  //   expect(screen.getByText(matches[0].prospect.name)).toBeInTheDocument();
  //     expect(screen.getByText(`${matches[0].prospect.age}, ${matches[0].prospect.gender}`)).toBeInTheDocument();
  //     expect(screen.getByText(`${matches[0].prospect.city}, ${matches[0].prospect.state} ${matches[0].prospect.country}`)).toBeInTheDocument();
  //     expect(screen.getByText('Interests:')).toBeInTheDocument();
  //     expect(screen.getByText(matches[0].prospect.interests.join(', '))).toBeInTheDocument();
  //     expect(screen.getByText(`${matches[0].rating}`)).toBeInTheDocument();    
  //   global.fetch.mockRestore();

  // });


  it('displays an error message when the image fails to load', async () => {
    const mockImage = 'https://source.unsplash.com/random/600x800/?office+male';
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to load image'));
    render(<MatchesDisplay matches={matches}/>);
    const errorText = await screen.findByText('Failed to load image...');
    expect(errorText).toBeInTheDocument();
  });


});
