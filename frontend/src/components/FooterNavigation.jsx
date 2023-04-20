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
            <BottomNavigationAction 
            className={styles.navButton}
            value={0}
            label="Home" 
            icon={<HomeOutlinedIcon />} 
            />
            <BottomNavigationAction 
            className={styles.navButton}
            value={1}
            label="Messages" 
            icon={<ChatBubbleOutlineOutlinedIcon />} 
            />
            <BottomNavigationAction 
            className={styles.navButton} 
            value={2}
            label="Profile" 
            icon={<AccountCircleOutlinedIcon />} 
            />
            <BottomNavigationAction 
            className={styles.navButton} 
            value={3}
            label="Settings" 
            icon={<SettingsOutlinedIcon />} 
            />
        </BottomNavigation>
    )
}
