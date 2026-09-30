"use client";

import { useEffect, useState, FormEvent, use } from "react";
import styles from "../../page.module.css";
import Link from "next/link";

interface Step {
  id: string;
  sequence: number;
  title: string;
  description: string;
}

export default function ProgramCurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const programId = resolvedParams.id;
  const [steps, setSteps] = useState<Step[]>([]);
  const [programTitle, setProgramTitle] = useState("Loading...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sequence, setSequence] = useState(1);

  useEffect(() => {
    fetchProgram();
    fetchSteps();
  }, []);

  const fetchProgram = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs`);
      if (res.ok) {
        const data = await res.json();
        const prog = data.find((p: any) => p.id === programId);
        if (prog) setProgramTitle(prog.title);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSteps = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs/${programId}/steps`);
      if (res.ok) {
        const data = await res.json();
        setSteps(data);
        setSequence(data.length + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStep = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs/${programId}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          sequence: Number(sequence),
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        fetchSteps();
      }
    } catch (e) {
      console.error("Failed to create step", e);
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm("Are you sure you want to delete this section? This will also delete all associated lessons and quizzes.")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs/steps/${stepId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchSteps();
      } else {
        alert("Failed to delete section.");
      }
    } catch (e) {
      console.error("Error deleting section", e);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <Link href="/programs" style={{textDecoration: 'none', color: 'var(--primary)', fontSize: '1.2rem'}}>← Back</Link>
            <h1 className={styles.title}>Curriculum: {programTitle}</h1>
          </div>
          <p className={styles.subtitle}>Manage the sections (steps) for this program.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
            + Add Section (Step)
          </button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>Sections / Steps</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Step #</th>
                <th>Title</th>
                <th>Description</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} style={{textAlign: "center", padding: "20px"}}>Loading curriculum...</td>
                </tr>
              ) : steps.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{textAlign: "center", padding: "20px"}}>No sections created yet.</td>
                </tr>
              ) : steps.sort((a,b) => a.sequence - b.sequence).map((step) => (
                <tr key={step.id}>
                  <td><span className={styles.cellText}>Step {step.sequence}</span></td>
                  <td><span className={styles.cellUserName}>{step.title}</span></td>
                  <td><span className={styles.cellTextMuted}>{step.description || "No description"}</span></td>
                  <td className={styles.alignRight}>
                    <Link href={`/programs/${programId}/steps/${step.id}`} className={styles.secondaryBtn} style={{marginRight: '10px', textDecoration: 'none'}}>Manage Lessons</Link>
                    <button className={styles.secondaryBtn} style={{color: 'red'}} onClick={() => handleDeleteStep(step.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE STEP MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create New Section (Step)</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form className={styles.modalForm} onSubmit={handleCreateStep}>
              <div className={styles.formGroup}>
                <label>Sequence / Step Number</label>
                <input type="number" required value={sequence} onChange={(e) => setSequence(parseInt(e.target.value))} />
              </div>

              <div className={styles.formGroup}>
                <label>Section Title</label>
                <input type="text" placeholder="e.g. Self Discovery" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description (Optional)</label>
                <textarea rows={3} placeholder="What will learners learn in this step?" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Save Section</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
