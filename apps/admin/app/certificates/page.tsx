"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function CertificatesQueue() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("whatboutme_admin_token") || localStorage.getItem("whatboutme_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCertificates(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem("whatboutme_admin_token") || localStorage.getItem("whatboutme_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/certificates/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCertificates(); // Refresh queue
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Certificate Approval Queue</h1>
          <p className={styles.subtitle}>Review and approve pending certificate requests from learners.</p>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Learner</th>
                <th>Program & Batch</th>
                <th>Request Date</th>
                <th>Status</th>
                <th className={styles.alignRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{textAlign: "center", padding: "20px"}}>Loading queue...</td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{textAlign: "center", padding: "20px"}}>No pending certificate requests.</td>
                </tr>
              ) : certificates.map((cert) => (
                <tr key={cert.id}>
                  <td>
                    <span className={styles.cellUserName}>{cert.enrolment?.user?.name || 'Unknown'}</span>
                    <br/>
                    <span className={styles.cellTextMuted} style={{fontSize: '0.8rem'}}>{cert.enrolment?.user?.email}</span>
                  </td>
                  <td>
                    <span className={styles.cellText}>{cert.enrolment?.batch?.program?.title}</span>
                    <br/>
                    <span className={styles.cellTextMuted} style={{fontSize: '0.8rem'}}>{cert.enrolment?.batch?.name}</span>
                  </td>
                  <td><span className={styles.cellTextMuted}>{new Date(cert.createdAt).toLocaleDateString()}</span></td>
                  <td>
                    <span className={`${styles.statusChip} ${styles[cert.status.toLowerCase()] || ''}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className={styles.alignRight}>
                    {cert.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className={styles.primaryBtn} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleAction(cert.id, 'approve')}>Approve</button>
                        <button className={styles.secondaryBtn} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'red', borderColor: 'red' }} onClick={() => handleAction(cert.id, 'reject')}>Reject</button>
                      </div>
                    )}
                    {cert.status === 'APPROVED' && (
                      <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className={styles.secondaryBtn} style={{ textDecoration: 'none', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View PDF</a>
                    )}
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
