import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components and styles
import './App.css';
import CustomLink from './components/CustomLink';
import Header from './components/Header';

// Pages
import GuestHome from './pages/GuestHome';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';

/**
 * <App /> is the root component of the app. It renders the root layout and child routes.
 * @returns {JSX.Element} <App />
 */
function App() {
  return (
    <div className="App">
      <Toaster /> {/* This allows us to show toasts / notification popups */}
      {/* The <Routes /> component is a React Router feature that renders the first child <Route /> that matches the current URL */}
      <Header />
      <Routes> 
        <Route index element={<GuestHome />} />
        {/* The path specifies the URL that'll provide the component specified in the 'element' */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* The * wildcard path matches any URL that doesn't match any other <Route /> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
