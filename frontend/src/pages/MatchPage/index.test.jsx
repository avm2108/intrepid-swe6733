import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { MatchPage } from './index';

describe('MatchPage', () => {
  it('renders user profile', () => {
    render(<MatchPage />);
    expect(screen.getByText('Begin Matching, Heidi')).toBeInTheDocument();
    expect(screen.getByText('Your profile:')).toBeInTheDocument();
    expect(screen.getByText('32, female')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles, CA USA')).toBeInTheDocument();
    expect(screen.getByText('reading, writing, yoga, traveling, cooking, learning new things, photography')).toBeInTheDocument();
  });

  it('renders Start Here button', () => {
    render(<MatchPage />);

    const button = screen.getByRole('button', { name: /start here/i });
    expect(button).toBeInTheDocument();
  });

  it('should show MatchesDisplay modal when the button is clicked', () => {
    render(<MatchPage />);
    const button = screen.getByRole('button', { name: /start here/i });
    fireEvent.click(button);
    const modal = screen.getByText(/Intrepid recommends:/i);
    expect(modal).toBeInTheDocument();
  });

  it('closes the modal when clicked outside the modal area', () => {
    render(<MatchPage />);
    const button = screen.getByRole('button', { name: /start here/i });
    fireEvent.click(button);
    const modalBackground = screen.getByTestId('modal-background');
    fireEvent.click(modalBackground);
    const modal = screen.queryByText(/Intrepid recommends:/i);
    expect(modal).not.toBeInTheDocument();
  });  
});
