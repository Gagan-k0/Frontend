import styles from "../page.module.css";

const MOCK_INVOICES = [
  { id: "WBM-2026-0001", user: "John Doe", amount: "$1,999", date: "Oct 12, 2026", status: "Paid" },
  { id: "WBM-2026-0002", user: "Sarah Smith", amount: "$1,999", date: "Oct 12, 2026", status: "Paid" },
  { id: "WBM-2026-0003", user: "TechCorp LLC", amount: "$4,500", date: "Oct 14, 2026", status: "Pending" },
];

export default function InvoicesPage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Invoices</h1>
          <p className={styles.subtitle}>Manage auto-generated and manual invoices.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn}>+ Create Invoice</button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>All Invoices</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Billed To</th>
                <th>Amount</th>
                <th>Date Issued</th>
                <th>Status</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id}>
                  <td><span className={styles.cellText}>{inv.id}</span></td>
                  <td><span className={styles.cellUserName}>{inv.user}</span></td>
                  <td><span className={styles.cellText}>{inv.amount}</span></td>
                  <td><span className={styles.cellTextMuted}>{inv.date}</span></td>
                  <td>
                    <span className={`${styles.statusChip} ${inv.status === 'Paid' ? styles.completed : styles.pending}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className={styles.alignRight}>
                    <button className={styles.iconActionBtn} title="Download PDF">
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
