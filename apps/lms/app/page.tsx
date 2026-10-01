"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Inline SVGs for Dashboard
const Icons = {
  Wave: () => <span className={styles.greetingIcon}>👋</span>,
  ArrowRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  ProgramBook: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  SessionCal: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  CertificateRibbon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
  ProgressChart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Trophy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>,
  Clock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a3aed1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Bulb: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.76 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path></svg>
};

interface EnrolledProgram {
  enrolmentId: string;
  batchId: string;
  batchName: string;
  programId: string;
  programTitle: string;
  status: string;
  progress: number;
}

interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  joinUrl: string | null;
  recordingUrl: string | null;
  quizId: string | null;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  enrolledPrograms: EnrolledProgram[];
  upcomingSessions: Session[];
}

export default function LearnerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((profile: UserProfile) => {
        setUser(profile);
        // Also fetch their certificates
        return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/certificates/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(res => res.ok ? res.json() : [])
      .then(certs => {
        setCertificates(certs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const requestCertificate = async (enrolmentId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/certificates/request/${enrolmentId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Certificate requested! It is now pending Admin approval.");
        window.location.reload();
      } else {
        alert("Failed to request certificate. You may have already requested it.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstName = user.name ? user.name.split(" ")[0] : "Learner";
  const numEnrolled = user.enrolledPrograms.length;
  const isEnrolled = numEnrolled > 0;

  return (
    <div className={styles.dashboard}>
      {/* 1. GREETING SECTION */}
      <section className={styles.greeting}>
        <Icons.Wave />
        <div className={styles.greetingText}>
          <h1>Good Afternoon, <span>{firstName}!</span></h1>
          {isEnrolled ? (
            <p>Welcome back! You have {numEnrolled} active program(s) in progress.</p>
          ) : (
            <p>You are not enrolled in any program yet. Browse our programs to get started!</p>
          )}
        </div>
      </section>

      {/* 2. HERO BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>LEARN &bull; GROW &bull; ACHIEVE</div>
          <h2>Start Your <span>Learning Journey</span></h2>
          <p>Explore industry-relevant programs, join live sessions, and earn certificates to build your future.</p>
          <Link href="http://localhost:3001/programs" className={styles.primaryBtn}>
            Browse Programs <Icons.ArrowRight />
          </Link>
        </div>
        <div className={styles.heroIllustration}>
          {/* Using a placeholder since we don't have the exact illustration asset */}
          <div style={{
            width: '300px', height: '100%', 
            background: 'url("https://illustrations.popsy.co/amber/student-going-to-school.svg") no-repeat center bottom / contain',
            opacity: 0.9
          }}></div>
        </div>
      </section>

      {/* 3. STAT CARDS ROW */}
      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <div className={styles.statIcon} style={{ background: '#f4f0ff', color: '#8c81fa' }}>
              <Icons.ProgramBook />
            </div>
            <div className={styles.statText}>
              <h4>Programs</h4>
              <h2>{numEnrolled}</h2>
              <p>Enrolled programs</p>
            </div>
          </div>
          <div className={styles.statArrow}><Icons.ChevronRight /></div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <div className={styles.statIcon} style={{ background: '#e6f3ff', color: '#3b82f6' }}>
              <Icons.SessionCal />
            </div>
            <div className={styles.statText}>
              <h4>Live Sessions</h4>
              <h2>{user.upcomingSessions?.length || 0}</h2>
              <p>Upcoming sessions</p>
            </div>
          </div>
          <div className={styles.statArrow}><Icons.ChevronRight /></div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <div className={styles.statIcon} style={{ background: '#e6faf5', color: '#05cd99' }}>
              <Icons.CertificateRibbon />
            </div>
            <div className={styles.statText}>
              <h4>Certificates</h4>
              <h2>{certificates.length}</h2>
              <p>Certificates earned</p>
            </div>
          </div>
          <div className={styles.statArrow}><Icons.ChevronRight /></div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <div className={styles.statIcon} style={{ background: '#fffbf0', color: '#ffce20' }}>
              <Icons.ProgressChart />
            </div>
            <div className={styles.statText}>
              <h4>Learning Progress</h4>
              <h2>{isEnrolled ? (user.enrolledPrograms[0]?.progress || 0) : 0}%</h2>
              <p>Overall completion</p>
            </div>
          </div>
          <div className={styles.statArrow}><Icons.ChevronRight /></div>
        </div>
      </section>

      {/* 4. MAIN CONTENT GRID */}
      <section className={styles.mainGrid}>
        
        {/* Left Side: Your Programs */}
        <div className={styles.card} style={{ gridRow: 'span 2' }}>
          <div className={styles.cardHeader}>
            <h3><Icons.Star /> Your Programs</h3>
            <Link href="http://localhost:3001/programs" className={styles.cardLink}>Browse Programs <Icons.ArrowRight /></Link>
          </div>
          
          {!isEnrolled ? (
            <div className={styles.emptyState} style={{ padding: '4rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
              <h4>No Active Programs</h4>
              <p>You haven't enrolled in any learning program yet. Start exploring courses created for you.</p>
              <Link href="http://localhost:3001/programs" className={styles.primaryBtn} style={{ marginTop: '1rem' }}>
                Browse Programs <Icons.ArrowRight />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {user.enrolledPrograms.map((prog) => (
                <div key={prog.programId} style={{ border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.5rem', background: 'var(--bg-main)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{prog.programTitle}</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cohort: {prog.batchName}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Progress</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{prog.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div style={{ width: `${prog.progress}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                  </div>

                  <Link href={`/programs/${prog.programId}/steps`} style={{ textDecoration: 'none', background: 'var(--accent-primary)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-block' }}>
                    Resume Learning
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Upper: Sessions & Achievements */}
        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 style={{ fontSize: '0.95rem' }}><Icons.SessionCal /> Upcoming Sessions</h3>
              <Link href="/live" className={styles.cardLink} style={{ fontSize: '0.75rem' }}>View Calendar <Icons.ArrowRight /></Link>
            </div>
            
            {(!user.upcomingSessions || user.upcomingSessions.length === 0) ? (
              <div className={styles.emptyState}>
                <div style={{ color: 'var(--border-light)', marginBottom: '0.5rem' }}><Icons.SessionCal /></div>
                <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.2rem 0' }}>No upcoming sessions</h4>
                <p style={{ fontSize: '0.75rem' }}>You don't have any live sessions scheduled yet. Check back later!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {user.upcomingSessions.map((session) => {
                  const now = new Date();
                  const startTime = new Date(session.startTime);
                  const endTime = new Date(session.endTime);
                  
                  // Check-in window opens 5 mins before start
                  const checkInOpen = now >= new Date(startTime.getTime() - 5 * 60000) && now <= endTime;

                  const handleCheckIn = async () => {
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/sessions/${session.id}/attend`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (res.ok) {
                        alert("Checked in successfully!");
                        // Optionally refresh or open the joinUrl
                        if (session.joinUrl) window.open(session.joinUrl, '_blank');
                      } else {
                        const data = await res.json();
                        alert(`Check-in failed: ${data.message || 'Unknown error'}`);
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  };

                  return (
                    <div key={session.id} style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-main)' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{session.title}</h4>
                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {startTime.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      
                      {checkInOpen ? (
                        <button onClick={handleCheckIn} className={styles.primaryBtn} style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem', marginBottom: '0.5rem' }}>
                          Check In & Join
                        </button>
                      ) : now > endTime ? (
                        <div style={{ padding: '0.5rem', background: 'var(--border-light)', color: 'var(--text-secondary)', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                          Session Ended
                        </div>
                      ) : (
                        <button disabled style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem', background: 'var(--border-light)', color: 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'not-allowed', marginBottom: '0.5rem' }}>
                          Check-in opens 5 mins before
                        </button>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {session.recordingUrl && (
                          <a href={session.recordingUrl} target="_blank" rel="noreferrer" className={styles.secondaryBtn} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', padding: '0.4rem', textDecoration: 'none' }}>
                            View Recording
                          </a>
                        )}
                        {session.quizId && (
                          <a href={`/steps/${session.quizId}?isQuiz=true`} className={styles.primaryBtn} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', padding: '0.4rem', textDecoration: 'none' }}>
                            Take Quiz
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 style={{ fontSize: '0.95rem' }}><Icons.CertificateRibbon /> Certificates</h3>
            </div>
            {certificates.length === 0 && !user.enrolledPrograms.some(p => p.progress === 100) ? (
              <div className={styles.emptyState}>
                <div style={{ marginBottom: '0.5rem' }}><Icons.Trophy /></div>
                <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.2rem 0' }}>Complete your first course</h4>
                <p style={{ fontSize: '0.75rem' }}>Earn badges and certificates as you progress.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {certificates.map(cert => (
                  <div key={cert.id} style={{ padding: '1rem', border: '1px solid #05cd99', borderRadius: '8px', background: '#e6faf5' }}>
                    <h4 style={{ margin: '0 0 0.2rem 0', color: '#04a87d' }}>{cert.enrolment?.batch?.program?.title}</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#04a87d' }}>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                    <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className={styles.primaryBtn} style={{ background: '#05cd99', border: 'none', padding: '0.4rem 0.8rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block' }}>Download PDF</a>
                  </div>
                ))}

                {user.enrolledPrograms.filter(p => p.progress === 100).map(prog => (
                  <div key={prog.enrolmentId} style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-main)' }}>
                    <h4 style={{ margin: '0 0 0.2rem 0' }}>{prog.programTitle}</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>You have completed 100% of this program!</p>
                    <button onClick={() => requestCertificate(prog.enrolmentId)} className={styles.primaryBtn} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Request Certificate</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Lower: Activity & Tips */}
        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 style={{ fontSize: '0.95rem' }}><Icons.Clock /> Recent Activity</h3>
            </div>
            <div className={styles.emptyState}>
              <div style={{ color: 'var(--border-light)', marginBottom: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.2rem 0' }}>Nothing yet</h4>
              <p style={{ fontSize: '0.75rem' }}>Your learning activity will appear here once you start a program.</p>
            </div>
          </div>

          <div className={styles.tipsCard}>
            <div className={styles.tipsContent}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Icons.Bulb />
                <h4 style={{ margin: 0, fontSize: '0.85rem' }}>Tip: Start with a program you're interested in</h4>
              </div>
              <p style={{ fontSize: '0.75rem' }}>Explore our curated programs to gain new skills and advance your career.</p>
              <div style={{ fontSize: '2rem', marginTop: '1rem' }}>📚</div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
