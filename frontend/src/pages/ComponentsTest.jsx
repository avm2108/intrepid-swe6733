import React from "react";
import FooterNavigation from "../components/FooterNavigation";
import CTAButton from "../components/CTAButton";
import CustomLink from "../components/CustomLink";
import Header from "../components/Header";
import LabeledInput from "../components/LabeledInput";
import styles from './ComponentsTest.module.css';


export default function ComponentsPage() {
    return (
        <div className={styles.componentsPage}>
            <Header />
            <h2>Components</h2>
            <CustomLink style={{ display: "block", color: 'var(--color-black)' }} to="/register">Sign up with email</CustomLink>
            <CTAButton />
            <LabeledInput />
            {/* TODO: Ideally when a user logs in the top level App layout will change to render this so it doesn't
                have to be included on every "page" */}
            <FooterNavigation />

            
        </div>
    )
}
