/* eslint-disable testing-library/no-unnecessary-act */ // This is a false positive
import { act, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import userEvent from '@testing-library/user-event';
import UserProvider from '../providers/UserProvider';


// Mock react-hot-toast's toast module, specifically the functions toast.error, toast.success, etc.
jest.mock('react-hot-toast', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

const MockRegister = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <Register />
            </UserProvider>
        </BrowserRouter>
    )
};


describe('Register Page', () => {
    it('renders register page title', () => {
        render(
            <MockRegister  />
        )
        expect(screen.getByRole('heading', {  name: /sign up with email/i})).toBeInTheDocument()
    });

    it('renders link to login if have account', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByRole('link', {  name: /go to login/i})).toBeInTheDocument()
    });

    it('renders email field', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    });

    it('renders password field', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByLabelText(/^Password$/)).toBeInTheDocument()
    });

    it('renders confirm password field', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    });

    it('renders birthday field', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByLabelText(/your birth date/i)).toBeInTheDocument()
    });

    it('renders login button', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByRole('button', {  name: /create an account/i})).toBeInTheDocument()
    });

    it('renders blank value for email field before user input', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue("")
    });

    it('renders blank value for name field before user input', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByRole('textbox', {  name: /your name/i})).toHaveValue("")
    });

    it('renders blank value for password field before user input', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByLabelText(/^Password$/)).toHaveValue("")
    });

    it('renders blank value for confirm password field before user input', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByLabelText(/confirm password/i)).toHaveValue("")
    });


    it('renders blank value for dateOfBirth field before user input', () => {
        render(
            <MockRegister />
        )
        expect(screen.getByLabelText(/your birth date/i)).toHaveValue("")
    });

    it('will display toast when form fields are blank when submitted', async () => {
        userEvent.setup()
        render(
            <MockRegister />
        );
        await act(async () => { await userEvent.click(screen.getByRole('button', { name: /create an account/i })); });
        expect(toast.error).toHaveBeenCalled();
    });

    it('renders typed in value after user input on name field', async () => {
        userEvent.setup()
        render(
            <MockRegister />
        )
        const nameField = screen.getByRole('textbox', {  name: /your name/i})
        await act(async () => { userEvent.type(nameField, "Horatia") });
        await waitFor(() => expect(nameField).toHaveValue("Horatia"));
    });

    it('renders typed in value after user input on email field', async () => {
        userEvent.setup()
        render(
            <MockRegister />
        )
        const emailField = screen.getByRole('textbox', { name: /email/i })
        await act(async () => { userEvent.type(emailField, "test@email.add") });
        await waitFor(() => { expect(emailField).toHaveValue("test@email.add") });
    });

    it('renders typed in value after user input on password field', async () => {
        userEvent.setup()
        render(
            <MockRegister />
        )
        const passwordField = screen.getByLabelText(/^Password$/)
        await act(async () => { userEvent.type(passwordField, "1234") });
        await waitFor(() => { expect(passwordField).toHaveValue("1234") });
    });

    it('renders typed in value after user input on confirm password field', async () => {
        userEvent.setup()
        render(
            <MockRegister />
        )
        const confirmPasswordField = screen.getByLabelText(/confirm password/i)
        await act(async () => { userEvent.type(confirmPasswordField, "1234") });
        await waitFor(() => { expect(confirmPasswordField).toHaveValue("1234") });
    });

    it('renders typed in value after user input on dateOfBirth field', async () => {
        userEvent.setup()
        render(
            <MockRegister />
        )
        const dateOfBirthField = screen.getByLabelText(/your birth date/i)
        await act(async () => { userEvent.type(dateOfBirthField, "2023-04-12") });
        await waitFor(() => { expect(dateOfBirthField).toHaveValue("2023-04-12") });
    });

    it('will display error toast when password and confirm password field values don\'t match', async () => {
        userEvent.setup()
        render(
            <MockRegister />
        );
        const passwordField = screen.getByLabelText(/^Password$/)
        await act(async () => { userEvent.type(passwordField, "1234") });
        const confirmPasswordField = screen.getByLabelText(/confirm password/i)
        await act(async () => { userEvent.type(confirmPasswordField, "1233544") });
        await act(async () => { userEvent.click(screen.getByRole('button', {  name: /create an account/i})); });
        await waitFor(() => { expect(toast.error).toHaveBeenCalledTimes(1); });
    });

    it('displays toast when form is submitted', async () => {
        render(
            <MockRegister />
        );
        // Fill up the form
        const nameField = screen.getByLabelText(/your name/i)
        // Ensure it's there
        await waitFor(() => { expect(nameField).toBeInTheDocument() });
        await act(async () => { userEvent.type(nameField, "Horatia") });
        // Ensure it's filled up
        await waitFor(() => { expect(nameField).toHaveValue("Horatia") });

        const emailField = screen.getByLabelText(/email/i)
        // Ensure it's there
        await waitFor(() => { expect(emailField).toBeInTheDocument() });
        const val = `test${Math.floor(Math.random() * 334)}@email.com`;
        await act(async () => { userEvent.type(emailField, val); });
        // Ensure it's filled up
        await waitFor(() => { expect(emailField).toHaveValue(val) });

        const passwordField = screen.getByLabelText(/^Password$/)
        // Ensure it's there
        await waitFor(() => { expect(passwordField).toBeInTheDocument() });
        await act(async () => { userEvent.type(passwordField, "Passw0rd!") });
        // Ensure it's filled up
        await waitFor(() => { expect(passwordField).toHaveValue("Passw0rd!") });

        const confirmPasswordField = screen.getByLabelText(/confirm password/i)
        // Ensure it's there
        await waitFor(() => { expect(confirmPasswordField).toBeInTheDocument() });
        await act(async () => { userEvent.type(confirmPasswordField, "Passw0rd!") });
        // Ensure it's filled up
        await waitFor(() => { expect(confirmPasswordField).toHaveValue("Passw0rd!") });

        const dateOfBirthField = screen.getByLabelText(/your birth date/i)
        // Ensure it's there
        await waitFor(() => { expect(dateOfBirthField).toBeInTheDocument() });
        await act(async () => { userEvent.type(dateOfBirthField, "1990-04-12") });
        // Ensure it's filled up
        await waitFor(() => { expect(dateOfBirthField).toHaveValue("1990-04-12") });

        await act(async () => { userEvent.click(screen.getByRole('button', {  name: /create an account/i})); });
        await waitFor(() => { expect(toast.error).toHaveBeenCalledTimes(0); });
    });

});
