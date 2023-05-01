import { useContext, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";
import { useLocation, useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(UserContext);

    useEffect(() => {
        if (location.pathname === "/logout") {
            logout();
            navigate("/");
        }
    }, []);
}
