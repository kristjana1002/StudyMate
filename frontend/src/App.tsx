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

import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <Dashboard />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <Dashboard />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/upload-notes"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <UploadNotes />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/quiz"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <QuizPage />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/ai-chat"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <AiChat />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/progress"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <ProgressPage />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/summary"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <Summary />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/flashcards"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <Flashcards />
              </>
            </RequireAuth>
          }
        />
e

      </Routes>
    </Router>
  );
};
<Route
  path="/quiz/:id"
  element={
    <RequireAuth>
      <>
        <Navbar />
        <QuizPage />
      </>
    </RequireAuth>
  }
/>

export default App;