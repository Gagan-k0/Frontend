import styles from "../../page.module.css";
import Link from "next/link";

export default function SpeakerPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>WhatBoutMe</div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/about">About Roweena</Link>
          <Link href="/programs">Programs</Link>
          <Link href="/speaker">Speaking</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <Link href="http://localhost:3000/login" className={styles.loginBtn}>Learner Login</Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} style={{minHeight: '60vh', textAlign: 'center'}}>
          <h1 className={styles.title}>Keynote Speaker</h1>
          <p className={styles.subtitle}>Book Roweena for your next corporate event or summit.</p>
          
          <div style={{maxWidth: '800px', margin: '3rem auto', textAlign: 'left', lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-secondary)'}}>
            <p style={{marginBottom: '1.5rem'}}>Roweena Britto is a dynamic speaker focusing on brain health, resilience, and personal transformation in high-stress environments. She brings actionable insights from her "11 Steps to U" methodology directly to your audience.</p>
            
            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>Signature Keynotes</h3>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <h4 style={{color: 'var(--text-primary)', marginBottom: '0.5rem'}}>The Neuroscience of Resilience</h4>
                <p style={{fontSize: '0.9rem'}}>Understanding how to rewire the brain to handle corporate stress and bounce back from failure.</p>
              </div>
              <div className={styles.featureCard}>
                <h4 style={{color: 'var(--text-primary)', marginBottom: '0.5rem'}}>Finding Your "U"</h4>
                <p style={{fontSize: '0.9rem'}}>A motivational journey mapping the 11 steps required to rediscover purpose and drive in life and business.</p>
              </div>
            </div>

            <div style={{textAlign: 'center', marginTop: '4rem'}}>
              <Link href="/contact" className={styles.primaryCta} style={{display: 'inline-block', textDecoration: 'none'}}>Inquire About Booking</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
