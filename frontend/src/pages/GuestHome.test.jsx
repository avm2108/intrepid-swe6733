import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GuestHome from './GuestHome';
import user from '@testing-library/user-event';

jest.mock('react-hot-toast');

describe('GuestHome Page', () => {  
    it('renders guest home page title', () => {
        render(
            <BrowserRouter>
                <GuestHome />
            </BrowserRouter>
        )
        expect(screen.getByRole('heading', { name: /intrepid/i })).toBeInTheDocument()
    });

    it('renders guest home punch line', () => {
        render(
            <BrowserRouter>
                <GuestHome />
            </BrowserRouter>
        )
        expect(screen.getByRole('heading', { name: /where adventurers connect/i })).toBeInTheDocument()
    });

    it('renders guest home page brief description', () => {
        render(
            <BrowserRouter>
                <GuestHome />
            </BrowserRouter>
        )
        expect(screen.getByText(/our dating app is great for connecting with adventurers just like yourself!/i)).toBeInTheDocument()
    });

    it('renders link to sign up w/ facebook', () => {
        render(
            <BrowserRouter>
                <GuestHome />
            </BrowserRouter>
        )
        expect(screen.getByTitle(/sign up with facebook/i)).toBeInTheDocument()
    });

    it('renders link to sign up w/ google', () => {
        render(
            <BrowserRouter>
                <GuestHome />
            </BrowserRouter>
        )
        expect(screen.getByTitle(/sign up with google/i)).toBeInTheDocument()
    });

    it('renders link to sign up w/ apple', () => {
        render(
            <BrowserRouter>
                <GuestHome />
            </BrowserRouter>
        )
        expect(screen.getByTitle(/sign up with apple/i)).toBeInTheDocument()
    });

    it('renders link to sign up w/ email', () => {
        render(
            <BrowserRouter>
                <GuestHome />
            </BrowserRouter>
        )
        expect(screen.getByRole('link', { name: /sign up with email/i })).toBeInTheDocument()
    });

    it('renders link to login for users w/ existing account', () => {
        render(
            <BrowserRouter>
                <GuestHome />
            </BrowserRouter>
        )
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    });

});
