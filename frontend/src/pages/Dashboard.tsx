import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { authedGet } from "../services/api";

type DashboardResponse = {
  user: { displayName: string };
  stats: {
    studyStreakDays: number;
    topicsMastered: number;
    avgQuizScore: number;
    totalStudyHours: number;
  };
  weeklyStudyHours: { day: string; hours: number }[];
  subjectPerformance: { subject: string; score: number }[];
  studyPlan: { subject: string; topic: string; due: string; priority: "High" | "Medium" | "Low" }[];
  recentActivity: { activity: string; time: string; score?: string }[];
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await authedGet<DashboardResponse>("/dashboard");
setData(res);

      } catch (e: any) {
        setError(e?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className="dashboard-container">Loading...</div>;
  if (error) return <div className="dashboard-container">Error: {error}</div>;
  if (!data) return null;

  const { user, stats, weeklyStudyHours, subjectPerformance, studyPlan, recentActivity } = data;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          Welcome back, <span>{user.displayName || "Scholar"}</span>
        </h1>
        <p>Your AI-powered learning companion is ready to help you excel</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Study Streak</h3>
          <p className="stat-value">
            {stats.studyStreakDays} <span>days</span>
          </p>
        </div>

        <div className="stat-card">
          <h3>Topics Mastered</h3>
          <p className="stat-value">
            {stats.topicsMastered} <span>topics</span>
          </p>
        </div>

        <div className="stat-card">
          <h3>Quiz Score</h3>
          <p className="stat-value">
            {stats.avgQuizScore} <span>%</span>
          </p>
        </div>

        <div className="stat-card">
          <h3>Study Hours</h3>
          <p className="stat-value">
            {stats.totalStudyHours} <span>hrs</span>
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

      <div className="charts-row">
        <div className="chart-card">
          <h2>📈 Weekly Study Hours</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyStudyHours} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>🎯 Subject Performance</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={subjectPerformance} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="info-row">
        <div className="info-card">
          <h3>📅 Today's Study Plan</h3>
          {studyPlan.length === 0 ? (
            <p className="empty">No tasks yet</p>
          ) : (
            studyPlan.map(({ subject, topic, due, priority }, i) => (
              <div key={i} className="study-plan-item">
                <p className={`subject ${priority.toLowerCase()}`}>{subject}</p>
                <p className="topic">{topic}</p>
                <p className="due">Due: {due}</p>
                <span className={`priority ${priority.toLowerCase()}`}>{priority}</span>
              </div>
            ))
          )}
        </div>

        <div className="info-card">
          <h3>⏰ Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="empty">No activity yet</p>
          ) : (
            recentActivity.map(({ activity, time, score }, i) => (
              <div key={i} className="activity-item">
                <p className="activity-name">{activity}</p>
                <p className="activity-time">{time}</p>
                {score && <p className="activity-score">{score}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
