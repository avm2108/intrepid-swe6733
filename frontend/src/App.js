import { useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserContext } from './providers/UserProvider';

// Components and styles
import './App.css';

// Pages
import GuestHome from './pages/GuestHome';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import ErrorPage from './pages/ErrorPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './pages/PrivateRoute';
import { MatchPage } from './pages/MatchPage';
import ComponentsPage from './pages/ComponentsTest';
import UserProfile from './pages/UserProfile';
import FooterNavigation from "./components/FooterNavigation";
import CreateProfile from './pages/CreateProfile';

/**
 * <App /> is the root component of the app. It renders the root layout and child routes.
 * @returns {JSX.Element} <App />
 */
function App() {
  const { user, updateUser, checkLoggedIn } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const firstRender = useRef(true);

  /* On page load check if the user is logged in via a call to the backend
  which will check if the user still has a unexpired JWT in their httponly cookies
  If the user is logged in, the backend will return the user's info and we'll update the user context
  Since we'll then be logged in we can also redirect the user to the matching page. If they aren't logged
  in allow only access to public routes */
  useEffect(() => {
    // console.log("App: Checking if user is logged in");
    const determineLogin = async () => {
      await checkLoggedIn().then((res) => {
        console.log("App: User is logged in: " + JSON.stringify(res));
        if (res?.loggedIn) {
          // console.log("App: User is logged in, updating user context");
          // updateUser(res);
          console.log("App: User is logged in, redirecting to matching page")
          if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password" || location.pathname === "/reset-password") navigate("/matching", { replace: true });
          // else navigate(location.pathname, { replace: true });
          if (user?.profileComplete && location.pathname === '/create') {
            navigate('/matching', { replace: true });
          }
        } else {
          console.log("App: User is not logged in, redirecting to guest home page");
          navigate("/", { replace: true });
        }
      });
    };

    determineLogin();
  }, []);

  // Prevent them from accessing the login page, etc. if they're already logged in
  useEffect(() => {
    if (user?.loggedIn && ['/', '/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname)) {
      navigate('/matching', { replace: true });
    }
  }, [location.pathname]);


  return (
    <div className='App'>
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
        {user?.loggedIn && !user?.profileComplete && <Route path="/create" element={<CreateProfile />} />}
        {/* Any routes that require a user to be logged in AND have a completed profile go here; */}
        <Route element={<PrivateRoute user={user} checkLoggedIn={checkLoggedIn} />}>
          <Route path="/instagram" element={<UserProfile />} /> {/* This is where the backend will navigate after the user authorizes IG access  */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/matching" element={<MatchPage />} />
          {/* <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>
        <Route path="/logout" element={<Logout />} />
        {/* The * wildcard path matches any URL that doesn't match any other <Route /> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {/* Only show this once they've completed onboarding */}
      {user?.loggedIn && user?.profileComplete && (
        <>
          <FooterMargin />
          <FooterNavigation />
        </>
      )}
    </div>
  );
};

// This is to make sure the footer navigation doesn't cover up the bottom of the page
// We could alter the classname of the App div to be different if the user is logged in
// But it causes re-rendering of the entire app and which causes the PrivateRoute to re-render
// either causing a redirect loop or a flash of the login page or logging the user out
function FooterMargin() {
  return (
    <div className="FooterMargin"></div>
  )
};



export default App;
