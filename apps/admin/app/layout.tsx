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
  title: "WhatBoutMe Admin Panel",
  description: "Manage learners and programs.",
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
          {/* Admin Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.logo}>WBM Admin</div>
            
            <div className={styles.userProfile}>
              <div className={styles.avatar}>R</div>
              <div className={styles.userInfo}>
                <h4>Roweena Britto</h4>
                <p>Super Admin</p>
              </div>
            </div>

            <nav className={styles.navMenu}>
              <div className={styles.navGroup}>
                <p className={styles.navTitle}>CORE</p>
                <Link href="/" className={`${styles.navItem} ${styles.active}`}>Dashboard</Link>
                <Link href="/users" className={styles.navItem}>Users & Enrolments</Link>
                <Link href="/batches" className={styles.navItem}>Batches</Link>
              </div>
              
              <div className={styles.navGroup}>
                <p className={styles.navTitle}>CONTENT</p>
                <Link href="/programs" className={styles.navItem}>Programs</Link>
                <Link href="/quizzes" className={styles.navItem}>Question Bank</Link>
              </div>
              
              <div className={styles.navGroup}>
                <p className={styles.navTitle}>FINANCE</p>
                <Link href="/revenue" className={styles.navItem}>Revenue</Link>
                <Link href="/invoices" className={styles.navItem}>Invoices</Link>
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
