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

async function aiGenerateFlashcards({ topic, sourceText, count }) {
  const prompt = `You are StudyMate. Create ${count} student-friendly flashcards.

Topic: ${topic}
${sourceText ? `Use these notes as the main source:\n${sourceText}\n` : ""}

Return ONLY valid JSON in this exact shape:
{
  "cards": [
    {
      "id": "fc1",
      "question": "string",
      "answer": "string"
    }
  ]
}

Rules:
- No markdown
- No code fences
- No extra text
- Keep answers clear and concise
- Make cards useful for studying`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  const text = stripCodeFences(response.text || "");
  const json = safeJsonParse(text, null);

  if (!json?.cards?.length) {
    throw new Error("AI flashcard generation failed (invalid JSON).");
  }

  return json.cards;
}

exports.generateFlashcards = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { topic, noteId = null, count = 8 } = req.body || {};

    if (!topic?.trim()) {
      return res.status(400).json({ message: "topic is required" });
    }

    let sourceText = "";

    if (noteId) {
      const { rows } = await db.query(
        `SELECT content, summary
         FROM notes
         WHERE id = $1 AND user_id = $2
         LIMIT 1`,
        [noteId, userId]
      );

      if (rows.length) {
        sourceText = rows[0].content || rows[0].summary || "";
      }
    }

    const cards = await aiGenerateFlashcards({
      topic: topic.trim(),
      sourceText,
      count: Number(count) || 8,
    });

    return res.json({
      topic: topic.trim(),
      cards,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Generate flashcards failed",
      error: e?.message,
    });
  }
};