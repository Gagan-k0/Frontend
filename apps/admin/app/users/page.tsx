import styles from "../page.module.css";
import Link from "next/link";

const ALL_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", cohort: "Alpha Cohort 2026", progress: "18%", status: "Active", joined: "Oct 12, 2026" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", cohort: "Alpha Cohort 2026", progress: "45%", status: "Active", joined: "Oct 12, 2026" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", cohort: "Alpha Cohort 2026", progress: "0%", status: "Pending", joined: "Oct 14, 2026" },
  { id: 4, name: "Emma Davis", email: "emma@example.com", cohort: "Beta Cohort 2026", progress: "100%", status: "Completed", joined: "Sep 01, 2026" },
  { id: 5, name: "Tom Wilson", email: "tom@example.com", cohort: "Beta Cohort 2026", progress: "100%", status: "Completed", joined: "Sep 01, 2026" },
  { id: 6, name: "Lisa Brown", email: "lisa@example.com", cohort: "Alpha Cohort 2026", progress: "9%", status: "Active", joined: "Oct 12, 2026" },
];

export default function UsersPage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Users & Enrolments</h1>
          <p className={styles.subtitle}>Manage all learners across your programs.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn}>Filter</button>
          <button className={styles.primaryBtn}>+ Invite User</button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>All Learners ({ALL_USERS.length})</h2>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Search by name or email..." className={styles.searchInput} />
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Learner</th>
                <th>Joined</th>
                <th>Cohort</th>
                <th>Status</th>
                <th>Progress</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ALL_USERS.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.cellUser}>
                      <span className={styles.cellUserName}>{user.name}</span>
                      <span className={styles.cellUserEmail}>{user.email}</span>
                    </div>
                  </td>
                  <td><span className={styles.cellTextMuted}>{user.joined}</span></td>
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
                    <Link href={`/users/${user.id}`} className={styles.iconActionBtn} title="View Details">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </Link>
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
