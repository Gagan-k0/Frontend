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
                    <button className={styles.secondaryBtn} style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Download PDF</button>
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
