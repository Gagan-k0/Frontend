import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>WhatBoutMe</div>
        <nav className={styles.nav}>
          <Link href="/about">About</Link>
          <Link href="/programs">Programs</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login" className={styles.loginBtn}>Learner Login</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Transform Your Life with <span className={styles.highlight}>11 Steps to U</span>
            </h1>
            <p className={styles.subtitle}>
              A comprehensive coaching program designed by Roweena to help you discover your true potential, build resilience, and achieve lasting success.
            </p>
            <div className={styles.ctas}>
              <Link href="/programs" className={styles.primaryCta}>Explore Programs</Link>
              <Link href="/about" className={styles.secondaryCta}>Watch Vision</Link>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>R</div>
                <div>
                  <h3>Roweena's Masterclass</h3>
                  <p>Next batch starting soon</p>
                </div>
              </div>
              <div className={styles.progress}>
                <div className={styles.progressBar}></div>
              </div>
              <p className={styles.cardText}>Join 500+ learners who have transformed their lives.</p>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>📚</div>
            <h3>Structured Curriculum</h3>
            <p>11 carefully designed steps with interactive video lessons and quizzes.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>🤝</div>
            <h3>Live Coaching</h3>
            <p>Exclusive Zoom sessions with Roweena and a community of like-minded individuals.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>🎓</div>
            <h3>Certification</h3>
            <p>Earn a verifiable certificate upon successful completion of the program.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} WhatBoutMe. All rights reserved.</p>
        <p className={styles.disclaimer}>
          Disclaimer: The content provided is for educational purposes and does not constitute medical or psychological advice.
        </p>
      </footer>
    </div>
  );
}
