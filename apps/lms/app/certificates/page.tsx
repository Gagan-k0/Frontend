"use client";

import { useEffect, useState } from "react";
import styles from "./certificates.module.css";
import { useRouter } from "next/navigation";

export default function CertificatesPage() {
  const router = useRouter();
  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.enrolledPrograms) {
        setEnrolledPrograms(data.enrolledPrograms);
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [router]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Certificates</h1>
        <p className={styles.subtitle}>Your verified credentials.</p>
      </header>

      {loading ? (
        <div className={styles.emptyState}>
          <h2>Loading...</h2>
        </div>
      ) : enrolledPrograms.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.icon}>🎓</div>
          <h2>No certificates yet</h2>
          <p>Enroll in a program and pass the final exam to earn your first certificate.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {enrolledPrograms.map((prog) => (
            <div key={prog.programId} className={styles.emptyState} style={{ marginTop: 0 }}>
              {prog.progress >= 100 ? (
                <>
                  <div className={styles.icon} style={{color: 'gold'}}>🏆</div>
                  <h2>Certificate Earned!</h2>
                  <p>Congratulations! You have successfully completed <strong>{prog.programTitle}</strong>.</p>
                  <button style={{marginTop: '1rem', padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}>
                    Download Certificate
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.icon}>🎓</div>
                  <h2>Certificate Pending</h2>
                  <p>Complete <strong>{prog.programTitle}</strong> and pass the final exam to earn your certificate.</p>
                  <div className={styles.progressPlaceholder} style={{ marginTop: '2rem' }}>
                    <div className={styles.progressBar} style={{ width: '100%', background: 'var(--border-light)', height: '10px', borderRadius: '10px', overflow: 'hidden' }}>
                      <div className={styles.fill} style={{width: `${prog.progress}%`, background: 'var(--primary)', height: '100%'}}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{prog.progress}% Completed</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
