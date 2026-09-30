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
  title: "Admin | Premium SaaS",
  description: "Minimalist Admin Dashboard",
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
            <div className={styles.logoArea}>
              <div className={styles.logoIcon}></div>
              <span className={styles.logoText}>WBM Admin</span>
            </div>

            <nav className={styles.navMenu}>
              <div className={styles.navGroup}>
                <p className={styles.navTitle}>Overview</p>
                <Link href="/" className={`${styles.navItem} ${styles.active}`}>Dashboard</Link>
                <Link href="/users" className={styles.navItem}>Users & Enrolments</Link>
                <Link href="/batches" className={styles.navItem}>Batches</Link>
              </div>
              
              <div className={styles.navGroup}>
                <p className={styles.navTitle}>Curriculum</p>
                <Link href="/programs" className={styles.navItem}>Programs</Link>
                <Link href="/quizzes" className={styles.navItem}>Question Bank</Link>
              </div>
              
              <div className={styles.navGroup}>
                <p className={styles.navTitle}>Finance</p>
                <Link href="/revenue" className={styles.navItem}>Revenue</Link>
                <Link href="/invoices" className={styles.navItem}>Invoices</Link>
              </div>
            </nav>
            
            <div className={styles.sidebarBottom}>
              <button className={styles.logoutBtn}>Sign Out</button>
            </div>
          </aside>

          {/* Right Side (Topbar + Content) */}
          <div className={styles.mainWrapper}>
            {/* Top Bar */}
            <header className={styles.topbar}>
              <div className={styles.searchContainer}>
                <span className={styles.searchIcon}>🔍</span>
                <input type="text" placeholder="Search users, batches, or invoices..." className={styles.searchInput} />
              </div>
              
              <div className={styles.topbarActions}>
                <button className={styles.iconBtn}>🔔</button>
                <div className={styles.userProfile}>
                  <div className={styles.avatar}>R</div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>Roweena Britto</span>
                    <span className={styles.userRole}>Super Admin</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
              <div className={styles.contentInner}>
                {children}
              </div>
            </main>
          </div>
          
        </div>
      </body>
    </html>
  );
}
