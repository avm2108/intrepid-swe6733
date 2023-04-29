import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserProvider from './providers/UserProvider';

/*-- Axios configuration --*/
// Add a baseURL to every request so rather than typing
// http://localhost:5000/api/auth/login,
// we can just type /api/auth/login in axios requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// Ensure Axios sends the HttpOnly JWT cookies with every request
axios.defaults.withCredentials = true;

// Create a globally accessible MUI theme
const theme = createTheme({});

// Attach React functionality to the root element
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the App component inside the root element, representing the entire app
// We can wrap <App  /> with providers that provide context/features to all child components
root.render(
  <BrowserRouter>
    <UserProvider>
      {/* Make MUI theme available to all components */}
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </UserProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
