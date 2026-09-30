import styles from "./page.module.css";

const MOCK_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", cohort: "Alpha Cohort 2026", progress: "18%" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", cohort: "Alpha Cohort 2026", progress: "45%" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", cohort: "Alpha Cohort 2026", progress: "0%" },
];

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Overview</h1>
          <p className={styles.subtitle}>Here is what is happening across your programs today.</p>
        </div>
        <button className={styles.actionBtn}>+ Create Batch</button>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Enrolments</h3>
          <p className={styles.statValue}>142</p>
          <span className={styles.statTrend}>+12 this month</span>
        </div>
        <div className={styles.statCard}>
          <h3>Active Batches</h3>
          <p className={styles.statValue}>3</p>
          <span className={styles.statTrend}>1 starting soon</span>
        </div>
        <div className={styles.statCard}>
          <h3>Total Revenue</h3>
          <p className={styles.statValue}>$28,500</p>
          <span className={styles.statTrend}>+4.5% this month</span>
        </div>
      </div>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Enrolments</h2>
          <button className={styles.viewAllBtn}>View All Users</button>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Cohort</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.cohort}</td>
                  <td>
                    <div className={styles.progressCell}>
                      <div className={styles.miniBar}>
                        <div className={styles.miniFill} style={{ width: user.progress }}></div>
                      </div>
                      <span>{user.progress}</span>
                    </div>
                  </td>
                  <td>
                    <button className={styles.editBtn}>Manage</button>
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
