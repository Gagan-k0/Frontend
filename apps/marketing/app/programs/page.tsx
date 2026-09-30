"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs`)
      .then(res => res.json())
      .then(data => {
        // filter out inactive programs if needed
        setPrograms(data.filter((p: any) => p.isActive));
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch programs", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>WhatBoutMe</div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/about">About Roweena</Link>
          <Link href="/programs">Programs</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <Link href="http://localhost:3000/login" className={styles.loginBtn}>Learner Login</Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} style={{minHeight: '60vh'}}>
          <h1 className={styles.title}>Our Programs</h1>
          <p className={styles.subtitle}>Choose the path that fits your goals.</p>
          
          <div className={styles.featuresGrid} style={{marginTop: '4rem'}}>
            {isLoading ? (
              <p>Loading programs...</p>
            ) : programs.length === 0 ? (
              <p>No active programs found.</p>
            ) : programs.map((prog) => (
              <div key={prog.id} className={styles.featureCard}>
                <h3>{prog.title}</h3>
                <p>{prog.description || "A comprehensive program designed to guide you forward."}</p>
                <h2 style={{margin: '1.5rem 0'}}>${prog.price}</h2>
                <Link href={`http://localhost:3000/checkout?programId=${prog.id}`} className={styles.ctaBtn} style={{display: 'inline-block', textDecoration: 'none'}}>Enroll Now</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
