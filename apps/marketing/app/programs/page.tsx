import styles from "../page.module.css";
import Link from "next/link";

export default function ProgramsPage() {
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
            <div className={styles.featureCard}>
              <h3>11 Steps to U (Flagship)</h3>
              <p>A comprehensive 11-module certification program designed to rebuild your confidence and direction.</p>
              <h2 style={{margin: '1.5rem 0'}}>$1,999</h2>
              <Link href="http://localhost:3000/signup" className={styles.ctaBtn} style={{display: 'inline-block', textDecoration: 'none'}}>Enroll Now</Link>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Resilience Workshop</h3>
              <p>A 3-day intensive corporate training for teams navigating high-stress environments.</p>
              <h2 style={{margin: '1.5rem 0'}}>$499</h2>
              <Link href="/contact" className={styles.ctaBtn} style={{display: 'inline-block', textDecoration: 'none'}}>Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
