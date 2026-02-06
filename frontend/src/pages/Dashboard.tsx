import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>
          Welcome back, <span>Scholar</span>
        </h1>
        <p>Your AI-powered learning companion is ready to help you excel</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Study Streak</h3>
          <p className="stat-value">
            12 <span>days</span>
          </p>
        </div>

        <div className="stat-card">
          <h3>Topics Mastered</h3>
          <p className="stat-value">
            24 <span>topics</span>
          </p>
        </div>

        <div className="stat-card">
          <h3>Quiz Score</h3>
          <p className="stat-value">
            87 <span>%</span>
          </p>
        </div>

        <div className="stat-card">
          <h3>Study Hours</h3>
          <p className="stat-value">
            42 <span>hrs</span>
          </p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>

        <div className="actions">
          <div className="action-card">Upload Notes →</div>
          <div className="action-card">Take Quiz →</div>
          <div className="action-card">AI Assistant →</div>
          <div className="action-card">Flashcards →</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
