"use client";

import { useEffect, useState, use } from "react";
import styles from "../../../../page.module.css";
import Link from "next/link";
import MuxUploader from "@mux/mux-uploader-react";

interface Lesson {
  id: string;
  title: string;
  type: string;
  mediaUrl: string;
}

export default function StepLessonsPage({ params }: { params: Promise<{ id: string, stepId: string }> }) {
  const resolvedParams = use(params);
  const { id: programId, stepId } = resolvedParams;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch(`http://localhost:4000/programs/steps/${stepId}/lessons`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const openUploadModal = async () => {
    setTitle("");
    setUploadUrl("");
    setUploadProgress(null);
    setIsModalOpen(true);
    
    try {
      const res = await fetch("http://localhost:4000/mux/upload-url", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setUploadUrl(data.url);
        setUploadId(data.uploadId);
      }
    } catch (e) {
      console.error("Failed to get upload URL", e);
    }
  };

  const handleUploadSuccess = async () => {
    try {
      const res = await fetch(`http://localhost:4000/programs/steps/${stepId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "New Video Lesson",
          type: "VIDEO",
          mediaUrl: `upload:${uploadId}`, // Save as uploadId with a prefix
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchLessons();
      }
    } catch (e) {
      console.error("Failed to save lesson", e);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <Link href={`/programs/${programId}`} style={{textDecoration: 'none', color: 'var(--primary)', fontSize: '1.2rem'}}>← Back to Sections</Link>
            <h1 className={styles.title}>Manage Lessons</h1>
          </div>
          <p className={styles.subtitle}>Upload videos or add quizzes to this section.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/quizzes/create?programId=${programId}&stepId=${stepId}`} className={styles.secondaryBtn}>
            + Add Quiz
          </Link>
          <button className={styles.primaryBtn} onClick={openUploadModal}>
            + Upload Video (Mux)
          </button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>Lessons in this Step</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} style={{textAlign: "center", padding: "20px"}}>Loading lessons...</td>
                </tr>
              ) : lessons.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{textAlign: "center", padding: "20px"}}>No lessons found. Upload a video!</td>
                </tr>
              ) : lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td><span className={styles.cellUserName}>{lesson.title}</span></td>
                  <td><span className={styles.cellTextMuted}>{lesson.type}</span></td>
                  <td><span className={`${styles.statusChip} ${styles.active}`}>Ready</span></td>
                  <td className={styles.alignRight}>
                    <button className={styles.secondaryBtn} style={{color: 'red'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Upload Video Lesson</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Lesson Title</label>
                <input type="text" placeholder="e.g. Video: Introduction" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className={styles.formGroup} style={{marginTop: '20px'}}>
                <label>Select Video File</label>
                {uploadUrl ? (
                  <>
                    <MuxUploader
                      endpoint={uploadUrl}
                      onSuccess={handleUploadSuccess}
                      onProgress={(e: any) => setUploadProgress(e.detail)}
                    />
                    {uploadProgress !== null && (
                      <div style={{ marginTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '500', color: 'var(--textSecondary)' }}>
                          <span>Uploading...</span>
                          <span>{Math.round(uploadProgress)}% pending</span>
                        </div>
                        <div style={{ width: '100%', backgroundColor: '#eaeaea', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${uploadProgress}%`, 
                            backgroundColor: 'var(--primary)', 
                            height: '100%', 
                            borderRadius: '8px',
                            transition: 'width 0.2s ease-in-out'
                          }} />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p>Generating secure upload link...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
