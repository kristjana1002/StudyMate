import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weeklyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 4.1 },
  { day: "Fri", hours: 3.6 },
  { day: "Sat", hours: 5.3 },
  { day: "Sun", hours: 4.9 },
];

const subjectPerformance = [
  { subject: "Math", score: 90 },
  { subject: "Physics", score: 82 },
  { subject: "Chemistry", score: 95 },
  { subject: "Biology", score: 89 },
  { subject: "English", score: 75 },
];

const studyPlan = [
  {
    subject: "Mathematics",
    topic: "Calculus Integration",
    due: "Today",
    priority: "High",
  },
  {
    subject: "Physics",
    topic: "Quantum Mechanics",
    due: "Tomorrow",
    priority: "Medium",
  },
];

const recentActivity = [
  { activity: "Completed Math Quiz", time: "2 hours ago", score: "92%" },
  { activity: "Uploaded Physics Notes", time: "5 hours ago" },
  { activity: "Chemistry Flashcards", time: "1 day ago", score: "88%" },
];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>
          Welcome back, <span>Scholar</span>
        </h1>
        <p>Your AI-powered learning companion is ready to help you excel</p>
      </div>

      {/* Stats */}
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

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>

        <div className="actions">
          <div className="action-card">Upload Notes →</div>
          <div className="action-card">Take Quiz →</div>
          <div className="action-card">AI Assistant →</div>
          <div className="action-card">Flashcards →</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="chart-card">
          <h2>📈 Weekly Study Hours</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={weeklyData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>🎯 Subject Performance</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={subjectPerformance}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="subject" stroke="#7c3aed" />
              <YAxis domain={[0, 100]} stroke="#7c3aed" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#a78bfa"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Info row */}
      <div className="info-row">
        <div className="info-card">
          <h3>📅 Today's Study Plan</h3>
          {studyPlan.map(({ subject, topic, due, priority }, i) => (
            <div key={i} className="study-plan-item">
              <p className={`subject ${priority.toLowerCase()}`}>{subject}</p>
              <p className="topic">{topic}</p>
              <p className="due">Due: {due}</p>
              <span className={`priority ${priority.toLowerCase()}`}>
                {priority}
              </span>
            </div>
          ))}
        </div>

        <div className="info-card">
          <h3>⏰ Recent Activity</h3>
          {recentActivity.map(({ activity, time, score }, i) => (
            <div key={i} className="activity-item">
              <p className="activity-name">{activity}</p>
              <p className="activity-time">{time}</p>
              {score && <p className="activity-score">{score}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
