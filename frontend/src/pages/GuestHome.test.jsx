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

    // it('renders email field', () => {
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     )
    //     expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    // });

    // it('renders password field', () => {
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     )
    //     expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    // });

    // it('renders login button', () => {
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     )
    //     expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    // });

    // it('renders blank value for email field before user input', () => {
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     )
    //     expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue("")
    // });

    // it('renders blank value for password field before user input', () => {
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     )
    //     expect(screen.getByLabelText(/password/i)).toHaveValue("")
    // });

    // it('will not display toast when form fields are blank when submitted', async () => {
    //     user.setup()
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     );
    //     await user.click(screen.getByRole('button', { name: /login/i }));
    //     expect(toast).not.toHaveBeenCalled();
    // });

    // it('renders typed in value after user input on email field', async () => {
    //     user.setup()
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     )
    //     const emailField = screen.getByRole('textbox', { name: /email/i })
    //     await user.type(emailField, "test@email.add")
    //     expect(emailField).toHaveValue("test@email.add")
    // });

    // it('renders typed in value after user input on password field', async () => {
    //     user.setup()
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     )
    //     const passwordField = screen.getByLabelText(/password/i)
    //     await user.type(passwordField, "1234")
    //     expect(passwordField).toHaveValue("1234")
    // });

    // it('displays toast when form is submitted', () => {
    //     render(
    //         <BrowserRouter>
    //             <Login />
    //         </BrowserRouter>
    //     );
    //     fireEvent.click(screen.getByRole('button', { name: /login/i }));
    //     expect(toast.success).toHaveBeenCalledWith('You clicked the login button');
    // });

});
