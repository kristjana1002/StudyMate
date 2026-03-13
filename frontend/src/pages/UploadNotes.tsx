import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadNote } from "../services/api";

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
    if (!file) {
      setError("Pick a file first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
      const res = await uploadNote(file, cleanTitle);

      nav("/summary", {
        state: {
          noteId: res.noteId,
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
            Upload your notes, PDFs, textbooks, or images. Our AI will analyze
            and create summaries, quizzes, and flashcards.
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
            <div className="sm-upload-icon" aria-hidden="true">
              ⤴
            </div>

            <div className="sm-drop-title">Drag & drop files here</div>
            <div className="sm-drop-sub">or</div>

            <button
              className="sm-btn sm-btn-primary"
              type="button"
              onClick={pickFile}
              disabled={loading}
            >
              Browse Files
            </button>

            <div className="sm-drop-hint">
              Supports PDF, DOC, TXT, and images (PNG, JPG)
            </div>

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
                <div className="sm-file-small">
                  {Math.ceil(file.size / 1024)} KB
                </div>
              </div>
            </div>

            <button
              className="sm-btn sm-btn-glow"
              type="button"
              onClick={onSubmit}
              disabled={loading}
            >
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