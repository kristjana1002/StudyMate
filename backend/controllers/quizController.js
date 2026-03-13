const { GoogleGenAI } = require("@google/genai");
const db = require("../config/db");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function stripCodeFences(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
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

  const prompt = `You are StudyMate. Create a ${count}-question quiz about: ${topic}.
Quiz type: ${quizType}.
Make it student-friendly and accurate.
${sourceText ? `Use these notes as the main source:\n${sourceText}\n` : ""}

IMPORTANT:
- Output ONLY valid JSON
- No markdown
- No code fences
- No extra text
${schemaHint}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  const text = stripCodeFences(response.text || "");
  const json = safeJsonParse(text, null);

  if (!json?.questions?.length) {
    throw new Error("AI quiz generation failed (invalid JSON).");
  }

  return json.questions;
}

exports.generateQuiz = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { noteId = null, topic, quizType = "mcq", count = 8 } = req.body || {};

    if (!topic) {
      return res.status(400).json({ message: "topic is required" });
    }

    if (!["mcq", "short"].includes(quizType)) {
      return res.status(400).json({ message: "Invalid quizType" });
    }

    let sourceText = "";

    if (noteId) {
      const { rows } = await db.query(
        `SELECT content
         FROM notes
         WHERE id = $1 AND user_id = $2
         LIMIT 1`,
        [noteId, userId]
      );

      sourceText = rows[0]?.content || "";
    }

    const questions = await aiGenerateQuiz({
      topic,
      quizType,
      count,
      sourceText,
    });

    const questionsJson = JSON.stringify({ questions });

    const { rows } = await db.query(
      `INSERT INTO quizzes (user_id, note_id, topic, quiz_type, questions_json)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       RETURNING id`,
      [userId, noteId, topic, quizType, questionsJson]
    );

    return res.json({
      quizId: rows[0].id,
      topic,
      quizType,
      questions,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Generate quiz failed",
      error: e?.message,
    });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const quizId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rows } = await db.query(
      `SELECT id, topic, quiz_type, questions_json, created_at
       FROM quizzes
       WHERE id = $1 AND user_id = $2
       LIMIT 1`,
      [quizId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Not found" });
    }

    const row = rows[0];
    const parsed =
      typeof row.questions_json === "string"
        ? safeJsonParse(row.questions_json, { questions: [] })
        : row.questions_json || { questions: [] };

    return res.json({
      id: row.id,
      topic: row.topic,
      quizType: row.quiz_type,
      questions: parsed.questions || [],
      createdAt: row.created_at,
    });
  } catch (e) {
    return res.status(500).json({
      message: "DB error",
      error: e?.message,
    });
  }
};

exports.listQuizzes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const topic = (req.query.topic || "").toString().trim();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let rows;

    if (topic) {
      const result = await db.query(
        `SELECT id, topic, quiz_type, created_at
         FROM quizzes
         WHERE user_id = $1 AND topic ILIKE $2
         ORDER BY created_at DESC`,
        [userId, `%${topic}%`]
      );
      rows = result.rows;
    } else {
      const result = await db.query(
        `SELECT id, topic, quiz_type, created_at
         FROM quizzes
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );
      rows = result.rows;
    }

    return res.json(rows);
  } catch (e) {
    return res.status(500).json({
      message: "DB error",
      error: e?.message,
    });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user?.id;
    const quizId = req.params.id;
    const { answers } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "answers must be an array" });
    }

    const { rows } = await db.query(
      `SELECT quiz_type, questions_json
       FROM quizzes
       WHERE id = $1 AND user_id = $2
       LIMIT 1`,
      [quizId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quizType = rows[0].quiz_type;
    const parsed =
      typeof rows[0].questions_json === "string"
        ? safeJsonParse(rows[0].questions_json, { questions: [] })
        : rows[0].questions_json || { questions: [] };

    const questions = parsed.questions || [];

    let score = 0;
    const total = questions.length;
    const feedback = [];

    for (const q of questions) {
      const a = answers.find((x) => x.id === q.id);

      if (!a) {
        feedback.push({
          id: q.id,
          correct: false,
          explanation: q.explanation || "",
        });
        continue;
      }

      if (quizType === "mcq") {
        const correct = Number(a.answerIndex) === Number(q.answerIndex);
        if (correct) score++;

        feedback.push({
          id: q.id,
          correct,
          explanation: q.explanation || "",
        });
      } else {
        const userText = (a.text || "").toString().trim().toLowerCase();
        const expected = (q.answer || "").toString().trim().toLowerCase();

        const correct =
          expected.length > 0 &&
          userText.includes(expected.slice(0, Math.min(20, expected.length)));

        if (correct) score++;

        feedback.push({
          id: q.id,
          correct,
          expected: q.answer,
          explanation: q.explanation || "",
        });
      }
    }

    const answersJson = JSON.stringify({ answers });
    const feedbackJson = JSON.stringify({ feedback });

const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;

const { rows: attemptRows } = await db.query(
  `INSERT INTO quiz_attempts
   (user_id, quiz_id, answers_json, score, total, score_percent, feedback_json)
   VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7::jsonb)
   RETURNING id`,
  [userId, quizId, answersJson, score, total, scorePercent, feedbackJson]
);

    return res.json({
      attemptId: attemptRows[0].id,
      score,
      total,
      feedback,
    });
  } catch (e) {
    return res.status(500).json({
      message: "DB error",
      error: e?.message,
    });
  }
};