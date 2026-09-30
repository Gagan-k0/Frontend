"use client";

import { useEffect, useState, FormEvent } from "react";
import styles from "../page.module.css";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  progress?: string;
  cohort?: string;
  joined?: string;
}

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [batches, setBatches] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cohort, setCohort] = useState("");

  useEffect(() => {
    Promise.all([fetchUsers(), fetchBatches()]);
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}/batches`);
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setEmail(user.email);
    const names = user.name ? user.name.split(" ") : ["", ""];
    setFirstName(names[0] || "");
    setLastName(names.slice(1).join(" ") || "");
    setCohort(""); // Real implementation would resolve cohort to batch ID
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const openCreateModal = () => {
    setEditingUserId(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setCohort("");
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to revoke access and delete this user?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error("Failed to delete user", e);
    }
    setActiveDropdown(null);
  };

  const handleSaveUser = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      email,
      name: `${firstName} ${lastName}`,
      passwordHash: "Learner@2026", // Default password for new invites
      role: "LEARNER",
    };

    try {
      const url = editingUserId 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users/${editingUserId}` 
        : `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}/users`;
      const method = editingUserId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEmail("");
        setFirstName("");
        setLastName("");
        setEditingUserId(null);
        fetchUsers();
      }
    } catch (e) {
      console.error("Failed to save user", e);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Users & Enrolments</h1>
          <p className={styles.subtitle}>Manage all learners across your programs.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn}>Filter</button>
          <button className={styles.primaryBtn} onClick={openCreateModal}>+ Invite User</button>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>All Learners ({users.length})</h2>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Search by name or email..." className={styles.searchInput} />
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Learner</th>
                <th>Joined</th>
                <th>Cohort</th>
                <th>Status</th>
                <th>Progress</th>
                <th className={styles.alignRight}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{textAlign: "center", padding: "20px"}}>Loading users from database...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{textAlign: "center", padding: "20px"}}>No users found.</td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.cellUser}>
                      <span className={styles.cellUserName}>{user.name}</span>
                      <span className={styles.cellUserEmail}>{user.email}</span>
                    </div>
                  </td>
                  <td><span className={styles.cellTextMuted}>{user.joined || "Just now"}</span></td>
                  <td>
                    <span className={styles.cellText}>{user.cohort || "None"}</span>
                  </td>
                  <td>
                    <span className={`${styles.statusChip} ${styles[user.status.toLowerCase()] || styles.active}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.progressCell}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: user.progress || "0%" }}></div>
                      </div>
                      <span className={styles.progressText}>{user.progress || "0%"}</span>
                    </div>
                  </td>
                  <td className={styles.alignRight} style={{ position: 'relative' }}>
                    <button 
                      className={styles.iconActionBtn} 
                      title="More Actions"
                      onClick={(e) => toggleDropdown(e, user.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </button>
                    {activeDropdown === user.id && (
                      <div className={styles.actionDropdown}>
                        <Link href={`/users/${user.id}`} className={styles.dropdownItem} style={{display: 'block', textDecoration: 'none'}}>View Full Profile</Link>
                        <button className={styles.dropdownItem} onClick={() => openEditModal(user)}>Edit User</button>
                        <button className={`${styles.dropdownItem} ${styles.textDanger}`} onClick={() => handleDeleteUser(user.id)}>Revoke Access</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* INVITE USER MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingUserId ? "Edit User" : "Invite New Learner"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form className={styles.modalForm} onSubmit={handleSaveUser}>
              <div className={styles.formGroup}>
                <label>Learner Email</label>
                <input type="email" placeholder="name@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input type="text" placeholder="John" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input type="text" placeholder="Doe" required value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Assign to Cohort (Optional)</label>
                <select value={cohort} onChange={e => setCohort(e.target.value)}>
                  <option value="">None (Pending Placement)</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>{editingUserId ? "Save Changes" : "Send Invite"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
