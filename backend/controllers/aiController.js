const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.chat = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { message, topic } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const prompt = `You are StudyMate, a helpful AI study assistant.
Your job is to help students understand concepts clearly and simply.
Keep answers accurate, student-friendly, and well-structured.
If useful, explain in small steps.

${topic ? `Current topic/context: ${topic}` : ""}

Student message:
${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const reply = (response.text || "").trim();

    return res.json({
      reply: reply || "I couldn't generate a response right now.",
    });
  } catch (e) {
    return res.status(500).json({
      message: "AI chat failed",
      error: e?.message,
    });
  }
};