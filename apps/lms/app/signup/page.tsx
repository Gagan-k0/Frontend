"use client";

import styles from "../login/auth.module.css";
import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProgramId = searchParams.get("programId");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>(initialProgramId ? [initialProgramId] : []);

  useEffect(() => {
    document.body.classList.add("auth-page-active");
    fetchPrograms();
    return () => document.body.classList.remove("auth-page-active");
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs`);
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
    } catch (e) {
      console.error("Failed to fetch programs", e);
    }
  };

  const toggleProgram = (id: string) => {
    setSelectedProgramIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, programIds: selectedProgramIds }),
      });
      if (res.ok) {
        const data = await res.json();
        // Mock token storage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/agreement"); // Continue to checkout/agreement
      } else {
        const err = await res.json();
        setError(err.message || "Failed to create account");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.logo}>WhatBoutMe</h1>
        <h2>Create an Account</h2>
        <p>Join the 11 Steps to U program and start your journey.</p>
        
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <form className={styles.form} onSubmit={handleSignup}>
          
          <div className={styles.inputGroup}>
            <label>Select Courses / Programs</label>
            {programs.length === 0 ? (
              <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Loading courses...</p>
            ) : (
              <div className={styles.courseGrid}>
                {programs.map(program => (
                  <div 
                    key={program.id}
                    className={`${styles.courseCard} ${selectedProgramIds.includes(program.id) ? styles.courseCardSelected : ''}`}
                    onClick={() => toggleProgram(program.id)}
                  >
                    <span className={styles.courseTitle}>{program.title}</span>
                    <span className={styles.courseDesc}>{program.description || 'Join this interactive program.'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" required placeholder="Emma Davis" value={name} onChange={e => setName(e.target.value)} />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" required placeholder="emma@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button type="submit" className={styles.submitBtn} style={{display: 'block', width: '100%', cursor: 'pointer'}}>
            Continue to Checkout
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href={initialProgramId ? `/login?programId=${initialProgramId}` : "/login"}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
