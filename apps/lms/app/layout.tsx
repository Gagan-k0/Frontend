import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./layout.module.css";
import LmsSidebar from "./LmsSidebar";
import Topbar from "./Topbar";

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
          {/* Client-side Sidebar with real user data */}
          <LmsSidebar />

          <main className={styles.mainContent}>
            <Topbar />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
