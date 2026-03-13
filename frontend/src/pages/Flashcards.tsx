import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { generateFlashcards } from "../services/api";

type Flashcard = {
  id: string;
  topic: string;
  question: string;
  answer: string;
  mastered: boolean;
};

const Flashcards: React.FC = () => {
  const location = useLocation() as any;
  const topicFromState = location.state?.topic || "";
  const noteIdFromState = location.state?.noteId || "";

  const [topic, setTopic] = useState(topicFromState);
  const [noteId, setNoteId] = useState(noteIdFromState);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentCard = cards[currentIndex];

  const masteredCount = useMemo(() => {
    return cards.filter((card) => card.mastered).length;
  }, [cards]);

  const progressPercent = cards.length
    ? Math.round((masteredCount / cards.length) * 100)
    : 0;

  useEffect(() => {
    if (topicFromState) {
      handleGenerate(topicFromState, noteIdFromState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (forcedTopic?: string, forcedNoteId?: string) => {
    const finalTopic = (forcedTopic ?? topic).trim();
    const finalNoteId = (forcedNoteId ?? noteId).trim();

    if (!finalTopic) {
      setError("Please enter a topic first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await generateFlashcards({
        topic: finalTopic,
        ...(finalNoteId ? { noteId: finalNoteId } : {}),
        count,
      });

      const mappedCards: Flashcard[] = res.cards.map((card) => ({
        id: card.id,
        topic: res.topic,
        question: card.question,
        answer: card.answer,
        mastered: false,
      }));

      setCards(mappedCards);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (e: any) {
      setError(e?.message || "Failed to generate flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    if (!cards.length) return;
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const goPrev = () => {
    if (!cards.length) return;
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = () => {
    if (!cards.length) return;

    const updated = [...cards];
    updated[currentIndex].mastered = !updated[currentIndex].mastered;
    setCards(updated);
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
  };

  return (
    <div className="flashcards-page">
      <div className="flashcards-container">
        <div className="flashcards-header">
          <h1>Flashcards</h1>
          <p>Master your concepts with interactive flashcards</p>
        </div>

        <div className="sm-block sm-glow" style={{ marginBottom: 24 }}>
          <div className="sm-block-title">Generate Flashcards</div>

          <div className="quiz-form">
            <label>
              Topic
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. TypeScript, Cell Biology, Thermodynamics..."
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
                Number of cards
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                />
              </label>
            </div>

            {error && <div className="sm-alert">{error}</div>}

            <button
              className="sm-btn sm-btn-primary"
              type="button"
              onClick={() => handleGenerate()}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Flashcards"}
            </button>
          </div>
        </div>

        {cards.length > 0 && (
          <>
            <div className="flashcards-progress-box">
              <div className="flashcards-progress-top">
                <span>Progress</span>
                <span>
                  {masteredCount} / {cards.length} Mastered
                </span>
              </div>
              <div className="flashcards-progress-bar">
                <div
                  className="flashcards-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flashcards-stats">
              <div className="flashcards-stat-card">
                <h2>{cards.length}</h2>
                <p>Total Cards</p>
              </div>

              <div className="flashcards-stat-card">
                <h2>{masteredCount}</h2>
                <p>Mastered</p>
              </div>

              <div className="flashcards-stat-card">
                <h2>{progressPercent}%</h2>
                <p>Complete</p>
              </div>
            </div>

            <div
              className="flashcard-main-card"
              onClick={() => setFlipped(!flipped)}
            >
              <div className="flashcard-topic">{currentCard.topic}</div>
              <h2 className="flashcard-title">
                {flipped ? currentCard.answer : currentCard.question}
              </h2>
              <p className="flashcard-subtext">
                {flipped ? "Click to show question" : "Click to reveal answer"}
              </p>
            </div>

            <div className="flashcards-controls-row">
              <button className="nav-btn" onClick={goPrev}>
                &#8249;
              </button>

              <div className="flashcards-indicator">
                <span>
                  {currentIndex + 1} / {cards.length}
                </span>
                <div className="dots">
                  {cards.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${index === currentIndex ? "active" : ""}`}
                    />
                  ))}
                </div>
              </div>

              <button className="nav-btn" onClick={goNext}>
                &#8250;
              </button>
            </div>

            <div className="flashcards-action-buttons">
              <button className="action-btn" onClick={toggleMastered}>
                {currentCard.mastered ? "Unmark Mastered" : "Mark as Mastered"}
              </button>

              <button className="action-btn" onClick={shuffleCards}>
                Shuffle
              </button>
            </div>
          </>
        )}

        <div className="study-tips-box">
          <h3>Study Tips</h3>
          <ul>
            <li>Try to recall the answer before flipping the card</li>
            <li>Mark cards as mastered only when you feel confident</li>
            <li>Review mastered cards from time to time to retain knowledge</li>
            <li>Use shuffle to test your memory randomly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;