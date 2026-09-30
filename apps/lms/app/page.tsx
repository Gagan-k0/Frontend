import styles from "./page.module.css";

const MOCK_STEPS = [
  { id: 1, sequence: 1, title: "Introduction to U", status: "completed", duration: "12m", type: "Video" },
  { id: 2, sequence: 2, title: "Self Discovery", status: "in_progress", duration: "18m", type: "Video + Quiz" },
  { id: 3, sequence: 3, title: "Resilience Building", status: "locked", duration: "25m", type: "Video" },
  { id: 4, sequence: 4, title: "Overcoming Fear", status: "locked", duration: "15m", type: "PDF + Quiz" },
  { id: 5, sequence: 5, title: "The Brain-Body Connection", status: "locked", duration: "22m", type: "Video" },
];

export default function LearnerDashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, John!</h1>
          <p className={styles.subtitle}>You are currently on Step 2 of the 11 Steps to U program.</p>
        </div>
        <button className={styles.resumeBtn}>Resume Step 2</button>
      </header>

      <section className={styles.progressSection}>
        <div className={styles.progressCard}>
          <div className={styles.progressInfo}>
            <h3>Overall Progress</h3>
            <span className={styles.percentage}>18%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: "18%" }}></div>
          </div>
        </div>
      </section>

      <section className={styles.roadmap}>
        <h2 className={styles.sectionTitle}>Your Journey</h2>
        <div className={styles.stepsList}>
          {MOCK_STEPS.map((step) => (
            <div key={step.id} className={`${styles.stepCard} ${styles[step.status]}`}>
              <div className={styles.stepSequence}>
                {step.status === 'completed' ? '✓' : step.sequence}
              </div>
              <div className={styles.stepDetails}>
                <p className={styles.stepTitle}>Step {step.sequence}: {step.title}</p>
                <div className={styles.stepMeta}>
                  <span className={styles.tag}>{step.type}</span>
                  <span className={styles.duration}>{step.duration}</span>
                </div>
              </div>
              <div className={styles.stepAction}>
                {step.status === 'completed' && <span className={styles.statusCompleted}>Completed</span>}
                {step.status === 'in_progress' && <button className={styles.continueBtn}>Continue</button>}
                {step.status === 'locked' && <span className={styles.statusLocked}>🔒 Locked</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
