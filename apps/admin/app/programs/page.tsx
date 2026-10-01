"use client";

import { useEffect, useState, FormEvent } from "react";
import styles from "../page.module.css";
import Link from "next/link";

interface Program {
  id: string;
  title: string;
  type: string;
  price: number;
  status: string;
  hasCertificate: boolean;
  certificateTemplate: string | null;
}

export default function ProgramsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Certification");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [hasCertificate, setHasCertificate] = useState(false);
  const [certificateTemplate, setCertificateTemplate] = useState("default_template_v1");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs`);
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
    } catch (e) {
      console.error("Failed to fetch programs", e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const openEditModal = (prog: Program) => {
    setEditingProgramId(prog.id);
    setTitle(prog.title);
    setType(prog.type || "Certification");
    setPrice(prog.price ? prog.price.toString() : "");
    setDescription(""); // Description not in table but would be fetched ideally
    setHasCertificate(prog.hasCertificate || false);
    setCertificateTemplate(prog.certificateTemplate || "default_template_v1");
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const openCreateModal = () => {
    setEditingProgramId(null);
    setTitle("");
    setType("Certification");
    setPrice("");
    setDescription("");
    setHasCertificate(false);
    setCertificateTemplate("default_template_v1");
    setIsModalOpen(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to archive this program?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPrograms();
      }
    } catch (e) {
      console.error("Failed to delete program", e);
    }
    setActiveDropdown(null);
  };

  const handleSaveProgram = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      type,
      price: parseFloat(price) || 0,
      description,
      status: "Active", // Default status
      hasCertificate,
      certificateTemplate: hasCertificate ? certificateTemplate : null,
    };

    try {
      const url = editingProgramId 
        ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs/${editingProgramId}` 
        : `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs`;
      
      const method = editingProgramId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setPrice("");
        setDescription("");
        setEditingProgramId(null);
        fetchPrograms(); // Refresh list
      }
    } catch (e) {
      console.error("Failed to save program", e);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Programs & Curriculum</h1>
          <p className={styles.subtitle}>Manage your courses, videos, and step requirements.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn} onClick={openCreateModal}>
            + Create Program
          </button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>All Programs</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Program Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Steps/Modules</th>
                <th>Status</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{textAlign: "center", padding: "20px"}}>Loading programs from database...</td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{textAlign: "center", padding: "20px"}}>No programs found. Create one!</td>
                </tr>
              ) : programs.map((prog) => (
                <tr key={prog.id}>
                  <td>
                    <span className={styles.cellUserName}>{prog.title}</span>
                  </td>
                  <td><span className={styles.cellTextMuted}>{prog.type}</span></td>
                  <td><span className={styles.cellText}>${prog.price}</span></td>
                  <td><span className={styles.cellText}>--</span></td>
                  <td>
                    <span className={`${styles.statusChip} ${prog.status === 'Draft' ? styles.locked : styles.active}`}>
                      {prog.status}
                    </span>
                  </td>
                  <td className={styles.alignRight} style={{ position: 'relative' }}>
                    <button 
                      className={styles.iconActionBtn} 
                      title="More Actions"
                      onClick={() => toggleDropdown(prog.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </button>
                    {activeDropdown === prog.id && (
                      <div className={styles.actionDropdown}>
                        <Link href={`/programs/${prog.id}`} className={styles.dropdownItem} style={{display: 'block', textDecoration: 'none'}}>Edit Curriculum (Steps)</Link>
                        <button className={styles.dropdownItem} onClick={() => openEditModal(prog)}>Edit Program Settings</button>
                        <button className={`${styles.dropdownItem} ${styles.textDanger}`} onClick={() => handleDeleteProgram(prog.id)}>Archive Program</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE PROGRAM MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingProgramId ? "Edit Program" : "Create New Program"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form className={styles.modalForm} onSubmit={handleSaveProgram}>
              <div className={styles.formGroup}>
                <label>Program Title</label>
                <input type="text" placeholder="e.g. 11 Steps to U" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Certification</option>
                    <option>Corporate</option>
                    <option>Single Session</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Price (USD)</label>
                  <input type="number" placeholder="1999" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea rows={4} placeholder="Briefly describe what this program covers..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>

              <div className={styles.formRow} style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="hasCertificate" checked={hasCertificate} onChange={(e) => setHasCertificate(e.target.checked)} style={{ width: 'auto' }} />
                  <label htmlFor="hasCertificate" style={{ margin: 0 }}>Enable Certificates for this Program</label>
                </div>
              </div>

              {hasCertificate && (
                <div className={styles.formGroup}>
                  <label>Certificate Template</label>
                  <select value={certificateTemplate} onChange={(e) => setCertificateTemplate(e.target.value)}>
                    <option value="default_template_v1">Default Modern (V1)</option>
                    <option value="corporate_template_v1">Corporate Professional (V1)</option>
                    <option value="creative_template_v1">Creative Flow (V1)</option>
                  </select>
                </div>
              )}

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Save Program</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
