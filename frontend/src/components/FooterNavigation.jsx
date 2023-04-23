import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import styles from './FooterNavigation.module.css';

export default function FooterNavigation() {
    const location = useLocation();
    // Setting the nav's value to the current path will highlight the correct icon when
    // the user navigates to a new page either by clicking on a link or using the back/forward buttons
    const [value, setValue] = useState(location.pathname);

    return (
        <BottomNavigation
            showLabels
            value={value}
            className={styles.bottomNav}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
        >
            <BottomNavigationAction component={RouterLink} to="/match-page" value="/match-page" label="Home" icon={<HomeOutlinedIcon />} />
            <BottomNavigationAction component={RouterLink} to="/messages" value="/messages" label="Messages" icon={<ChatBubbleOutlineOutlinedIcon />} />
            <BottomNavigationAction component={RouterLink} to="/profile" value="/profile" label="Profile" icon={<AccountCircleOutlinedIcon />} />
            <BottomNavigationAction component={RouterLink} to="/settings" value="/settings" label="Settings" icon={<SettingsOutlinedIcon />} />
        </BottomNavigation>
    )
}
