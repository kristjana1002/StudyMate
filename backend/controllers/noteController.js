const fs = require("fs");
const path = require("path");
const db = require("../config/db");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".txt" || ext === ".md") {
    return fs.readFileSync(filePath, "utf8");
  }

  return "";
}

function stripCodeFences(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function summarize(text) {
  if (!text || text.trim().length < 40) {
    return "Couldn’t extract text from this file yet. For now upload a .txt file (PDF/image parsing comes next).";
  }

  const input = `You are StudyMate. Summarize these notes into:
1) A short overview (2-4 sentences)
2) Key points (bullets)
3) Important definitions (bullets)
4) 3 quiz questions

Keep it clean and student-friendly.

NOTES:
${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: input,
  });

  const summary = stripCodeFences(response.text || "");
  return summary || "No summary returned.";
}

exports.uploadAndSummarize = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const title =
      (req.body.title || "").trim() ||
      (file.originalname ? file.originalname : "Untitled");

    const content = extractText(file.path);
    const summary = await summarize(content);

    const sql = `
      INSERT INTO notes (user_id, title, original_filename, file_path, content, summary)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title
    `;

    const { rows } = await db.query(sql, [
      userId,
      title,
      file.originalname,
      file.path,
      content,
      summary,
    ]);

    return res.json({
      noteId: rows[0].id,
      title: rows[0].title,
      summary,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Upload/summarize failed",
      error: e?.message,
    });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const noteId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!noteId) {
      return res.status(400).json({ message: "Bad note id" });
    }

    const sql = `
      SELECT id, title, summary, created_at
      FROM notes
      WHERE id = $1 AND user_id = $2
      LIMIT 1
    `;

    const { rows } = await db.query(sql, [noteId, userId]);

    if (!rows.length) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.json(rows[0]);
  } catch (e) {
    return res.status(500).json({
      message: "DB error",
      error: e?.message,
    });
  }
};