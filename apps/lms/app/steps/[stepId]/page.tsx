"use client";

import { useEffect, useState, use } from "react";
import styles from "./step.module.css";
import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react";

export default function StepPage({ params }: { params: Promise<{ stepId: string }> }) {
  const unwrappedParams = use(params);
  const stepId = unwrappedParams.stepId;
  const [step, setStep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ passed: boolean; score: number; message: string } | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/programs/steps/${stepId}`)
      .then(res => res.json())
      .then(data => {
        setStep(data);
        
        // Handle resolving Mux playback ID
        const lesson = data.lessons?.[0];
        let uploadId = null;

        if (lesson && lesson.mediaUrl?.startsWith('upload:')) {
          uploadId = lesson.mediaUrl.replace('upload:', '');
        } else if (lesson && lesson.mediaUrl?.includes('/upload/')) {
          // Backwards compatibility for raw Mux direct upload URLs
          try {
            uploadId = lesson.mediaUrl.split('/upload/')[1].split('?')[0];
          } catch (e) {}
        }

        if (uploadId) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/mux/upload/${uploadId}`)
            .then(r => r.json())
            .then(muxData => {
              if (muxData.status === 'ready' && muxData.playbackId) {
                setPlaybackId(muxData.playbackId);
              } else {
                setPlaybackId("DS00Spx1CV902MCtPj5WknGlR102V5HFkDe"); // Fallback if still processing
              }
              setLoading(false);
            })
            .catch(() => {
              setPlaybackId("DS00Spx1CV902MCtPj5WknGlR102V5HFkDe"); // Fallback
              setLoading(false);
            });
        } else if (lesson) {
          setPlaybackId(lesson.mediaUrl);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [stepId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>Loading step...</div>
      </div>
    );
  }

  if (!step) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>Step not found.</div>
      </div>
    );
  }

  const lesson = step.lessons?.[0]; // Show first lesson for now
  const quiz = step.quiz;

  const handleOptionChange = (qId: string, oId: string) => {
    setAnswers(prev => ({ ...prev, [qId]: oId }));
  };

  const handleQuizSubmit = () => {
    if (!quiz || !quiz.questions) return;
    
    let correctCount = 0;
    quiz.questions.forEach((q: any) => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find((o: any) => o.isCorrect);
      if (correctOption && selectedOptionId === correctOption.id) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = scorePercentage >= quiz.passMark;
    
    if (passed) {
      if (step && step.programId) {
        const nextSequence = (step.sequence || 1) + 1;
        const currentProgress = parseInt(localStorage.getItem(`progress_${step.programId}`) || "1", 10);
        if (nextSequence > currentProgress) {
          localStorage.setItem(`progress_${step.programId}`, nextSequence.toString());
        }
      }
      setQuizResult({ passed: true, score: scorePercentage, message: `Great job! You scored ${scorePercentage}% and passed the step.` });
    } else {
      setQuizResult({ passed: false, score: scorePercentage, message: `You scored ${scorePercentage}%. You need ${quiz.passMark}% to pass. Try again!` });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>← Back to Roadmap</Link>
        <h1 className={styles.title}>Step {step.sequence}: {step.title}</h1>
        <p className={styles.subtitle}>{step.description}</p>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          {lesson ? (
            <div className={styles.videoContainer}>
              <MuxPlayer
                playbackId={playbackId || "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe"}
                metadata={{ video_title: lesson.title }}
                style={{ width: "100%", aspectRatio: "16/9" }}
              />
              <div style={{ marginTop: "10px", fontWeight: "bold" }}>{lesson.title}</div>
            </div>
          ) : (
            <div className={styles.videoContainer}>
              <div className={styles.videoPlaceholder} style={{ textAlign: "center", padding: "40px", background: "#f5f5f5", borderRadius: "12px" }}>
                <p>No video content uploaded for this step yet.</p>
              </div>
            </div>
          )}
          
          <div className={styles.descriptionCard} style={{ marginTop: "20px" }}>
            <h3>About this step</h3>
            <p>{step.description || "No detailed description available."}</p>
          </div>
        </div>

        <div className={styles.sideColumn}>
          {/* Quiz Section */}
          <div className={styles.quizCard}>
            <h3>Knowledge Check</h3>
            {quiz ? (
              <>
                <p className={styles.quizDesc}>You must score {quiz.passMark}% to unlock the next step.</p>
                {quizResult && (
                  <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "15px", backgroundColor: quizResult.passed ? "#e6f4ea" : "#fce8e6", color: quizResult.passed ? "#137333" : "#c5221f" }}>
                    <strong>{quizResult.passed ? "Passed!" : "Keep Trying!"}</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem" }}>{quizResult.message}</p>
                  </div>
                )}
                
                {!quizResult?.passed ? (
                  <>
                    {quiz.questions?.map((q: any, i: number) => (
                      <div key={q.id} className={styles.question} style={{ marginBottom: "15px" }}>
                        <p style={{ fontWeight: "600", marginBottom: "8px" }}>{i + 1}. {q.text}</p>
                        <div className={styles.options} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {q.options?.map((opt: any) => (
                            <label key={opt.id} className={styles.option} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", background: answers[q.id] === opt.id ? "#e8f0fe" : "#f9f9f9", border: answers[q.id] === opt.id ? "1px solid var(--accent-primary)" : "1px solid transparent", borderRadius: "6px", cursor: "pointer" }}>
                              <input type="radio" name={`q_${q.id}`} value={opt.id} checked={answers[q.id] === opt.id} onChange={() => handleOptionChange(q.id, opt.id)} /> 
                              {opt.text}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className={styles.submitBtn} style={{ marginTop: "15px" }} onClick={handleQuizSubmit} disabled={Object.keys(answers).length !== quiz.questions.length}>
                      {Object.keys(answers).length !== quiz.questions.length ? "Answer all questions" : "Submit Quiz"}
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <h3 style={{ marginBottom: "15px" }}>Ready for the next step?</h3>
                    <Link href={`/programs/${step.programId}/steps`} className={styles.submitBtn} style={{ textDecoration: "none", display: "inline-block" }}>
                      Continue to Next Step &rarr;
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p>No quiz created for this step yet.</p>
            )}
          </div>
          
          {/* Resources */}
          <div className={styles.resourceCard} style={{ marginTop: "20px" }}>
            <h3>Resources</h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>No resources attached.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
