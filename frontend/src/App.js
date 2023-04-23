import { useContext, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserContext } from './providers/UserProvider';

// Components and styles
import './App.css';

// Pages
import GuestHome from './pages/GuestHome';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './pages/PrivateRoute';
// import ReduxSandbox from './pages/ReduxSandbox';
import { MatchPage }  from './pages/MatchPage';
import ComponentsPage from './pages/ComponentsTest';
import DemoProfile from './pages/DemoProfile';
import UserProfile from './pages/UserProfile';
import FooterNavigation from "./components/FooterNavigation";

/**
 * <App /> is the root component of the app. It renders the root layout and child routes.
 * @returns {JSX.Element} <App />
 */
function App() {
  const { user, checkLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  // On page load check if the user is logged in via a call to the backend
  // which will check if the user still has a unexpired JWT in their httponly cookies
  // If the user is logged in, the backend will return the user's info and we'll update the user context
  // Since we'll then be logged in we can also redirect the user to the profile or previous page
  useEffect(() => {
    // Check for the loggedIn cookie to see if we need to check the serverside login status
    // This is to prevent unnecessary requests to the backend
    if (document.cookie.indexOf('loggedIn') === -1 || !checkLoggedIn()) {
      // console.log('User not logged in');
      navigate("/"); // Redirect to the guest homepage
    } else {
      // console.log('User logged in');
      navigate("/user-profile"); // Redirect to the user's profile or match screen?
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:key" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/*-- Example page consuming data from Redux store --*/}
        {/* {process.env.NODE_ENV === 'development' && <Route path="/reduxsandbox" element={<ReduxSandbox />} />} */}
        {/* Any routes that require a user to be logged in go here; */}
        <Route element={<PrivateRoute user={user} />}>
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/match-page" element={<MatchPage />} />
          <Route path="/create-profile" element={<DemoProfile />} />
          {/* <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>
        {/* The * wildcard path matches any URL that doesn't match any other <Route /> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {user.loggedIn && <FooterNavigation />}
    </div>
  );
}

export default App;
