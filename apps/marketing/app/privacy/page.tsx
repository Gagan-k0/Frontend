import styles from "../../page.module.css";
import Link from "next/link";

export default function PrivacyPage() {
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
            <h1 className={styles.title} style={{textAlign: 'center', marginBottom: '2rem'}}>Privacy Policy</h1>
            
            <p style={{marginBottom: '2rem'}}>Last updated: September 30, 2026</p>

            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>1. Information We Collect</h3>
            <p style={{marginBottom: '1.5rem'}}>We collect information that you provide directly to us when you register for an account, sign up for a newsletter, fill out a form, or otherwise communicate with us.</p>

            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>2. How We Use Your Information</h3>
            <p style={{marginBottom: '1.5rem'}}>We use the information we collect to provide, maintain, and improve our services, to process transactions and send you related information including confirmations and invoices, and to respond to your comments and questions.</p>

            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>3. Data Security</h3>
            <p style={{marginBottom: '1.5rem'}}>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

            <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2rem'}}>4. Contact Us</h3>
            <p style={{marginBottom: '1.5rem'}}>If you have any questions about this Privacy Policy, please contact us at privacy@whatboutme.com.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
