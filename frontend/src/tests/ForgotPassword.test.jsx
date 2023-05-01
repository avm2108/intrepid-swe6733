import { render, screen } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';
import user from '@testing-library/user-event';

jest.mock('react-hot-toast');

describe('Forgot Password Page', () => {  
    it('renders forgot password page title', () => {
        render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        )
        expect(screen.getByRole('heading', {  name: /forgot password/i})).toBeInTheDocument()
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

    it('doesn\' display toast when form is submitted', async () => {
        user.setup();
        render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        );
        await user.click(screen.getByRole('button', {  name: /submit/i}));
        expect(toast).not.toHaveBeenCalled();
    });

    it('updates form state correctly on input change', async () => {
        user.setup();
        render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        );
    
        const emailInput = screen.getByLabelText('Your email')
        await user.type(emailInput, 'test@intrepid.com');
    
        expect(emailInput).toHaveValue('test@intrepid.com');
    });
});
