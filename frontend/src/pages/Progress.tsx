import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { authedGet } from "../services/api";

type DashboardResponse = {
  user: {
    displayName: string;
  };
  stats: {
    studyStreakDays: number;
    topicsMastered: number;
    avgQuizScore: number;
    totalStudyHours: number;
  };
  weeklyStudyHours: { day: string; hours: number }[];
  subjectPerformance: { subject: string; score: number }[];
  studyPlan: {
    subject: string;
    topic: string;
    due: string;
    priority: string;
  }[];
  recentActivity: {
    activity: string;
    time: string;
    score?: string;
  }[];
};

const ProgressPage: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await authedGet<DashboardResponse>("/dashboard");
        setData(res);
      } catch (e: any) {
        setError(e?.message || "Failed to load progress");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const weeklyPerformance = useMemo(() => {
    if (!data?.recentActivity?.length) return [];

    const scored = data.recentActivity
      .filter((item) => item.score)
      .slice(0, 7)
      .reverse()
      .map((item, index) => ({
        day: `#${index + 1}`,
        score: Number((item.score || "0").replace("%", "")) || 0,
      }));

    return scored;
  }, [data]);

  const strengths = useMemo(() => {
    if (!data?.subjectPerformance?.length) return [];
    return [...data.subjectPerformance]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [data]);

  const weakAreas = useMemo(() => {
    if (!data?.subjectPerformance?.length) return [];
    return [...data.subjectPerformance]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }, [data]);

  const achievements = useMemo(() => {
    if (!data) return [];

    return [
      {
        title: "Study Streak",
        description: `${data.stats.studyStreakDays} day streak`,
        status:
          data.stats.studyStreakDays > 0 ? `${data.stats.studyStreakDays} days` : "Locked",
        locked: data.stats.studyStreakDays === 0,
      },
      {
        title: "Topics Mastered",
        description: `${data.stats.topicsMastered} topics completed`,
        status:
          data.stats.topicsMastered > 0 ? `${data.stats.topicsMastered} done` : "Locked",
        locked: data.stats.topicsMastered === 0,
      },
      {
        title: "Quiz Average",
        description: `Average score ${data.stats.avgQuizScore}%`,
        status:
          data.stats.avgQuizScore > 0 ? `${data.stats.avgQuizScore}%` : "Locked",
        locked: data.stats.avgQuizScore === 0,
      },
      {
        title: "Study Hours",
        description: `${data.stats.totalStudyHours} total study hours`,
        status:
          data.stats.totalStudyHours > 0
            ? `${data.stats.totalStudyHours} hrs`
            : "Locked",
        locked: data.stats.totalStudyHours === 0,
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="progress-page">
        <div className="progress-container">
          <div className="progress-header">
            <h1>Progress Tracker</h1>
            <p>Loading your real progress data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="progress-page">
        <div className="progress-container">
          <div className="progress-header">
            <h1>Progress Tracker</h1>
            <p>{error || "Could not load progress."}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: "◔",
      value: `${data.stats.totalStudyHours}`,
      label: "Total Study Hours",
      change: "Real data",
      colorClass: "cyan",
    },
    {
      icon: "◎",
      value: `${data.stats.avgQuizScore}%`,
      label: "Average Score",
      change: "Real data",
      colorClass: "green",
    },
    {
      icon: "✿",
      value: `${data.stats.topicsMastered}`,
      label: "Topics Mastered",
      change: "Real data",
      colorClass: "purple",
    },
    {
      icon: "⚡",
      value: `${data.stats.studyStreakDays} days`,
      label: "Study Streak",
      change: "Real data",
      colorClass: "orange",
    },
  ];

  return (
    <div className="progress-page">
      <div className="progress-container">
        <div className="progress-header">
          <h1>Progress Tracker</h1>
          <p>Track your real learning progress and improvement areas</p>
        </div>

        <div className="progress-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="progress-stat-card">
              <div className="progress-stat-top">
                <span className={`progress-stat-icon ${stat.colorClass}`}>
                  {stat.icon}
                </span>
                <span className="progress-stat-change">{stat.change}</span>
              </div>
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="progress-two-col">
          <div className="chart-card">
            <h3>◔ Weekly Study Hours</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.weeklyStudyHours}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                  <XAxis dataKey="day" stroke="#7f8da5" />
                  <YAxis stroke="#7f8da5" />
                  <Tooltip
                    contentStyle={{
                      background: "#081630",
                      border: "1px solid rgba(0,255,255,0.15)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#16d9ff"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>↗ Recent Quiz Performance</h3>
            <div className="chart-wrap">
              {weeklyPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyPerformance}>
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="4 4"
                    />
                    <XAxis dataKey="day" stroke="#7f8da5" />
                    <YAxis stroke="#7f8da5" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        background: "#081630",
                        border: "1px solid rgba(168,85,247,0.2)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#a855f7"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#a855f7" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="sm-empty">No quiz results yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="progress-two-col">
          <div className="chart-card">
            <h3>◎ Subject Performance</h3>
            <div className="subject-performance-list">
              {data.subjectPerformance.length > 0 ? (
                data.subjectPerformance.map((item) => (
                  <div key={item.subject} className="subject-performance-item">
                    <div className="subject-performance-top">
                      <span>{item.subject}</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="subject-performance-bar">
                      <div
                        className="subject-performance-fill"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm-empty">No subject performance data yet.</div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <h3>📘 Current Study Plan</h3>
            <div className="topic-list">
              {data.studyPlan.length > 0 ? (
                data.studyPlan.map((item, index) => (
                  <div key={`${item.topic}-${index}`} className="topic-box strong">
                    <div className="topic-row">
                      <div>
                        <h4>{item.topic}</h4>
                        <p>{item.subject}</p>
                      </div>
                      <span>{item.priority}</span>
                    </div>
                    <div style={{ color: "#9aa7bd" }}>{item.due}</div>
                  </div>
                ))
              ) : (
                <div className="sm-empty">No study tasks planned yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="chart-card full-width-card">
          <h3>◫ Subject Performance Overview</h3>
          <div className="chart-wrap">
            {data.subjectPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data.subjectPerformance}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                  <XAxis dataKey="subject" stroke="#7f8da5" />
                  <YAxis stroke="#7f8da5" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "#081630",
                      border: "1px solid rgba(168,85,247,0.2)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#a855f7"
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="sm-empty">No subject chart data yet.</div>
            )}
          </div>
        </div>

        <div className="progress-two-col">
          <div className="list-card">
            <h3>↗ Areas to Improve</h3>
            <div className="topic-list">
              {weakAreas.length > 0 ? (
                weakAreas.map((item) => (
                  <div key={item.subject} className="topic-box weak">
                    <div className="topic-row">
                      <div>
                        <h4>{item.subject}</h4>
                        <p>Lower scoring subject</p>
                      </div>
                      <span>{item.score}%</span>
                    </div>
                    <div className="topic-progress">
                      <div
                        className="topic-progress-fill weak-fill"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm-empty">No weak areas yet.</div>
              )}
            </div>
          </div>

          <div className="list-card">
            <h3>⚲ Your Strengths</h3>
            <div className="topic-list">
              {strengths.length > 0 ? (
                strengths.map((item) => (
                  <div key={item.subject} className="topic-box strong">
                    <div className="topic-row">
                      <div>
                        <h4>{item.subject}</h4>
                        <p>Higher scoring subject</p>
                      </div>
                      <span>{item.score}%</span>
                    </div>
                    <div className="topic-progress">
                      <div
                        className="topic-progress-fill strong-fill"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm-empty">No strengths yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="achievement-section">
          <h3>🏅 Achievements</h3>
          <div className="achievement-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`achievement-card ${achievement.locked ? "locked" : ""}`}
              >
                <div className="achievement-icon">🏅</div>
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
                <span>{achievement.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;