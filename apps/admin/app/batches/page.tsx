import styles from "../page.module.css";
import Link from "next/link";

const MOCK_BATCHES = [
  { id: 1, name: "Alpha Cohort 2026", program: "11 Steps to U", manager: "Roweena Britto", students: 45, status: "Active", startDate: "Oct 15, 2026" },
  { id: 2, name: "Beta Cohort 2026", program: "11 Steps to U", manager: "Support Team", students: 50, status: "Completed", startDate: "Sep 01, 2026" },
  { id: 3, name: "Corporate Workshop Q4", program: "Resilience Workshop", manager: "Roweena Britto", students: 120, status: "Pending", startDate: "Nov 05, 2026" },
];

export default function BatchesPage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Batches & Cohorts</h1>
          <p className={styles.subtitle}>Organize learners into groups and schedule live sessions.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn}>+ Create Batch</button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>All Batches</h2>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Search batches..." className={styles.searchInput} />
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Program</th>
                <th>Manager</th>
                <th>Start Date</th>
                <th>Students</th>
                <th>Status</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_BATCHES.map((batch) => (
                <tr key={batch.id}>
                  <td>
                    <span className={styles.cellUserName}>{batch.name}</span>
                  </td>
                  <td><span className={styles.cellText}>{batch.program}</span></td>
                  <td><span className={styles.cellTextMuted}>{batch.manager}</span></td>
                  <td><span className={styles.cellTextMuted}>{batch.startDate}</span></td>
                  <td><span className={styles.cellText}>{batch.students}</span></td>
                  <td>
                    <span className={`${styles.statusChip} ${styles[batch.status.toLowerCase()]}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className={styles.alignRight}>
                    <button className={styles.iconActionBtn}>•••</button>
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
