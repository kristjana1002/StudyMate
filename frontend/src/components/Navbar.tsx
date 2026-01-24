import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/Dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/UploadNotes">Upload Notes</Link>
        </li>
        <li>
          <Link to="/QuizPage">Quiz</Link>
        </li>
        <li>
          <Link to="/AiChat">AI Chat</Link>
        </li>
        <li>
          <Link to="/Progress">Progress</Link>
        </li>
        <li>
          <Link to="/SummaryPage">Summary</Link>
        </li>
        <li>
          <Link to="/Flashcards">Flashcards</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
