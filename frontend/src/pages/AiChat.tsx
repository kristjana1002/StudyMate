import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { sendChatMessage } from "../services/api";

type Message = {
  id: number;
  sender: "ai" | "user";
  text: string;
  time: string;
};

const suggestedQuestions = [
  "Explain quantum entanglement",
  "Create a quiz on calculus",
  "What are Newton's laws?",
  "Help with organic chemistry",
];

const AiChat: React.FC = () => {
  const location = useLocation() as any;
  const topicFromState = location.state?.topic || "";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: topicFromState
        ? `Hello! I'm your AI study assistant. I can help you with ${topicFromState}. Ask me anything about it.`
        : "Hello! I'm your AI study assistant. I can help you understand concepts, explain topics, generate quizzes, or answer questions about your study materials. How can I help you today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: messageText,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(messageText, topicFromState);

      const aiReply: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: res.reply,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (e: any) {
      const errorReply: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: e?.message || "Something went wrong while contacting the AI.",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <h1>
            AI <span>Study Assistant</span>
          </h1>
          <p>
            {topicFromState
              ? `Ask me anything about ${topicFromState}`
              : "Ask me anything about your study materials"}
          </p>
        </div>

        <div className="chat-shell">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${
                  message.sender === "user" ? "user-message" : "ai-message"
                }`}
              >
                <div className="message-label">
                  {message.sender === "ai" ? "AI Assistant" : "You"}
                </div>
                <p>{message.text}</p>
                <span className="message-time">{message.time}</span>
              </div>
            ))}

            {loading && (
              <div className="chat-message ai-message">
                <div className="message-label">AI Assistant</div>
                <p>Thinking...</p>
                <span className="message-time">{getCurrentTime()}</span>
              </div>
            )}
          </div>

          <div className="suggested-section">
            <p>Suggested questions:</p>
            <div className="suggested-buttons">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggested-btn"
                  onClick={() => sendMessage(question)}
                  disabled={loading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-input-area">
            <div className="chat-input-row">
              <textarea
                placeholder="Ask me anything about your studies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={loading}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading}>
                ➤
              </button>
            </div>
            <p className="chat-help-text">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>

        <div className="ai-tools-grid">
          <div className="tool-card">
            <div className="tool-icon purple">🧠</div>
            <p>Explain Concepts</p>
          </div>

          <div className="tool-card">
            <div className="tool-icon cyan">✦</div>
            <p>Generate Quizzes</p>
          </div>

          <div className="tool-card">
            <div className="tool-icon green">💬</div>
            <p>Answer Questions</p>
          </div>

          <div className="tool-card">
            <div className="tool-icon orange">💡</div>
            <p>Study Tips</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;