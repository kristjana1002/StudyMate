import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNoteById } from "../services/api";
import ReactMarkdown from "react-markdown";

type NoteResponse = {
  id: string;
  title: string;
  summary: string;
  created_at: string;
};

export default function SummaryPage() {
  const location = useLocation() as any;
  const nav = useNavigate();

  const noteId = location.state?.noteId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState<NoteResponse | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!noteId) {
        setError("No summary found. Upload a file first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const res = await getNoteById(noteId);
        setNote(res);
      } catch (e: any) {
        setError(e?.message || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [noteId]);

  const copy = async () => {
    if (!note?.summary) return;
    await navigator.clipboard.writeText(note.summary);
  };

  const download = () => {
    if (!note) return;

    const blob = new Blob([note.summary], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="sm-page sm-bg">
        <div className="sm-container">
          <div className="sm-block sm-glow">
            <div className="sm-block-title">Loading summary...</div>
            <div className="sm-block-body">
              Your AI-generated summary is being fetched.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sm-page sm-bg">
        <div className="sm-container">
          <div className="sm-block">
            <div className="sm-block-title">Summary</div>
            <div className="sm-block-body">{error}</div>

            <div style={{ marginTop: 18 }}>
              <button
                className="sm-btn sm-btn-primary"
                onClick={() => nav("/upload-notes")}
              >
                Go to Upload Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) return null;

  const createdDate = new Date(note.created_at).toLocaleDateString();

  return (
    <div className="sm-page sm-bg">
      <div className="sm-container">
        <div className="sm-meta-row">
          <div className="sm-breadcrumb">
            <span>Saved Note</span> <span className="dot">•</span>{" "}
            <span>{createdDate}</span> <span className="dot">•</span>{" "}
            <span>AI Summary</span>
          </div>

          <div className="sm-actions">
            <button className="sm-btn sm-btn-ghost" onClick={copy}>
              Copy
            </button>
            <button className="sm-btn sm-btn-ghost" onClick={download}>
              Download
            </button>
          </div>
        </div>

        <h1 className="sm-title-glow">{note.title}</h1>

        <div className="sm-action-cards">
          <div
            className="sm-action-card"
            onClick={() =>
              nav("/quiz", {
                state: {
                  noteId: note.id,
                  topic: note.title,
                },
              })
            }
          >
            <div className="ico pink">✦</div>
            <div className="txt">Create Quiz</div>
            <div className="arrow">›</div>
          </div>

          <div
            className="sm-action-card"
            onClick={() =>
              nav("/flashcards", {
                state: {
                  noteId: note.id,
                  topic: note.title,
                },
              })
            }
          >
            <div className="ico blue">🗂️</div>
            <div className="txt">Make Flashcards</div>
            <div className="arrow">›</div>
          </div>

          <div
            className="sm-action-card"
            onClick={() =>
              nav("/ai-chat", {
                state: {
                  noteId: note.id,
                  topic: note.title,
                },
              })
            }
          >
            <div className="ico green">🧠</div>
            <div className="txt">Ask AI</div>
            <div className="arrow">›</div>
          </div>
        </div>

        <div className="sm-block sm-glow">
          <div className="sm-block-title">AI-Generated Summary</div>
          <div className="sm-block-body">
            <ReactMarkdown>{note.summary}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}