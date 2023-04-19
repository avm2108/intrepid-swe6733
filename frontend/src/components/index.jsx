import React from "react";
import FooterNavigation from "./FooterNavigation";
import CTAButton from "./CTAButton";
import CustomLink from "./CustomLink";
import Header from "./Header";
import LabeledInput from "./LabeledInput";
import styles from './Components.css';

export default function ComponentsPage() {
    return (
        <div className={styles.componentsPage}>
            <h2>Components</h2>

            <CTAButton />
            <CustomLink style={{ display: "block", color: 'var(--color-black)' }} to="/register">Sign up with email</CustomLink>
            <Header />
            <LabeledInput />
            {/* <FooterNavigation /> */}
            
        </div>
    )
}