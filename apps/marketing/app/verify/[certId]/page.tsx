import styles from "../../page.module.css";
import Link from "next/link";

export default function VerifyCertificatePage({ params }: { params: { certId: string } }) {
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
          <div style={{
            background: 'var(--status-success-bg)',
            border: '1px solid var(--status-success)',
            borderRadius: '16px',
            padding: '3rem',
            maxWidth: '600px',
            margin: '0 auto',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1 style={{ color: 'var(--status-success)', margin: '0 0 1rem 0' }}>Certificate Verified</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Certificate ID: <strong>{params.certId}</strong> is a valid and authentic credential issued by WhatBoutMe.
            </p>
            
            <div style={{ textAlign: 'left', background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Recipient:</strong> Emma Davis</p>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Program:</strong> 11 Steps to U Certification</p>
              <p style={{ margin: '0' }}><strong>Issued On:</strong> October 20, 2026</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
