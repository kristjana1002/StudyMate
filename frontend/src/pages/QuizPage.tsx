import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuiz } from "../services/api";

type QuizType = "mcq" | "short";

const QuizPage: React.FC = () => {
  const nav = useNavigate();

  const [topic, setTopic] = useState("");
  const [quizType, setQuizType] = useState<QuizType>("mcq");
  const [count, setCount] = useState(8);

  const [noteId, setNoteId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setError("Please enter a topic.");
      return;
    }

    if (count < 3 || count > 25) {
      setError("Question count must be between 3 and 25.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        topic: cleanTopic,
        quizType,
        count,
        ...(noteId.trim() ? { noteId: noteId.trim() } : {}),
        ...(subjectId.trim() ? { subjectId: subjectId.trim() } : {}),
      };

      const res = await generateQuiz(payload);
      nav(`/quiz/${res.quizId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm-page sm-bg">
      <div className="sm-container">
        <div className="sm-hero">
          <h1>
            Generate <span>Quiz</span>
          </h1>
          <p>
            Create quizzes from a topic (and soon directly from your uploaded notes). Pick MCQ for fast grading or short
            answers for deeper learning.
          </p>
        </div>

        <div className="upload-grid">
          <div className="sm-block sm-glow">
            <div className="sm-block-title">Quiz Builder</div>

            <form onSubmit={onGenerate} className="quiz-form">
              <label>
                Topic
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Quantum mechanics, Cell biology, Algebra..."
                />
              </label>

              <label>
                Quiz type
                <select value={quizType} onChange={(e) => setQuizType(e.target.value as QuizType)}>
                  <option value="mcq">Multiple choice (MCQ)</option>
                  <option value="short">Short answer</option>
                </select>
              </label>

              <label>
                Number of questions
                <input
                  type="number"
                  min={3}
                  max={25}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                />
              </label>

              <div className="quiz-two-col">
                <label>
                  Note ID (optional)
                  <input value={noteId} onChange={(e) => setNoteId(e.target.value)} placeholder="UUID" />
                </label>

                <label>
                  Subject ID (optional)
                  <input value={subjectId} onChange={(e) => setSubjectId(e.target.value)} placeholder="UUID" />
                </label>
              </div>

              {error && <div className="sm-alert">{error}</div>}

              <button className="sm-btn sm-btn-primary" disabled={loading} type="submit">
                {loading ? "Generating..." : "Generate Quiz"}
              </button>
            </form>
          </div>

          <div className="sm-block">
            <div className="sm-block-title">How it works</div>
            <div className="sm-block-body" style={{ color: "#94a3b8" }}>
              <div style={{ lineHeight: 1.7 }}>
                • Enter a topic and choose quiz type.
                <br />
                • StudyMate generates questions using AI.
                <br />
                • You’ll be redirected to answer the quiz.
                <br />
                <br />
                <b style={{ color: "#e2e8f0" }}>Tip:</b> Start with MCQ for testing — instant grading.
                <br />
                Short answers work too (grading gets upgraded later).
              </div>

              <div style={{ marginTop: 18 }}>
                <div className="study-plan-item">
                  <div className="subject">Best practice</div>
                  <div className="topic">Keep topics specific: “Photosynthesis light reactions”</div>
                  <div className="due">More accurate questions</div>
                  <div className="priority medium">TIP</div>
                </div>

                <div className="study-plan-item">
                  <div className="subject">Next upgrade</div>
                  <div className="topic">Generate quizzes directly from uploaded notes</div>
                  <div className="due">Uses note_id</div>
                  <div className="priority high">NEXT</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sm-action-cards" style={{ marginTop: 22 }}>
          <div className="sm-action-card" onClick={() => setQuizType("mcq")}>
            <div className="ico pink">Q</div>
            <div className="txt">MCQ Mode</div>
            <div className="arrow">›</div>
          </div>

          <div className="sm-action-card" onClick={() => setQuizType("short")}>
            <div className="ico blue">S</div>
            <div className="txt">Short Answer</div>
            <div className="arrow">›</div>
          </div>

          <div
            className="sm-action-card"
            onClick={() => {
              setTopic("Photosynthesis light reactions");
              setQuizType("mcq");
              setCount(8);
            }}
          >
            <div className="ico green">★</div>
            <div className="txt">Try Example</div>
            <div className="arrow">›</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="sm-btn sm-btn-ghost" onClick={() => nav("/upload-notes")}>
            Use uploaded notes instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;