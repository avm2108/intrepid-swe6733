/* eslint-disable testing-library/no-unnecessary-act */ // This is a false positive
import { act, waitFor, render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import userEvent from '@testing-library/user-event';
import UserProvider from '../providers/UserProvider';

jest.mock('react-hot-toast');

const MockLogin = () => {
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
                <Login />
            </UserProvider>
        </BrowserRouter>
    )
};

describe('Login Page', () => {
    it('renders login page title', () => {
        render(
            <MockLogin />
        )
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    });

    it('renders link to register if no account', () => {
        render(
            <MockLogin />
        )
        expect(screen.getByRole('link', { name: /register today/i })).toBeInTheDocument()
    });

    it('renders email field', () => {
        render(
            <MockLogin />
        )
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    });

    it('renders password field', () => {
        render(
            <MockLogin />
        )
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    });

    it('renders login button', () => {
        render(
            <MockLogin />
        )
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    });

    it('renders blank value for email field before user input', () => {
        render(
            <MockLogin />
        )
        expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue("")
    });

    it('renders blank value for password field before user input', () => {
        render(
            <MockLogin />
        )
        expect(screen.getByLabelText(/password/i)).toHaveValue("")
    });

    it('will not display toast when form fields are blank when submitted', async () => {
        userEvent.setup()
        render(
            <MockLogin />
        );
        await act(async () => { await userEvent.click(screen.getByRole('button', { name: /log in/i })); });
        expect(toast).not.toHaveBeenCalled();
    });

    it('renders typed in value after user input on email field', async () => {
        userEvent.setup()
        render(
            <MockLogin />
        )
        const emailField = screen.getByRole('textbox', { name: /email/i });
        await act(async () => {
            await userEvent.type(emailField, "test@email.add")
        });
        expect(emailField).toHaveValue("test@email.add")
    });

    it('renders typed in value after user input on password field', async () => {
        userEvent.setup()
        render(
            <MockLogin />
        )
        const passwordField = screen.getByLabelText(/password/i);
        await act(async () => {
            await userEvent.type(passwordField, "1234")
        });
        expect(passwordField).toHaveValue("1234")
    });

    it('doesn\'t display toast when form is submitted', async () => {
        render(
            <MockLogin />
        );

        await act(async () => {
            await userEvent.click(screen.getByRole('button', { name: /log in/i }));
        })
        expect(toast.success).not.toHaveBeenCalled();
    });

});
