const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const db = require("../config/db");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".txt" || ext === ".md") {
    return fs.readFileSync(filePath, "utf8");
  }
  return "";
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

NOTES:
${text}`;

  const resp = await client.responses.create({
    model: "gpt-5.2",
    input,
  });

  return (resp.output_text || "").trim() || "No summary returned.";
}

exports.uploadAndSummarize = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const file = req.file;
    const title = (req.body.title || "").trim() || (file?.originalname ? file.originalname : "Untitled");

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const content = extractText(file.path);
    const summary = await summarize(content);

    const sql = `
      INSERT INTO notes (user_id, title, original_filename, file_path, content, summary)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [userId, title, file.originalname, file.path, content, summary],
      (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        return res.json({
          noteId: result.insertId,
          title,
        });
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "Upload/summarize failed", error: e?.message });
  }
};

exports.getNoteById = (req, res) => {
  const userId = req.user?.id;
  const noteId = Number(req.params.id);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!noteId) return res.status(400).json({ message: "Bad note id" });

  const sql = `SELECT id, title, summary, created_at FROM notes WHERE id = ? AND user_id = ? LIMIT 1`;
  db.query(sql, [noteId, userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Not found" });
    return res.json(rows[0]);
  });
};