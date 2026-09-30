"use client";

import styles from "../login/auth.module.css";
import Link from "next/link";
import { useEffect } from "react";

export default function SignupPage() {
  useEffect(() => {
    document.body.classList.add("auth-page-active");
    return () => document.body.classList.remove("auth-page-active");
  }, []);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.logo}>WhatBoutMe</h1>
        <h2>Create an Account</h2>
        <p>Join the 11 Steps to U program and start your journey.</p>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" placeholder="Emma Davis" />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" placeholder="emma@example.com" />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <Link href="/agreement" className={styles.submitBtn} style={{display: 'block', textAlign: 'center', textDecoration: 'none'}}>
            Continue to Checkout
          </Link>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
