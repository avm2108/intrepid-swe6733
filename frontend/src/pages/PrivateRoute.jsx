import React, { useContext, useEffect, useRef } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import { toast } from "react-hot-toast";

const PrivateRoute = ({ user, checkLoggedIn, redirectPath = '/login', children }) => {
    const location = useLocation();
    const itemToRender = useRef(null);
    const [state, setState] = React.useState({
        loading: true,
        redirect: false,
        element: null,
    });


    useEffect(() => {
        itemToRender.current = null;

        const determineAction = async (children) => {
            // If the user is logged in and has a complete profile, render the protected route
            // Otherwise, redirect to the specified redirect path
            await checkLoggedIn().then((res) => {
                console.log("PrivateRoute: Checking if user is logged in " + JSON.stringify(res));
                if (res?.loggedIn) {
                    if (res?.profileComplete) {
                        console.log("PrivateRoute: User has a complete profile, allowing them to access the protected route")
                        itemToRender.current = children || <Outlet />;
                    } else {
                        console.log("PrivateRoute: User logged in but does not have a complete profile, send to create profile page")
                        itemToRender.current = <Navigate to="/create" replace />;
                    }
                } else {
                    console.log("PrivateRoute: User is not logged in, redirecting to login page");
                    itemToRender.current = <Navigate to={redirectPath} replace />;
                }
                setState({ loading: false, redirect: false, element: itemToRender.current });
            });
        };

        determineAction();
    }, [user, children]);

    return state.element && !state.loading ? state.element : null;
};

export default PrivateRoute;
