import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserProvider from '../providers/UserProvider';
import GuestHome from './GuestHome';
import userEvent from '@testing-library/user-event';

jest.mock('react-hot-toast');

const MockGuestHome = () => {
    const mockUser = ({
        _id: null,
        loggedIn: false,
        name: null,
        email: null,
        dateOfBirth: null,
        csrfToken: null,
        profile: {
            gender: null,
            location: {
                city: null,
                state: null,
                country: null,
            },
            bio: null,
            interests: [],
            preferences: {
                gender: [],
                ageRange: {
                    min: null,
                    max: null,
                },
                distance: null,
            },
            profilePictures: [],
        },
        // Temporary representation of the user's social media accounts
        facebookId: null,
        instagramId: null,
        matches: [],
    });

    return (
        <BrowserRouter>
            <UserProvider user={mockUser}>
                <GuestHome />
            </UserProvider>
        </BrowserRouter>
    )
};


describe('GuestHome Page', () => {  
    it('renders guest home page title', () => {
        render(
            <MockGuestHome />
        )
        expect(screen.getByRole('heading', { name: /intrepid/i })).toBeInTheDocument()
    });

    it('renders guest home punch line', () => {
        render(
            <MockGuestHome />
        )
        expect(screen.getByRole('heading', { name: /where adventurers connect/i })).toBeInTheDocument()
    });

    it('renders guest home page brief description', () => {
        render(
            <MockGuestHome />
        )
        expect(screen.getByText(/our dating app is great for connecting with adventurers just like yourself!/i)).toBeInTheDocument()
    });

    it('renders link to sign up w/ facebook', () => {
        render(
            <MockGuestHome />
        )
        expect(screen.getByTitle(/sign up with facebook/i)).toBeInTheDocument()
    });

    it('renders link to sign up w/ google', () => {
        render(
            <MockGuestHome />
        )
        expect(screen.getByTitle(/sign up with google/i)).toBeInTheDocument()
    });

    it('renders link to sign up w/ apple', () => {
        render(
            <MockGuestHome />
        )
        expect(screen.getByTitle(/sign up with apple/i)).toBeInTheDocument()
    });

    it('renders link to sign up w/ email', () => {
        render(
            <MockGuestHome />
        )
        expect(screen.getByRole('link', { name: /sign up with email/i })).toBeInTheDocument()
    });

    it('renders link to login for users w/ existing account', () => {
        render(
            <MockGuestHome />
        )
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    });

});
