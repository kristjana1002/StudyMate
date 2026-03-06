const OpenAI = require("openai");
const db = require("../config/db");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

async function aiGenerateQuiz({ topic, quizType, count, sourceText }) {
  const schemaHint =
    quizType === "mcq"
      ? `Return JSON with shape:
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "string",
      "choices": ["A","B","C","D"],
      "answerIndex": 0,
      "explanation": "string"
    }
  ]
}`
      : `Return JSON with shape:
{
  "questions": [
    {
      "id": "q1",
      "type": "short",
      "question": "string",
      "answer": "string",
      "explanation": "string"
    }
  ]
}`;

  const input = `You are StudyMate. Create a ${count}-question quiz about: ${topic}.
Quiz type: ${quizType}.
Make it student-friendly and accurate.
${sourceText ? `Use these notes as the main source:\n${sourceText}\n` : ""}

IMPORTANT:
- Output ONLY valid JSON.
- No markdown.
- No extra text.
${schemaHint}`;

  const resp = await client.responses.create({
    model: "gpt-5.2",
    input,
  });

  const text = (resp.output_text || "").trim();
  const json = safeJsonParse(text, null);

  if (!json?.questions?.length) {
    throw new Error("AI quiz generation failed (invalid JSON).");
  }
  return json.questions;
}

exports.generateQuiz = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { noteId = null, topic, quizType = "mcq", count = 8 } = req.body || {};
    if (!topic) return res.status(400).json({ message: "topic is required" });
    if (!["mcq", "short"].includes(quizType)) return res.status(400).json({ message: "Invalid quizType" });

    let sourceText = "";
    if (noteId) {
      const rows = await new Promise((resolve, reject) => {
        db.query(
          "SELECT content FROM notes WHERE id = ? AND user_id = ? LIMIT 1",
          [noteId, userId],
          (err, rows) => (err ? reject(err) : resolve(rows))
        );
      });
      sourceText = rows?.[0]?.content || "";
    }

    const questions = await aiGenerateQuiz({ topic, quizType, count, sourceText });

    const questionsJson = JSON.stringify({ questions });

    db.query(
      "INSERT INTO quizzes (user_id, note_id, topic, quiz_type, questions_json) VALUES (?, ?, ?, ?, ?)",
      [userId, noteId, topic, quizType, questionsJson],
      (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        return res.json({
          quizId: result.insertId,
          topic,
          quizType,
          questions,
        });
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "Generate quiz failed", error: e?.message });
  }
};

exports.getQuizById = (req, res) => {
  const userId = req.user?.id;
  const quizId = Number(req.params.id);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "SELECT id, topic, quiz_type, questions_json, created_at FROM quizzes WHERE id = ? AND user_id = ? LIMIT 1",
    [quizId, userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      if (!rows?.length) return res.status(404).json({ message: "Not found" });

      const row = rows[0];
      const parsed = safeJsonParse(row.questions_json, { questions: [] });

      return res.json({
        id: row.id,
        topic: row.topic,
        quizType: row.quiz_type,
        questions: parsed.questions || [],
        createdAt: row.created_at,
      });
    }
  );
};

exports.listQuizzes = (req, res) => {
  const userId = req.user?.id;
  const topic = (req.query.topic || "").toString();
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const hasTopic = topic.trim().length > 0;
  const sql = hasTopic
    ? "SELECT id, topic, quiz_type, created_at FROM quizzes WHERE user_id = ? AND topic LIKE ? ORDER BY id DESC"
    : "SELECT id, topic, quiz_type, created_at FROM quizzes WHERE user_id = ? ORDER BY id DESC";

  const params = hasTopic ? [userId, `%${topic}%`] : [userId];

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    return res.json(rows);
  });
};

exports.submitQuiz = (req, res) => {
  const userId = req.user?.id;
  const quizId = Number(req.params.id);
  const { answers } = req.body || {};

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!Array.isArray(answers)) return res.status(400).json({ message: "answers must be an array" });

  db.query(
    "SELECT quiz_type, questions_json FROM quizzes WHERE id = ? AND user_id = ? LIMIT 1",
    [quizId, userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      if (!rows?.length) return res.status(404).json({ message: "Quiz not found" });

      const quizType = rows[0].quiz_type;
      const parsed = safeJsonParse(rows[0].questions_json, { questions: [] });
      const questions = parsed.questions || [];

      let score = 0;
      const total = questions.length;

      const feedback = [];

      for (const q of questions) {
        const a = answers.find((x) => x.id === q.id);
        if (!a) {
          feedback.push({ id: q.id, correct: false, explanation: q.explanation || "" });
          continue;
        }

        if (quizType === "mcq") {
          const correct = Number(a.answerIndex) === Number(q.answerIndex);
          if (correct) score++;
          feedback.push({ id: q.id, correct, explanation: q.explanation || "" });
        } else {
          const userText = (a.text || "").toString().trim().toLowerCase();
          const expected = (q.answer || "").toString().trim().toLowerCase();
          const correct = expected.length > 0 && userText.includes(expected.slice(0, Math.min(20, expected.length)));
          if (correct) score++;
          feedback.push({ id: q.id, correct, expected: q.answer, explanation: q.explanation || "" });
        }
      }

      const answersJson = JSON.stringify({ answers });
      const feedbackJson = JSON.stringify({ feedback });

      db.query(
        "INSERT INTO quiz_attempts (user_id, quiz_id, answers_json, score, total, feedback_json) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, quizId, answersJson, score, total, feedbackJson],
        (err2, result2) => {
          if (err2) return res.status(500).json({ message: "DB error", error: err2 });

          return res.json({
            attemptId: result2.insertId,
            score,
            total,
            feedback,
          });
        }
      );
    }
  );
};