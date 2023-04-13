import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import user from '@testing-library/user-event';

jest.mock('react-hot-toast');

describe('Forgot Password Page', () => {  
    it('renders forgot password page title', () => {
        render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        )
        expect(screen.getByRole('heading', {  name: /forgot password @ intrepid/i})).toBeInTheDocument()
    });

    it('renders the email textbox', () => {
        render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        )
        expect(screen.getByRole('textbox', {  name: /your email/i})).toBeInTheDocument()
    });

    it('renders the submit button', () => {
        render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        )
        expect(screen.getByRole('button', {  name: /submit/i})).toBeInTheDocument()
    });

 
});
