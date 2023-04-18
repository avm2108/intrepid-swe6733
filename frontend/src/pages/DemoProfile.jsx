import { useState } from "react";
import { useLocation } from "react-router-dom";

// This is only to for demonstration purposes
// Once login is hooked up to the 
export default function DemoProfile(props) {
    // Get access to the 'user' object stored in location.state
    const location = useLocation();
    const { state } = location;
    if (!state) {
        window.location.href = "/login";
    } else {
        var user = state.user;
    }

    const logout = async (e) => {
        e.preventDefault();
        fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
        window.location.href = "/";
    }

    return (
        <div>
            <h1>Demo Profile</h1>
            <h2>Welcome to Intrepid, {user.name ?? ""}</h2>
            <p>
                Your email is: {user.email} <br />
                and your date of birth is: {user.dateOfBirth}
            </p>
            <button onClick={(e) => logout(e)}>
                Logout
            </button>
        </div>
    )
}
