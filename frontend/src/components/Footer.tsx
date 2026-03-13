import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <h2>StudyMate</h2>
          <p>
            AI-powered learning platform designed to help students study smarter,
            understand concepts faster, and track their progress.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/upload-notes">Upload Notes</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/flashcards">Flashcards</Link>
          <Link to="/progress">Progress</Link>
        </div>

        <div className="footer-links">
          <h4>AI Tools</h4>
          <Link to="/ai-chat">AI Assistant</Link>
          <Link to="/summary">Summary</Link>
          <Link to="/quiz">Quiz Generator</Link>
        </div>

        <div className="footer-right">
          <h4>StudyMate</h4>
          <p>© {new Date().getFullYear()} StudyMate</p>
          <p>Built with React, Node, and AI</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;