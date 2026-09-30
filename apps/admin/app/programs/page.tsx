import styles from "../page.module.css";
import Link from "next/link";

const MOCK_PROGRAMS = [
  { id: 1, title: "11 Steps to U", type: "Certification", price: "$1,999", steps: 11, status: "Active" },
  { id: 2, title: "Resilience Workshop", type: "Corporate", price: "$499", steps: 3, status: "Active" },
  { id: 3, title: "Vision Board Masterclass", type: "Single Session", price: "$99", steps: 1, status: "Draft" },
];

export default function ProgramsPage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Programs & Curriculum</h1>
          <p className={styles.subtitle}>Manage your courses, videos, and step requirements.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn}>+ Create Program</button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>All Programs</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Program Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Steps/Modules</th>
                <th>Status</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PROGRAMS.map((prog) => (
                <tr key={prog.id}>
                  <td>
                    <span className={styles.cellUserName}>{prog.title}</span>
                  </td>
                  <td><span className={styles.cellTextMuted}>{prog.type}</span></td>
                  <td><span className={styles.cellText}>{prog.price}</span></td>
                  <td><span className={styles.cellText}>{prog.steps}</span></td>
                  <td>
                    <span className={`${styles.statusChip} ${prog.status === 'Draft' ? styles.locked : styles.active}`}>
                      {prog.status}
                    </span>
                  </td>
                  <td className={styles.alignRight}>
                    <button className={styles.iconActionBtn} title="More Actions">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
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
