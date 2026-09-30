"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fcfcfc", fontFamily: "var(--font-geist-sans)" }}>
      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.05)" : "none",
        transition: "all 0.3s ease",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 4rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "32px", height: "32px", backgroundColor: "var(--accent-primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
            W
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>WhatBoutMe</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="#programs" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>Programs</Link>
          <Link href="#about" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>About</Link>
          <Link href="/login" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>Login</Link>
          <Link href="/signup" style={{ 
            backgroundColor: "var(--accent-primary)", color: "white", padding: "0.6rem 1.2rem", 
            borderRadius: "6px", textDecoration: "none", fontWeight: 600,
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)"
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        padding: "10rem 2rem 6rem",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        background: "linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ 
          position: "absolute", top: "-100px", left: "-100px", width: "400px", height: "400px", 
          background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%" 
        }}></div>
        <div style={{ 
          position: "absolute", bottom: "-100px", right: "-100px", width: "500px", height: "500px", 
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%" 
        }}></div>

        <div style={{ display: "inline-block", padding: "0.4rem 1rem", backgroundColor: "rgba(79, 70, 229, 0.1)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          NEW: 11 Steps to U Certification is Live! 🚀
        </div>
        
        <h1 style={{ fontSize: "4.5rem", fontWeight: 800, color: "var(--text-primary)", maxWidth: "900px", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
          Build unbreakable <span style={{ color: "var(--accent-primary)" }}>resilience</span> for your mind and career.
        </h1>
        
        <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "600px", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          Join Roweena Britto's exclusive learning platform. Master the 11 Steps to U, attend live workshops, and unlock your true potential.
        </p>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/signup" style={{ 
            backgroundColor: "var(--accent-primary)", color: "white", padding: "1rem 2rem", 
            borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem",
            boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)", transition: "transform 0.2s"
          }}>
            Explore Programs
          </Link>
          <Link href="#about" style={{ 
            backgroundColor: "white", color: "var(--text-primary)", padding: "1rem 2rem", 
            borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem",
            border: "1px solid var(--border-light)", transition: "all 0.2s"
          }}>
            Watch Free Demo
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "4rem", marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid var(--border-light)" }}>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>10,000+</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>Lives Impacted</p>
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>11</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>Proven Steps</p>
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>100%</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* FEATURED PROGRAMS SECTION */}
      <section id="programs" style={{ padding: "6rem 2rem", backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1rem" }}>Featured Programs</h2>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "4rem", textAlign: "center", maxWidth: "600px" }}>
          Whether you are an individual looking for self-improvement or a corporate team building resilience, we have a path for you.
        </p>

        <div style={{ display: "flex", gap: "2rem", maxWidth: "1000px", width: "100%", flexWrap: "wrap", justifyContent: "center" }}>
          
          {/* Card 1 */}
          <div style={{ 
            flex: "1 1 300px", maxWidth: "380px", borderRadius: "16px", overflow: "hidden", 
            border: "1px solid var(--border-light)", backgroundColor: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)", transition: "transform 0.3s ease"
          }}>
            <div style={{ height: "200px", backgroundColor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: "15px", left: "15px", backgroundColor: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                CERTIFICATION
              </div>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", color: "var(--text-primary)" }}>11 Steps to U Masterclass</h3>
              <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                The flagship certification program. Master your mindset, overcome anxiety, and build lasting resilience.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>$1,999</span>
                <Link href="/login" style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>View Details &rarr;</Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ 
            flex: "1 1 300px", maxWidth: "380px", borderRadius: "16px", overflow: "hidden", 
            border: "1px solid var(--border-light)", backgroundColor: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)", transition: "transform 0.3s ease"
          }}>
            <div style={{ height: "200px", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: "15px", left: "15px", backgroundColor: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, color: "#10b981" }}>
                CORPORATE
              </div>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", color: "var(--text-primary)" }}>Corporate Resilience</h3>
              <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                A custom 4-week workshop for your leadership team to foster mental well-being in the workplace.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>Custom</span>
                <Link href="/login" style={{ color: "#10b981", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>Contact Us &rarr;</Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INSTRUCTOR SECTION */}
      <section id="about" style={{ padding: "6rem 2rem", backgroundColor: "#f9fafb", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1000px", width: "100%", display: "flex", gap: "4rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#e5e7eb", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#9ca3af", fontSize: "1.2rem" }}>[Roweena Photo]</span>
            </div>
          </div>
          <div style={{ flex: 1.5, minWidth: "300px" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1.5rem" }}>Meet Roweena Britto</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
              Roweena is a certified Brain-Health Coach and the founder of WhatBoutMe. With over a decade of experience, she has helped thousands of individuals and corporate teams unlock their full potential.
            </p>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
              Her unique "11 Steps to U" framework combines neuroscience, psychology, and practical habits to build unbreakable mental resilience.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "1rem", color: "var(--text-primary)", fontWeight: 500 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Certified Brain-Health Coach
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "1rem", color: "var(--text-primary)", fontWeight: 500 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                International Speaker & Author
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "4rem 2rem", backgroundColor: "#1f2937", color: "white", textAlign: "center" }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>WhatBoutMe FZE</h3>
        <p style={{ color: "#9ca3af", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem" }}>
          Empowering individuals and teams through neuroscience and practical resilience training.
        </p>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>&copy; 2026 WhatBoutMe FZE. All rights reserved.</p>
      </footer>
    </div>
  );
}
