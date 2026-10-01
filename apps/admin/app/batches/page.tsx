"use client";

import { useEffect, useState, FormEvent } from "react";
import styles from "../page.module.css";
import Link from "next/link";

interface Batch {
  id: string;
  name: string;
  program: string;
  manager: string;
  students: number;
  status: string;
  startDate: string;
}

export default function BatchesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [programs, setPrograms] = useState<{id: string, title: string}[]>([]);
  const [managers, setManagers] = useState<{id: string, name: string, email: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [programId, setProgramId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [manager, setManager] = useState("");

  useEffect(() => {
    Promise.all([fetchBatches(), fetchPrograms(), fetchManagers()]).then(() => setIsLoading(false));
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/users`);
      if (res.ok) {
        const data = await res.json();
        setManagers(data.filter((u: any) => u.role === "MANAGER" || u.role === "SUPER_ADMIN"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/programs`);
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/batches`);
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
      }
    } catch (e) {
      console.error("Failed to fetch batches", e);
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const openEditModal = (batch: Batch) => {
    setEditingBatchId(batch.id);
    setName(batch.name);
    const p = programs.find(prog => prog.title === batch.program);
    setProgramId(p ? p.id : "");
    // Form date string yyyy-MM-dd
    const d = new Date(batch.startDate);
    if (!isNaN(d.getTime())) {
      setStartDate(d.toISOString().split('T')[0] || "");
    }
    setCapacity("50"); // We don't fetch capacity in list
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const openCreateModal = () => {
    setEditingBatchId(null);
    setName("");
    setProgramId("");
    setStartDate("");
    setCapacity("");
    setIsModalOpen(true);
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/batches/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBatches();
      }
    } catch (e) {
      console.error("Failed to delete batch", e);
    }
    setActiveDropdown(null);
  };

  const handleSaveBatch = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      programId: programId,
      startDate: new Date(startDate).toISOString(),
      capacity: parseInt(capacity) || 50,
      managerId: manager || null,
    };

    try {
      const url = editingBatchId 
        ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/batches/${editingBatchId}` 
        : `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/batches`;
      const method = editingBatchId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setName("");
        setProgramId("");
        setStartDate("");
        setCapacity("");
        setEditingBatchId(null);
        fetchBatches(); // Refresh list
      }
    } catch (e) {
      console.error("Failed to save batch", e);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Batches & Cohorts</h1>
          <p className={styles.subtitle}>Organize learners into groups and schedule live sessions.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn} onClick={openCreateModal}>
            + Create Batch
          </button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>All Batches</h2>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Search batches..." className={styles.searchInput} />
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Program</th>
                <th>Manager</th>
                <th>Start Date</th>
                <th>Students</th>
                <th>Status</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{textAlign: "center", padding: "20px"}}>Loading batches from database...</td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{textAlign: "center", padding: "20px"}}>No batches found. Create one!</td>
                </tr>
              ) : batches.map((batch) => (
                <tr key={batch.id}>
                  <td>
                    <span className={styles.cellUserName}>{batch.name}</span>
                  </td>
                  <td><span className={styles.cellText}>{batch.program}</span></td>
                  <td><span className={styles.cellTextMuted}>{batch.manager}</span></td>
                  <td><span className={styles.cellTextMuted}>{batch.startDate}</span></td>
                  <td><span className={styles.cellText}>{batch.students}</span></td>
                  <td>
                    <span className={`${styles.statusChip} ${styles[batch.status.toLowerCase()]}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className={styles.alignRight} style={{ position: 'relative' }}>
                    <button 
                      className={styles.iconActionBtn} 
                      title="More Actions"
                      onClick={() => toggleDropdown(batch.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </button>
                    {activeDropdown === batch.id && (
                      <div className={styles.actionDropdown}>
                        <button className={styles.dropdownItem} onClick={() => openEditModal(batch)}>Edit Schedule</button>
                        <Link href={`/batches/${batch.id}/sessions`} className={styles.dropdownItem} style={{ textDecoration: 'none' }}>Manage Sessions & Attendance</Link>
                        <button className={`${styles.dropdownItem} ${styles.textDanger}`} onClick={() => handleDeleteBatch(batch.id)}>Delete Batch</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE BATCH MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingBatchId ? "Edit Batch" : "Create New Batch"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form className={styles.modalForm} onSubmit={handleSaveBatch}>
              <div className={styles.formGroup}>
                <label>Batch Name</label>
                <input type="text" placeholder="e.g. Winter Cohort 2026" required value={name} onChange={e => setName(e.target.value)} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Assign Program</label>
                <select required value={programId} onChange={e => setProgramId(e.target.value)}>
                  <option value="">Select a Program</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Max Capacity</label>
                  <input type="number" placeholder="50" required value={capacity} onChange={e => setCapacity(e.target.value)} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Assign Manager</label>
                <select value={manager} onChange={e => setManager(e.target.value)}>
                  <option value="">Select a Manager</option>
                  {managers.map(m => (
                    <option key={m.id} value={m.id}>{m.name || m.email}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Save Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
