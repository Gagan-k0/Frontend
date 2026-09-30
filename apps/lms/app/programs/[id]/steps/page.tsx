"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProgramStepsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:4000/programs/${unwrappedParams.id}/steps`)
      .then(res => res.json())
      .then(data => {
        setSteps(data);
        setLoading(false);
      })
      .catch(e => {
        console.error("Failed to fetch steps", e);
        setLoading(false);
      });
  }, [unwrappedParams.id]);

  if (loading) {
    return <div style={{ padding: "4rem", textAlign: "center" }}>Loading your learning path...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", marginBottom: "2rem" }}>
        &larr; Back to Dashboard
      </button>

      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--text-primary)" }}>Your Learning Path</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>Complete the steps below in sequence to unlock your certificate.</p>

      {steps.length === 0 ? (
        <div style={{ padding: "3rem", background: "var(--bg-card)", borderRadius: "12px", textAlign: "center", border: "1px dashed var(--border-light)" }}>
          <h3 style={{ color: "var(--text-primary)" }}>No Steps Yet</h3>
          <p style={{ color: "var(--text-secondary)" }}>The curriculum for this program is currently being built. Check back soon!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {steps.map((step, index) => {
            const isFirst = index === 0;
            return (
              <div key={step.id} style={{ 
                background: "var(--bg-card)", 
                padding: "1.5rem", 
                borderRadius: "12px", 
                border: isFirst ? "2px solid var(--accent-primary)" : "1px solid var(--border-light)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>Step {step.sequence}: {step.title}</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>{step.description || "Learn the fundamentals in this step."}</p>
                </div>
                
                <Link 
                  href={`/steps/${step.id}`} 
                  style={{ 
                    background: isFirst ? "var(--accent-primary)" : "var(--bg-main)", 
                    color: isFirst ? "white" : "var(--text-secondary)", 
                    padding: "0.75rem 1.5rem", 
                    borderRadius: "8px", 
                    textDecoration: "none", 
                    fontWeight: 600,
                    border: isFirst ? "none" : "1px solid var(--border-light)"
                  }}
                >
                  {isFirst ? "Start Step" : "Locked"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
