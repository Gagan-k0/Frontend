"use client";

import styles from "./login.module.css";
import { useEffect } from "react";

export default function AdminLogin() {
  useEffect(() => {
    // Hide sidebar for login page demo
    document.body.classList.add("login-page-active");
    return () => {
      document.body.classList.remove("login-page-active");
    };
  }, []);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>WBM Admin</div>
        <h2>Sign in to your account</h2>
        <p>Enter your credentials to access the dashboard</p>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" placeholder="admin@whatboutme.com" />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          
          <button type="button" className={styles.loginBtn}>Sign In</button>
        </form>
      </div>
    </div>
  );
}
