import styles from "../page.module.css";
import Link from "next/link";

export default function AboutPage() {
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
        <section className={styles.hero} style={{minHeight: '60vh', textAlign: 'center'}}>
          <h1 className={styles.title}>About Roweena Britto</h1>
          <p className={styles.subtitle}>Empowering individuals to build resilience and master their journey.</p>
          
          <div style={{maxWidth: '800px', margin: '3rem auto', textAlign: 'left', lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-secondary)'}}>
            <p style={{marginBottom: '1.5rem'}}>Roweena Britto is a visionary coach and creator of the "11 Steps to U" methodology. With over a decade of experience in personal development, she has helped thousands of individuals discover their true potential.</p>
            <p>Through WhatBoutMe, Roweena offers a structured, accountable, and supportive environment for learners to break through their limiting beliefs and achieve lasting transformation.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
