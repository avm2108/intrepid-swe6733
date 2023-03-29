import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components and styles
import './App.css';
import Header from './components/Header';

// Pages
import GuestHome from './pages/GuestHome';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';
import ReduxSandbox from './pages/ReduxSandbox';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

/**
 * <App /> is the root component of the app. It renders the root layout and child routes.
 * @returns {JSX.Element} <App />
 */
function App() {
  return (
    <div className="App">
      <Toaster /> {/* This allows us to show toasts / notification popups */}
      {/* The <Routes /> component is a React Router feature that renders the first child <Route /> that matches the current URL */}
      {/* <Header /> */}
      <Routes>
        {/* Index attribute specifies what'll be shown at the '/' url. We'll have to extend this to detect
          if the user's logged in and show that appropriate "homepage" */}
        <Route index element={<GuestHome />} />
        {/* The path specifies the URL that'll provide the component specified in the 'element' */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:key" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/*-- Example page consuming data from Redux store --*/}
        <Route path="/reduxsandbox" element={<ReduxSandbox />} />
        {/* The * wildcard path matches any URL that doesn't match any other <Route /> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
