import styles from "../page.module.css";

const MOCK_REVENUE = [
  { id: "inv_123", user: "John Doe", amount: "$1,999", date: "Oct 12, 2026", status: "Paid", method: "Stripe (Card)" },
  { id: "inv_124", user: "Sarah Smith", amount: "$1,999", date: "Oct 12, 2026", status: "Paid", method: "Stripe (Card)" },
  { id: "inv_125", user: "Mike Johnson", amount: "$1,999", date: "Oct 14, 2026", status: "Pending", method: "Invoice" },
];

export default function RevenuePage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Revenue & Payments</h1>
          <p className={styles.subtitle}>Track Stripe transactions and pending invoices.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn}>Export CSV</button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Transactions</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Learner</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REVENUE.map((tx) => (
                <tr key={tx.id}>
                  <td><span className={styles.cellTextMuted}>{tx.id}</span></td>
                  <td><span className={styles.cellUserName}>{tx.user}</span></td>
                  <td><span className={styles.cellText}>{tx.amount}</span></td>
                  <td><span className={styles.cellTextMuted}>{tx.date}</span></td>
                  <td><span className={styles.cellTextMuted}>{tx.method}</span></td>
                  <td>
                    <span className={`${styles.statusChip} ${tx.status === 'Paid' ? styles.completed : styles.pending}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={styles.alignRight}>
                    <button className={styles.iconActionBtn}>📄</button>
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
