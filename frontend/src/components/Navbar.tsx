import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => (pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-logo">StudyMate</div>

      <ul className="nav-links">
        <li>
          <Link className={isActive("/dashboard")} to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link className={isActive("/upload-notes")} to="/upload-notes">Upload</Link>
        </li>
        <li>
          <Link className={isActive("/summary")} to="/summary">Summary</Link>
        </li>
        <li>
          <Link className={isActive("/quiz")} to="/quiz">Quiz</Link>
        </li>
        <li>
          <Link className={isActive("/flashcards")} to="/flashcards">Flashcards</Link>
        </li>
        <li>
          <Link className={isActive("/ai-chat")} to="/ai-chat">AI Chat</Link>
        </li>
        <li>
          <Link className={isActive("/progress")} to="/progress">Progress</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;