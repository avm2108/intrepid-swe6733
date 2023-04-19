import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import styles from './FooterNavigation.module.css';

export default function FooterNavigation() {
    const [value, setValue] = useState(0);

    return (
        <BottomNavigation
            showLabels
            value={value}
            className={styles.bottomNav}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
        >
            <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} />
            <BottomNavigationAction label="Messages" icon={<ChatBubbleOutlineOutlinedIcon />} />
            <BottomNavigationAction label="Profile" icon={<AccountCircleOutlinedIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsOutlinedIcon />} />
        </BottomNavigation>
    )
}

/*         <BottomNavigation
        className={styles.bottomNav}
        showLabels
        value={value}
        onChange={(event, newValue) => {setValue(newValue)}}
        >
            <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} />
            <BottomNavigationAction label="Messages" icon={<ChatBubbleOutlineOutlinedIcon/>} />
            <BottomNavigationAction label="Profile" icon={<AccountCircleOutlinedIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsOutlinedIcon />} />

        </BottomNavigation>  */
