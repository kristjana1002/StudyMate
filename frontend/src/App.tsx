import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import UploadNotes from "./pages/UploadNotes";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/Progress";
import AiChat from "./pages/AiChat";
import Summary from "./pages/SummaryPage";
import Flashcards from "./pages/Flashcards";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-notes" element={<UploadNotes />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/ai-chat" element={<AiChat />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/flashcards" element={<Flashcards />} />
      </Routes>
    </Router>
  );
};

export default App;
