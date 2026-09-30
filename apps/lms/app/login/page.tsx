"use client";

import styles from "./auth.module.css";
import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programIdToEnroll = searchParams.get("programId");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("auth-page-active");
    return () => document.body.classList.remove("auth-page-active");
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (programIdToEnroll) {
          router.push(`/checkout?programId=${programIdToEnroll}`);
        } else {
          router.push("/");
        }
      } else {
        const err = await res.json();
        setError(err.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.logo}>WhatBoutMe</h1>
        <h2>Welcome back</h2>
        <p>Log in to continue your 11 Steps to U journey.</p>
        
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className={styles.submitBtn}>Sign In</button>
        </form>
        
        <p className={styles.footerText}>
          Don't have an account? <Link href="/signup">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default function LearnerLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
