import styles from "./page.module.css";

const MOCK_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", cohort: "Alpha Cohort 2026", progress: "18%", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", cohort: "Alpha Cohort 2026", progress: "45%", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", cohort: "Alpha Cohort 2026", progress: "0%", status: "Pending" },
  { id: 4, name: "Emma Davis", email: "emma@example.com", cohort: "Beta Cohort 2026", progress: "100%", status: "Completed" },
];

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.subtitle}>Track your programs, enrolments, and revenue metrics.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn}>Export Report</button>
          <button className={styles.primaryBtn}>+ Create Batch</button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3>Total Enrolments</h3>
            <span className={styles.statIcon}>👥</span>
          </div>
          <div className={styles.statBody}>
            <p className={styles.statValue}>142</p>
            <div className={styles.statTrendWrapper}>
              <span className={styles.statTrendPositive}>↑ 12%</span>
              <span className={styles.statTrendLabel}>vs last month</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3>Active Batches</h3>
            <span className={styles.statIcon}>📅</span>
          </div>
          <div className={styles.statBody}>
            <p className={styles.statValue}>3</p>
            <div className={styles.statTrendWrapper}>
              <span className={styles.statTrendNeutral}>→ 0%</span>
              <span className={styles.statTrendLabel}>vs last month</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3>Total Revenue</h3>
            <span className={styles.statIcon}>💳</span>
          </div>
          <div className={styles.statBody}>
            <p className={styles.statValue}>$28,500</p>
            <div className={styles.statTrendWrapper}>
              <span className={styles.statTrendPositive}>↑ 4.5%</span>
              <span className={styles.statTrendLabel}>vs last month</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Enrolments</h2>
          <button className={styles.viewAllBtn}>View All</button>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Learner</th>
                <th>Cohort</th>
                <th>Status</th>
                <th>Progress</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.cellUser}>
                      <span className={styles.cellUserName}>{user.name}</span>
                      <span className={styles.cellUserEmail}>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.cellText}>{user.cohort}</span>
                  </td>
                  <td>
                    <span className={`${styles.statusChip} ${styles[user.status.toLowerCase()]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.progressCell}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: user.progress }}></div>
                      </div>
                      <span className={styles.progressText}>{user.progress}</span>
                    </div>
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
