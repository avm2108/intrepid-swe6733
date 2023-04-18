import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

/*-- Redux imports --*/
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit';
import intrepidSaga from './pages/slice/saga';
import intrepidSlice from './pages/slice/index';

/*-- Redux declarations --*/
const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
  reducer: {
    intrepid: intrepidSlice.reducer
  },
  middleware: [sagaMiddleware] 
})
sagaMiddleware.run(intrepidSaga)

/*-- Axios configuration --*/
// Ensure Axios sends the HttpOnly JWT cookies with every request
// So rather than typing http://localhost:5000/api/auth/login,
// we can just type /api/users/login in axios requests
// Set this to the port your backend server is running on
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

// Attach React functionality to the root element
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the App component inside the root element, representing the entire app
// We can wrap <App  /> with providers that provide context/features to all child components
root.render(
  /*-- make the Redux store available to all components  --*/
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
