import styles from "./step.module.css";
import Link from "next/link";

export default function StepPage({ params }: { params: { stepId: string } }) {
  const stepNumber = params.stepId || "2";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>← Back to Roadmap</Link>
        <h1 className={styles.title}>Step {stepNumber}: Self Discovery</h1>
        <p className={styles.subtitle}>Uncover your inner strengths and map out your core values.</p>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          {/* Mock Video Player */}
          <div className={styles.videoContainer}>
            <div className={styles.videoPlaceholder}>
              <div className={styles.playButton}>▶</div>
              <p>Roweena's Masterclass: Self Discovery (18:42)</p>
            </div>
          </div>
          
          <div className={styles.descriptionCard}>
            <h3>About this step</h3>
            <p>In this module, Roweena guides you through the foundational exercise of identifying what truly matters to you. Watch the video fully before proceeding to the quiz.</p>
          </div>
        </div>

        <div className={styles.sideColumn}>
          {/* Quiz Section */}
          <div className={styles.quizCard}>
            <h3>Knowledge Check</h3>
            <p className={styles.quizDesc}>You must score 75% to unlock Step 3.</p>
            
            <div className={styles.question}>
              <p>1. What is the first pillar of self-discovery according to the video?</p>
              <div className={styles.options}>
                <label className={styles.option}><input type="radio" name="q1" /> Goal Setting</label>
                <label className={styles.option}><input type="radio" name="q1" /> Value Mapping</label>
                <label className={styles.option}><input type="radio" name="q1" /> Time Management</label>
              </div>
            </div>

            <button className={styles.submitBtn}>Submit Quiz</button>
          </div>
          
          {/* Resources */}
          <div className={styles.resourceCard}>
            <h3>Resources</h3>
            <a href="#" className={styles.resourceLink}>📄 Step 2 Workbook PDF</a>
            <a href="#" className={styles.resourceLink}>🎧 Audio Meditation</a>
          </div>
        </div>
      </div>
    </div>
  );
}
