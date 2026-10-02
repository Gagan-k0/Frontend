"use client";

import styles from "./login.module.css";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hide sidebar for login page
    document.body.classList.add("login-page-active");
    return () => {
      document.body.classList.remove("login-page-active");
    };
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`}`}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>WBM Admin</div>
        <h2>Sign in to your account</h2>
        <p>Enter your admin credentials to access the dashboard</p>
        
        {error && <div style={{color: '#e74c3c', background: 'rgba(231,76,60,0.1)', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px'}}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" required placeholder="admin@whatboutme.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => { setEmail(process.env.NEXT_PUBLIC_DEMO_SUPER_EMAIL || ''); setPassword(process.env.NEXT_PUBLIC_DEMO_PASSWORD || ''); }} style={{ flex: 1, padding: '5px', fontSize: '11px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', color: 'black' }}>Super Admin</button>
            <button type="button" onClick={() => { setEmail(process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || ''); setPassword(process.env.NEXT_PUBLIC_DEMO_PASSWORD || ''); }} style={{ flex: 1, padding: '5px', fontSize: '11px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', color: 'black' }}>Admin</button>
            <button type="button" onClick={() => { setEmail(process.env.NEXT_PUBLIC_DEMO_MANAGER_EMAIL || ''); setPassword(process.env.NEXT_PUBLIC_DEMO_PASSWORD || ''); }} style={{ flex: 1, padding: '5px', fontSize: '11px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', color: 'black' }}>Manager</button>
          </div>
          
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
