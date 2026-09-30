"use client";

import styles from "../login/auth.module.css";
import Link from "next/link";
import { useEffect } from "react";

export default function LearnerSignup() {
  useEffect(() => {
    document.body.classList.add("auth-page-active");
    return () => document.body.classList.remove("auth-page-active");
  }, []);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.logo}>WhatBoutMe</h1>
        <h2>Join the Program</h2>
        <p>Enroll in the 11 Steps to U certification.</p>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          
          <button type="button" className={styles.submitBtn}>Proceed to Payment ($1,999)</button>
        </form>
        
        <p className={styles.footerText}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
