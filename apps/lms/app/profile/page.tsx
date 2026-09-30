"use client";

import styles from "../layout.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfilePage() {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>WhatBoutMe</div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
            Dashboard
          </Link>
          <Link href="/live" className={`${styles.navItem} ${pathname === '/live' ? styles.active : ''}`}>
            Live Sessions
          </Link>
          <Link href="/chat" className={`${styles.navItem} ${pathname === '/chat' ? styles.active : ''}`}>
            Messages <span className={styles.badge}>2</span>
          </Link>
          <Link href="/certificates" className={`${styles.navItem} ${pathname === '/certificates' ? styles.active : ''}`}>
            Certificates
          </Link>
          <Link href="/profile" className={`${styles.navItem} ${pathname === '/profile' ? styles.active : ''}`}>
            Profile & Settings
          </Link>
        </nav>
      </aside>
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.pageTitle}>Profile & Settings</h2>
          <div className={styles.userMenu}>
            <div className={styles.avatar}>ED</div>
            <span className={styles.userName}>Emma Davis</span>
          </div>
        </header>

        <div className={styles.content}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            padding: '2.5rem',
            borderRadius: '20px',
            maxWidth: '600px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{marginTop: 0, marginBottom: '2rem', color: 'var(--text-primary)'}}>Account Information</h3>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Full Name</label>
                <input type="text" defaultValue="Emma Davis" style={{
                  width: '100%', padding: '1rem', borderRadius: '12px', 
                  border: '1px solid var(--border-light)', background: 'var(--bg-main)', 
                  color: 'var(--text-primary)', outline: 'none'
                }} />
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Email Address</label>
                <input type="email" defaultValue="emma@example.com" disabled style={{
                  width: '100%', padding: '1rem', borderRadius: '12px', 
                  border: '1px solid var(--border-light)', background: 'var(--bg-main)', 
                  color: 'var(--text-secondary)', outline: 'none', opacity: 0.7
                }} />
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Time Zone</label>
                <select style={{
                  width: '100%', padding: '1rem', borderRadius: '12px', 
                  border: '1px solid var(--border-light)', background: 'var(--bg-main)', 
                  color: 'var(--text-primary)', outline: 'none'
                }}>
                  <option>Asia/Dubai (GST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>America/New_York (EST)</option>
                </select>
              </div>

              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button style={{
                  background: 'var(--accent-primary)', color: 'white', border: 'none', 
                  padding: '1rem 2rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600
                }}>Save Changes</button>
                <button style={{
                  background: 'transparent', color: 'var(--text-primary)', 
                  border: '1px solid var(--border-light)', padding: '1rem 2rem', 
                  borderRadius: '12px', cursor: 'pointer', fontWeight: 600
                }}>Change Password</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
