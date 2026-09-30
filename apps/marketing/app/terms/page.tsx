import styles from "../page.module.css";
import Link from "next/link";

export default function TermsPage() {
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
        <section className={styles.hero} style={{minHeight: '60vh', textAlign: 'left'}}>
          <div style={{maxWidth: '800px', margin: '3rem auto', lineHeight: '1.8', color: 'var(--text-secondary)'}}>
            <h1 className={styles.title} style={{textAlign: 'center', marginBottom: '2rem'}}>Terms & Conditions</h1>
            
            <p style={{marginBottom: '2rem'}}>Last updated: September 30, 2026</p>

            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>1. Introduction</h3>
            <p style={{marginBottom: '1.5rem'}}>Welcome to WhatBoutMe. These terms and conditions outline the rules and regulations for the use of WhatBoutMe's Website and Learning Management System.</p>

            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>2. Program Commitment</h3>
            <p style={{marginBottom: '1.5rem'}}>By enrolling in the "11 Steps to U" program or any other workshop, you commit to participating respectfully. We reserve the right to remove any participant who exhibits disruptive behavior without a refund.</p>

            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>3. Refunds Policy</h3>
            <p style={{marginBottom: '1.5rem'}}>Due to the digital nature of the content, refunds are only available within the first 14 days of purchase, provided that the learner has not progressed past Step 2 of the program.</p>

            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>4. Intellectual Property</h3>
            <p style={{marginBottom: '1.5rem'}}>All videos, PDFs, and written content provided within the platform remain the intellectual property of WhatBoutMe FZE. Unauthorized distribution or reproduction is strictly prohibited and will result in immediate termination of your account.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
