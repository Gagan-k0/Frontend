import styles from "../page.module.css";
import Link from "next/link";

export default function ContactPage() {
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
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>Have questions about our programs? Send us a message.</p>
          
          <div style={{maxWidth: '500px', margin: '3rem auto', textAlign: 'left'}}>
            <form style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Name</label>
                <input type="text" style={{width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', outline: 'none'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Email</label>
                <input type="email" style={{width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', outline: 'none'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Message</label>
                <textarea rows={5} style={{width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical'}}></textarea>
              </div>
              <button type="button" className={styles.ctaBtn} style={{width: '100%', border: 'none', cursor: 'pointer'}}>Send Message</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
