import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import user from '@testing-library/user-event';

jest.mock('react-hot-toast');

describe('Register Page', () => {
    it('renders register page title', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument()
    });

    it('renders link to login if have account', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByRole('link', { name: /login here\./i })).toBeInTheDocument()
    });

    it('renders email field', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    });

    it('renders password field', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByLabelText(/^Password$/)).toBeInTheDocument()
    });

    it('renders confirm password field', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    });

    it('renders login button', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
    });

    it('renders blank value for email field before user input', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue("")
    });

    it('renders blank value for password field before user input', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByLabelText(/^Password$/)).toHaveValue("")
    });

    it('renders blank value for confirm password field before user input', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        expect(screen.getByLabelText(/confirm password/i)).toHaveValue("")
    });

    it('will not display toast when form fields are blank when submitted', async () => {
        user.setup()
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );
        await user.click(screen.getByRole('button', { name: /register/i }));
        expect(toast).not.toHaveBeenCalled();
    });

    it('renders typed in value after user input on email field', async () => {
        user.setup()
        render(
            <BrowserRouter>
                <Register />
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
                <Register />
            </BrowserRouter>
        )
        const passwordField = screen.getByLabelText(/^Password$/)
        await user.type(passwordField, "1234")
        expect(passwordField).toHaveValue("1234")
    });

    it('renders typed in value after user input on confirm password field', async () => {
        user.setup()
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        )
        const confirmPasswordField = screen.getByLabelText(/confirm password/i)
        await user.type(confirmPasswordField, "1234")
        expect(confirmPasswordField).toHaveValue("1234")
    });

    it('will not display toast when password and confirm password field values don\'t match', async () => {
        user.setup()
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );
        const passwordField = screen.getByLabelText(/^Password$/)
        await user.type(passwordField, "1234")
        const confirmPasswordField = screen.getByLabelText(/confirm password/i)
        await user.type(confirmPasswordField, "1234")
        await user.click(screen.getByRole('button', { name: /register/i }));
        expect(toast).not.toHaveBeenCalled();
    });


    it('displays toast when form is submitted', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByRole('button', { name: /register/i }));
        expect(toast.success).toHaveBeenCalledWith('You clicked the register button');
    });

});
