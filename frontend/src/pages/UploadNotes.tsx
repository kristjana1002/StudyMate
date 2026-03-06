import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadNotes() {
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pickFile = () => inputRef.current?.click();

  const handleFile = (f: File | null) => {
    setError("");
    setFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onSubmit = async () => {
    if (!file) return setError("Pick a file first.");
    setError("");
    setLoading(true);

    try {
      nav("/summary", {
        state: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          meta: { subject: "Physics", date: "Jan 22, 2025", readTime: "5 min read" },
          summaryData: {
            aiSummary:
              "Quantum mechanics is a fundamental theory in physics that describes the behavior of matter and energy at atomic and subatomic scales. Key principles include wave–particle duality, uncertainty principle, and quantum superposition.",
            keyPoints: [
              "Wave-particle duality demonstrates that particles can exhibit both wave and particle properties",
              "Heisenberg's Uncertainty Principle limits simultaneous precision of certain pairs of properties",
              "Quantum superposition allows multiple states until measured",
              "The Schrödinger equation is the fundamental equation of quantum mechanics",
              "Quantum entanglement creates correlations that persist regardless of distance",
            ],
            keyConcepts: [
              { title: "Wave Function", desc: "A mathematical description of the quantum state of a system" },
              { title: "Quantum State", desc: "The complete description of a physical system in quantum mechanics" },
              { title: "Observable", desc: "A physical property that can be measured" },
              { title: "Eigenstate", desc: "A state with a definite value for an observable" },
            ],
            relatedTopics: ["Quantum Field Theory", "Particle Physics", "Wave Mechanics", "Statistical Mechanics"],
          },
        },
      });
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm-page sm-bg">
      <div className="sm-container">
        <div className="sm-hero">
          <h1>
            Upload <span>Study Materials</span>
          </h1>
          <p>
            Upload your notes, PDFs, textbooks, or images. Our AI will analyze and create summaries, quizzes, and
            flashcards.
          </p>
        </div>

        <div
          className={`sm-dropzone ${dragOver ? "is-drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onClick={pickFile}
          onKeyDown={(e) => (e.key === "Enter" ? pickFile() : null)}
        >
          <div className="sm-drop-inner">
            <div className="sm-upload-icon" aria-hidden="true">⤴</div>

            <div className="sm-drop-title">Drag & drop files here</div>
            <div className="sm-drop-sub">or</div>

            <button className="sm-btn sm-btn-primary" type="button" onClick={pickFile} disabled={loading}>
              Browse Files
            </button>

            <div className="sm-drop-hint">Supports PDF, DOC, TXT, and images (PNG, JPG)</div>

            <input
              ref={inputRef}
              type="file"
              className="sm-hidden"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
            />
          </div>
        </div>

        {file && (
          <div className="sm-file-row">
            <div className="sm-file-pill">
              <span className="sm-dot" />
              <div className="sm-file-meta">
                <div className="sm-file-name">{file.name}</div>
                <div className="sm-file-small">{Math.ceil(file.size / 1024)} KB</div>
              </div>
            </div>

            <button className="sm-btn sm-btn-glow" type="button" onClick={onSubmit} disabled={loading}>
              {loading ? "Processing..." : "Generate Summary"}
            </button>
          </div>
        )}

        {error && <div className="sm-alert">{error}</div>}

        <div className="sm-type-grid">
          <div className="sm-type-card">
            <div className="sm-type-ico red">📄</div>
            <div>
              <div className="sm-type-title">PDF Documents</div>
              <div className="sm-type-sub">.pdf</div>
            </div>
          </div>

          <div className="sm-type-card">
            <div className="sm-type-ico blue">🖼️</div>
            <div>
              <div className="sm-type-title">Images</div>
              <div className="sm-type-sub">image/*</div>
            </div>
          </div>

          <div className="sm-type-card">
            <div className="sm-type-ico green">📝</div>
            <div>
              <div className="sm-type-title">Text Files</div>
              <div className="sm-type-sub">.txt, .doc, .docx</div>
            </div>
          </div>
        </div>

        <div className="sm-features">
          <div className="sm-feature">
            <div className="sm-feature-ico purple">✦</div>
            <div>
              <div className="sm-feature-title">AI Summarization</div>
              <div className="sm-feature-sub">Get key points instantly</div>
            </div>
          </div>

          <div className="sm-feature">
            <div className="sm-feature-ico pink">📘</div>
            <div>
              <div className="sm-feature-title">Smart Notes</div>
              <div className="sm-feature-sub">Organized & searchable</div>
            </div>
          </div>

          <div className="sm-feature">
            <div className="sm-feature-ico cyan">⤴</div>
            <div>
              <div className="sm-feature-title">Multiple Formats</div>
              <div className="sm-feature-sub">PDF, images, text</div>
            </div>
          </div>

          <div className="sm-feature">
            <div className="sm-feature-ico lime">▦</div>
            <div>
              <div className="sm-feature-title">Study Plans</div>
              <div className="sm-feature-sub">Personalized learning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}