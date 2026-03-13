import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { generateQuiz, getQuiz, submitQuiz } from "../services/api";

type QuizType = "mcq" | "short";

type QuizQuestion =
  | {
      id: string;
      type: "mcq";
      question: string;
      choices: string[];
      answerIndex: number;
      explanation?: string;
    }
  | {
      id: string;
      type: "short";
      question: string;
      answer: string;
      explanation?: string;
    };

type LoadedQuiz = {
  id: string;
  topic: string;
  quizType: QuizType;
  questions: QuizQuestion[];
};

const QuizPage: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation() as any;
  const { id } = useParams();

  const initialTopic = location.state?.topic || "";
  const initialNoteId = location.state?.noteId || "";

  const [topic, setTopic] = useState(initialTopic);
  const [quizType, setQuizType] = useState<QuizType>("mcq");
  const [count, setCount] = useState(8);

  const [noteId, setNoteId] = useState(initialNoteId);
  const [subjectId, setSubjectId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [quiz, setQuiz] = useState<LoadedQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, { answerIndex?: number; text?: string }>>({});
  const [result, setResult] = useState<{
    attemptId: string;
    score: number;
    total: number;
    feedback: any[];
  } | null>(null);

  const isTakeMode = Boolean(id);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");
        const data = await getQuiz(id);
        setQuiz({
  ...data,
  quizType: data.quizType as QuizType,
});
        setQuizType(data.quizType as QuizType);
      } catch (e: any) {
        setError(e?.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

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

  const setMcqAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answerIndex },
    }));
  };

  const setShortAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { text },
    }));
  };

  const builtAnswers = useMemo(() => {
    return Object.entries(answers).map(([questionId, value]) => ({
      id: questionId,
      ...value,
    }));
  }, [answers]);

  const onSubmitQuiz = async () => {
    if (!quiz) return;

    setLoading(true);
    setError("");

    try {
      const res = await submitQuiz(quiz.id, builtAnswers);
      setResult(res);
    } catch (e: any) {
      setError(e?.message || "Failed to submit quiz.");
    } finally {
      setLoading(false);
    }
  };

  if (isTakeMode) {
    if (loading && !quiz) {
      return (
        <div className="sm-page sm-bg">
          <div className="sm-container">
            <div className="sm-block sm-glow">
              <div className="sm-block-title">Loading Quiz...</div>
              <div className="sm-block-body">Your generated quiz is being fetched.</div>
            </div>
          </div>
        </div>
      );
    }

    if (error && !quiz) {
      return (
        <div className="sm-page sm-bg">
          <div className="sm-container">
            <div className="sm-block">
              <div className="sm-block-title">Quiz</div>
              <div className="sm-block-body">{error}</div>
            </div>
          </div>
        </div>
      );
    }

    if (!quiz) return null;

    return (
      <div className="sm-page sm-bg">
        <div className="sm-container">
          <div className="sm-hero">
            <h1>
              Take <span>Quiz</span>
            </h1>
            <p>{quiz.topic}</p>
          </div>

          {result && (
            <div className="sm-block sm-glow" style={{ marginBottom: 20 }}>
              <div className="sm-block-title">Quiz Result</div>
              <div className="sm-block-body">
                You scored <b>{result.score}</b> out of <b>{result.total}</b>.
              </div>
            </div>
          )}

          <div className="sm-block sm-glow">
            <div className="sm-block-title">
              {quiz.questions.length} Questions • {quiz.quizType.toUpperCase()}
            </div>

            <div className="sm-list">
              {quiz.questions.map((q, index) => {
                const feedback = result?.feedback?.find((f: any) => f.id === q.id);

                return (
                  <div key={q.id} className="sm-list-item" style={{ display: "block" }}>
                    <div style={{ fontWeight: 800, marginBottom: 12 }}>
                      {index + 1}. {q.question}
                    </div>

                    {q.type === "mcq" ? (
                      <div style={{ display: "grid", gap: 10 }}>
                        {q.choices.map((choice, choiceIndex) => (
                          <label
                            key={choiceIndex}
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                              background: "rgba(255,255,255,0.03)",
                              padding: "10px 12px",
                              borderRadius: 12,
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id]?.answerIndex === choiceIndex}
                              onChange={() => setMcqAnswer(q.id, choiceIndex)}
                            />
                            <span>{choice}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        value={answers[q.id]?.text || ""}
                        onChange={(e) => setShortAnswer(q.id, e.target.value)}
                        placeholder="Write your answer..."
                        style={{
                          width: "100%",
                          minHeight: 110,
                          marginTop: 10,
                          borderRadius: 12,
                          border: "1px solid rgba(148,163,184,0.18)",
                          background: "#0b1226",
                          color: "#f8fafc",
                          padding: 14,
                        }}
                      />
                    )}

                    {feedback && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: 12,
                          borderRadius: 12,
                          background: feedback.correct
                            ? "rgba(34,197,94,0.10)"
                            : "rgba(239,68,68,0.10)",
                          border: feedback.correct
                            ? "1px solid rgba(34,197,94,0.25)"
                            : "1px solid rgba(239,68,68,0.25)",
                        }}
                      >
                        <div style={{ fontWeight: 800, marginBottom: 6 }}>
                          {feedback.correct ? "Correct" : "Needs Improvement"}
                        </div>
                        {feedback.expected && (
                          <div style={{ marginBottom: 6 }}>
                            <b>Expected:</b> {feedback.expected}
                          </div>
                        )}
                        {feedback.explanation && (
                          <div>
                            <b>Explanation:</b> {feedback.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {error && <div className="sm-alert" style={{ marginTop: 16 }}>{error}</div>}

            {!result && (
              <div style={{ marginTop: 20 }}>
                <button
                  className="sm-btn sm-btn-primary"
                  onClick={onSubmitQuiz}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm-page sm-bg">
      <div className="sm-container">
        <div className="sm-hero">
          <h1>
            Generate <span>Quiz</span>
          </h1>
          <p>
            Create quizzes from a topic or directly from your uploaded note. Pick MCQ for fast grading or short answers
            for deeper learning.
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
                  <input
                    value={noteId}
                    onChange={(e) => setNoteId(e.target.value)}
                    placeholder="UUID"
                  />
                </label>

                <label>
                  Subject ID (optional)
                  <input
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    placeholder="UUID"
                  />
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
              </div>

              <div style={{ marginTop: 18 }}>
                <div className="study-plan-item">
                  <div className="subject">Best practice</div>
                  <div className="topic">Keep topics specific: “Photosynthesis light reactions”</div>
                  <div className="due">More accurate questions</div>
                  <div className="priority medium">TIP</div>
                </div>

                <div className="study-plan-item">
                  <div className="subject">Connected mode</div>
                  <div className="topic">Coming from Summary auto-fills note + topic</div>
                  <div className="due">Uses note_id</div>
                  <div className="priority high">LIVE</div>
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