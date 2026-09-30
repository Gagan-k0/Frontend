import styles from "./live.module.css";

export default function LiveSessionsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Live Sessions</h1>
        <p className={styles.subtitle}>Join Roweena and your cohort for weekly masterclasses.</p>
      </header>

      <div className={styles.nextSessionCard}>
        <div className={styles.liveIndicator}>
          <span className={styles.pulse}></span>
          LIVE NOW
        </div>
        <h2>Week 2 Q&A: Self Discovery Deep Dive</h2>
        <p>Cohosted by Roweena Britto</p>
        <button className={styles.joinBtn}>Join Zoom Session</button>
      </div>

      <h3 className={styles.sectionTitle}>Upcoming Schedule</h3>
      <div className={styles.scheduleList}>
        <div className={styles.scheduleItem}>
          <div className={styles.dateBox}>
            <span className={styles.month}>OCT</span>
            <span className={styles.day}>12</span>
          </div>
          <div className={styles.details}>
            <h4>Resilience Building Workshop</h4>
            <p>10:00 AM - 11:30 AM (GST)</p>
          </div>
        </div>
        <div className={styles.scheduleItem}>
          <div className={styles.dateBox}>
            <span className={styles.month}>OCT</span>
            <span className={styles.day}>19</span>
          </div>
          <div className={styles.details}>
            <h4>Overcoming Fear Group Session</h4>
            <p>10:00 AM - 11:30 AM (GST)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
