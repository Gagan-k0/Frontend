"use client";

import styles from "./auth.module.css";
import Link from "next/link";
import { useEffect } from "react";

export default function LearnerLogin() {
  useEffect(() => {
    document.body.classList.add("auth-page-active");
    return () => document.body.classList.remove("auth-page-active");
  }, []);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.logo}>WhatBoutMe</h1>
        <h2>Welcome back</h2>
        <p>Log in to continue your 11 Steps to U journey.</p>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          
          <button type="button" className={styles.submitBtn}>Sign In</button>
        </form>
        
        <p className={styles.footerText}>
          Don't have an account? <Link href="/signup">Register here</Link>
        </p>
      </div>
    </div>
  );
}
