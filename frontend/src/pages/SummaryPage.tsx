import React from "react";
import { useLocation } from "react-router-dom";

export default function SummaryPage() {
  const location = useLocation() as any;

  const title = location.state?.title || "Untitled";
  const meta = location.state?.meta || { subject: "Subject", date: "Date", readTime: "—" };
  const data = location.state?.summaryData;

  const aiSummary = data?.aiSummary || "No summary yet. Upload a file first.";
  const keyPoints: string[] = data?.keyPoints || [];
  const keyConcepts: { title: string; desc: string }[] = data?.keyConcepts || [];
  const relatedTopics: string[] = data?.relatedTopics || [];

  const copy = async () => {
    await navigator.clipboard.writeText(aiSummary);
  };

  const download = () => {
    const blob = new Blob([aiSummary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sm-page sm-bg">
      <div className="sm-container">
        <div className="sm-meta-row">
          <div className="sm-breadcrumb">
            <span>{meta.subject}</span> <span className="dot">•</span> <span>{meta.date}</span>{" "}
            <span className="dot">•</span> <span>{meta.readTime}</span>
          </div>

          <div className="sm-actions">
            <button className="sm-btn sm-btn-ghost" onClick={copy}>Copy</button>
            <button className="sm-btn sm-btn-ghost" onClick={download}>Download</button>
          </div>
        </div>

        <h1 className="sm-title-glow">{title}</h1>

        <div className="sm-action-cards">
          <div className="sm-action-card">
            <div className="ico pink">✦</div>
            <div className="txt">Create Quiz</div>
            <div className="arrow">›</div>
          </div>

          <div className="sm-action-card">
            <div className="ico blue">🗂️</div>
            <div className="txt">Make Flashcards</div>
            <div className="arrow">›</div>
          </div>

          <div className="sm-action-card">
            <div className="ico green">🧠</div>
            <div className="txt">Ask AI</div>
            <div className="arrow">›</div>
          </div>
        </div>

        <div className="sm-block sm-glow">
          <div className="sm-block-title">AI-Generated Summary</div>
          <div className="sm-block-body">{aiSummary}</div>
        </div>

        <div className="sm-block">
          <div className="sm-block-title">Key Points</div>
          <div className="sm-list">
            {keyPoints.length === 0 ? (
              <div className="sm-empty">No key points yet.</div>
            ) : (
              keyPoints.map((k, idx) => (
                <div className="sm-list-item" key={idx}>
                  <div className="sm-num">{idx + 1}</div>
                  <div className="sm-list-text">{k}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sm-block">
          <div className="sm-block-title">Key Concepts</div>
          <div className="sm-concepts">
            {keyConcepts.map((c, idx) => (
              <div className="sm-concept-card" key={idx}>
                <div className="sm-concept-title">{c.title}</div>
                <div className="sm-concept-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sm-block">
          <div className="sm-block-title">Related Topics</div>
          <div className="sm-chips">
            {relatedTopics.map((t) => (
              <span className="sm-chip" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}