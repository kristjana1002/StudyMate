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
import './App.css';


const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/UploadNotes" element={<UploadNotes />} />
        <Route path="/QuizPage" element={<QuizPage />} />
        <Route path="/AiChat" element={<AiChat/>} />
        <Route path="Progress" element={<ProgressPage />}/>
        <Route path="/SummaryPage" element={<Summary />} />
        <Route path="/Flashcards" element={<Flashcards />} />
      </Routes>
    </Router>
  );
};

export default App;
