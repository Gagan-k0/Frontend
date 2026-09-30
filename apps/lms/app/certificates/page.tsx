import styles from "./certificates.module.css";

export default function CertificatesPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Certificates</h1>
        <p className={styles.subtitle}>Your verified credentials.</p>
      </header>

      <div className={styles.emptyState}>
        <div className={styles.icon}>🎓</div>
        <h2>No certificates yet</h2>
        <p>Complete the 11 Steps to U program and pass the final exam to earn your first certificate.</p>
        <div className={styles.progressPlaceholder}>
          <div className={styles.progressBar}><div className={styles.fill} style={{width: '18%'}}></div></div>
          <span>18% Completed</span>
        </div>
      </div>
    </div>
  );
}
