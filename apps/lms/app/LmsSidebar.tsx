"use client";

import styles from "./layout.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  enrolledPrograms?: { batchName: string; programTitle: string }[];
}

// Inline SVGs for the sidebar icons
const Icons = {
  Logo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent-primary)"><path d="M12 3L2 7l10 4 10-4-10-4zm0 6l-10-4v10l10 4 10-4V5l-10 4z"/></svg>,
  Programs: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Sessions: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Certificates: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
  Messages: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  Profile: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Chevron: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
};

export default function LmsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const userName = user?.name || user?.email || "Learner";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const cohortName = user?.enrolledPrograms?.[0]?.batchName || "Not Enrolled";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Icons.Logo />
        WhatBoutMe
      </div>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.userInfo}>
          <h4>{userName}</h4>
          <p>{cohortName}</p>
          <span className={styles.viewProfileLink}>View Profile &rarr;</span>
        </div>
        <div className={styles.chevronIcon}><Icons.Chevron /></div>
      </div>

      <nav className={styles.navMenu}>
        <div className={styles.navGroup}>
          <p className={styles.navTitle}>LEARNING</p>
          <Link href="/" className={`${styles.navItem} ${pathname === "/" ? styles.active : ""}`}>
            <Icons.Programs /> My Programs
          </Link>
          <Link href="/live" className={`${styles.navItem} ${pathname === "/live" ? styles.active : ""}`}>
            <Icons.Sessions /> Live Sessions
          </Link>
          <Link href="/certificates" className={`${styles.navItem} ${pathname === "/certificates" ? styles.active : ""}`}>
            <Icons.Certificates /> Certificates
          </Link>
        </div>

        <div className={styles.navGroup}>
          <p className={styles.navTitle}>COMMUNITY</p>
          <Link href="/chat" className={`${styles.navItem} ${pathname === "/chat" ? styles.active : ""}`}>
            <Icons.Messages /> Messages
          </Link>
          <Link href="/profile" className={`${styles.navItem} ${pathname === "/profile" ? styles.active : ""}`}>
            <Icons.Profile /> My Profile
          </Link>
        </div>
      </nav>

      <div className={styles.logoutBtn} onClick={handleSignOut}>
        <Icons.Logout /> Sign Out
      </div>
    </aside>
  );
}
