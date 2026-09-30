import styles from "../page.module.css";
import Link from "next/link";

const MOCK_QUIZZES = [
  { id: 1, step: "Step 1: Introduction to U", questions: 5, passMark: "75%", updated: "Sep 28, 2026" },
  { id: 2, step: "Step 2: Self Discovery", questions: 8, passMark: "75%", updated: "Sep 29, 2026" },
  { id: 3, step: "Step 3: Resilience Building", questions: 10, passMark: "80%", updated: "Sep 29, 2026" },
];

export default function QuizzesPage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Question Bank</h1>
          <p className={styles.subtitle}>Manage quizzes and passing criteria for each step.</p>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>Assessments</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Linked Step</th>
                <th>Questions</th>
                <th>Passing Score</th>
                <th>Last Updated</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_QUIZZES.map((quiz) => (
                <tr key={quiz.id}>
                  <td>
                    <span className={styles.cellUserName}>{quiz.step}</span>
                  </td>
                  <td><span className={styles.cellText}>{quiz.questions}</span></td>
                  <td><span className={styles.cellText}>{quiz.passMark}</span></td>
                  <td><span className={styles.cellTextMuted}>{quiz.updated}</span></td>
                  <td className={styles.alignRight}>
                    <button className={styles.iconActionBtn} title="Edit Questions">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.6}}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
