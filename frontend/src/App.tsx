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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequireAuth from "./components/RequireAuth";
import Footer from "./components/Footer";

import "./App.css";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <RequireAuth>
    <>
      <Navbar />
      {children}
    </>
  </RequireAuth>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/upload-notes"
          element={
            <ProtectedLayout>
              <UploadNotes />
            </ProtectedLayout>
          }
        />

        <Route
          path="/quiz"
          element={
            <ProtectedLayout>
              <QuizPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <ProtectedLayout>
              <QuizPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/ai-chat"
          element={
            <ProtectedLayout>
              <AiChat />
            </ProtectedLayout>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedLayout>
              <ProgressPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/summary"
          element={
            <ProtectedLayout>
              <Summary />
            </ProtectedLayout>
          }
        />

        <Route
          path="/flashcards"
          element={
            <ProtectedLayout>
              <Flashcards />
            </ProtectedLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;