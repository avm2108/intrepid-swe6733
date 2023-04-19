import React from 'react';
import { render, screen, fireEvent, cleanup  } from '@testing-library/react';
import { MatchesDisplay } from './MatchesDisplay';

const matches = [
  {
    prospect: {
      id: 1,
      name: 'Liam',
      age: 34,
      gender: 'male',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      interests: [
        'traveling',
        'photography',
        'music',
        'reading',
        'learning new things',
        'hiking',
        'cooking',
      ],
    },
    rating: "Next...(Match rating: 0/3)"
  },
  {
    prospect: {
      id: 2,
      name: 'Elsa',
      age: 25,
      gender: 'female',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      interests: ['yoga', 'meditation', 'painting', 'gardening'],
    },
    rating:"Next...(Match rating: 0/3)"
  },
];

describe('MatchesDisplay', () => {

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });  

  // it('displays the prospect details and rating', () => {
  //   render(<MatchesDisplay matches={matches} />);
  //   expect(screen.getByText(matches[0].prospect.name)).toBeInTheDocument();
  //   expect(screen.getByText(`${matches[0].prospect.age}, ${matches[0].prospect.gender}`)).toBeInTheDocument();
  //   expect(screen.getByText(`${matches[0].prospect.city}, ${matches[0].prospect.state} ${matches[0].prospect.country}`)).toBeInTheDocument();
  //   expect(screen.getByText('Interests:')).toBeInTheDocument();
  //   expect(screen.getByText(matches[0].prospect.interests.join(', '))).toBeInTheDocument();
  //   expect(screen.getByText(`${matches[0].rating}`)).toBeInTheDocument();
   
  // });

  // it('displays the next prospect when the Next > button is clicked', () => {
  // render(<MatchesDisplay matches={matches} />);
  //   fireEvent.click(screen.getByRole('button', { name: 'Next >' }));
  //   expect(screen.getByText(matches[1].prospect.name)).toBeInTheDocument();
  // });

  // it('displays the previous prospect when the < Prev button is clicked', () => {
  // render(<MatchesDisplay matches={matches} />);
  //   fireEvent.click(screen.getByRole('button', { name: 'Next >' }));
  //   fireEvent.click(screen.getByRole('button', { name: '< Prev' }));
  //   expect(screen.getByText(matches[0].prospect.name)).toBeInTheDocument();
  // });


  it('renders the prospect image, details, and rating', async () => {
    const mockImage = 'https://source.unsplash.com/random/600x800/?office+male';
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({ url: mockImage })
    );
    render(<MatchesDisplay matches={matches} />);
    const image = await screen.findByAltText('Prospect');
    expect(image).toBeInTheDocument();
    expect(image.src).toBe(mockImage);
    expect(screen.getByText(matches[0].prospect.name)).toBeInTheDocument();
      expect(screen.getByText(`${matches[0].prospect.age}, ${matches[0].prospect.gender}`)).toBeInTheDocument();
      expect(screen.getByText(`${matches[0].prospect.city}, ${matches[0].prospect.state} ${matches[0].prospect.country}`)).toBeInTheDocument();
      expect(screen.getByText('Interests:')).toBeInTheDocument();
      expect(screen.getByText(matches[0].prospect.interests.join(', '))).toBeInTheDocument();
      expect(screen.getByText(`${matches[0].rating}`)).toBeInTheDocument();    
    global.fetch.mockRestore();
  });


  it('displays the next prospect when the Next > button is clicked', async () => {
    const mockImage = 'https://source.unsplash.com/random/600x800/?office+male';
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({ url: mockImage })
    );
  render(<MatchesDisplay matches={matches} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next >' }));

    const image = await screen.findByAltText('Prospect');
    expect(image).toBeInTheDocument();
    expect(image.src).toBe(mockImage);
    expect(screen.getByText(matches[1].prospect.name)).toBeInTheDocument();
      expect(screen.getByText(`${matches[1].prospect.age}, ${matches[1].prospect.gender}`)).toBeInTheDocument();
      expect(screen.getByText(`${matches[1].prospect.city}, ${matches[1].prospect.state} ${matches[1].prospect.country}`)).toBeInTheDocument();
      expect(screen.getByText('Interests:')).toBeInTheDocument();
      expect(screen.getByText(matches[1].prospect.interests.join(', '))).toBeInTheDocument();
      expect(screen.getByText(`${matches[1].rating}`)).toBeInTheDocument();    
    global.fetch.mockRestore();

  });


  it('displays the previous prospect when the < Prev button is clicked', async () => {
    const mockImage = 'https://source.unsplash.com/random/600x800/?office+male';
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({ url: mockImage })
    );
  render(<MatchesDisplay matches={matches} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next >' }));
    fireEvent.click(screen.getByRole('button', { name: '< Prev' }));
    const image = await screen.findByAltText('Prospect');
    expect(image).toBeInTheDocument();
    expect(image.src).toBe(mockImage);
    expect(screen.getByText(matches[0].prospect.name)).toBeInTheDocument();
      expect(screen.getByText(`${matches[0].prospect.age}, ${matches[0].prospect.gender}`)).toBeInTheDocument();
      expect(screen.getByText(`${matches[0].prospect.city}, ${matches[0].prospect.state} ${matches[0].prospect.country}`)).toBeInTheDocument();
      expect(screen.getByText('Interests:')).toBeInTheDocument();
      expect(screen.getByText(matches[0].prospect.interests.join(', '))).toBeInTheDocument();
      expect(screen.getByText(`${matches[0].rating}`)).toBeInTheDocument();    
    global.fetch.mockRestore();

  });


  it('displays an error message when the image fails to load', async () => {
    const mockImage = 'https://source.unsplash.com/random/600x800/?office+male';
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to load image'));
    render(<MatchesDisplay matches={matches}/>);
    const errorText = await screen.findByText('Failed to load image...');
    expect(errorText).toBeInTheDocument();
  });


});
