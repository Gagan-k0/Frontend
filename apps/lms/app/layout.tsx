import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "WhatBoutMe Learner Portal",
  description: "Your journey to resilience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.appContainer}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.logo}>WhatBoutMe</div>
            
            <div className={styles.userProfile}>
              <div className={styles.avatar}>JD</div>
              <div className={styles.userInfo}>
                <h4>John Doe</h4>
                <p>Alpha Cohort 2026</p>
              </div>
            </div>

            <nav className={styles.navMenu}>
              <div className={styles.navGroup}>
                <p className={styles.navTitle}>LEARNING</p>
                <Link href="/" className={`${styles.navItem} ${styles.active}`}>My Programs</Link>
                <Link href="/live" className={styles.navItem}>Live Sessions</Link>
                <Link href="/certificates" className={styles.navItem}>Certificates</Link>
              </div>
              
              <div className={styles.navGroup}>
                <p className={styles.navTitle}>COMMUNITY</p>
                <Link href="/chat" className={styles.navItem}>Messages <span className={styles.badge}>2</span></Link>
                <Link href="/forum" className={styles.navItem}>Discussion</Link>
              </div>
            </nav>
            
            <div className={styles.logoutBtn}>Sign Out</div>
          </aside>

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
