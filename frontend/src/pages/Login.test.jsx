import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import user from '@testing-library/user-event';

jest.mock('react-hot-toast');

describe('Login Page', () => {
    it('renders login page title', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    });

    it('renders link to register if no account', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        expect(screen.getByRole('link', {  name: /register today/i})).toBeInTheDocument()
    });

    it('renders email field', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    });

    it('renders password field', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    });

    it('renders login button', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        expect(screen.getByRole('button', {  name: /log in/i})).toBeInTheDocument()
    });

    it('renders blank value for email field before user input', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue("")
    });

    it('renders blank value for password field before user input', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        expect(screen.getByLabelText(/password/i)).toHaveValue("")
    });

    it('will not display toast when form fields are blank when submitted', async () => {
        user.setup()
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        await user.click(screen.getByRole('button', { name: /log in/i }));
        expect(toast).not.toHaveBeenCalled();
    });

    it('renders typed in value after user input on email field', async () => {
        user.setup()
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        const emailField = screen.getByRole('textbox', { name: /email/i })
        await user.type(emailField, "test@email.add")
        expect(emailField).toHaveValue("test@email.add")
    });

    it('renders typed in value after user input on password field', async () => {
        user.setup()
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
        const passwordField = screen.getByLabelText(/password/i)
        await user.type(passwordField, "1234")
        expect(passwordField).toHaveValue("1234")
    });

    it('doesn\'t display toast when form is submitted', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByRole('button', { name: /log in/i }));
        expect(toast.success).not.toHaveBeenCalled();
    });

});
