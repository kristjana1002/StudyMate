const pool = require("../config/db");

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const msToHours = (ms) => Math.round((ms / 36e5) * 10) / 10;

const timeAgo = (date) => {
  const t = new Date(date).getTime();
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const getTotalStudyHours = async (userId) => {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (ended_at - started_at)) * 1000), 0)::bigint AS total_ms
     FROM study_sessions
     WHERE user_id = $1`,
    [userId]
  );
  return msToHours(Number(rows[0].total_ms));
};

const getWeeklyStudyHours = async (userId) => {
  const { rows } = await pool.query(
    `SELECT EXTRACT(ISODOW FROM started_at)::int AS weekday,
            COALESCE(SUM(EXTRACT(EPOCH FROM (ended_at - started_at)) * 1000), 0)::bigint AS total_ms
     FROM study_sessions
     WHERE user_id = $1
       AND started_at >= (now() - interval '7 days')
     GROUP BY weekday`,
    [userId]
  );

  const map = new Map();
  rows.forEach((r) => map.set(Number(r.weekday), Number(r.total_ms)));

  return DAYS.map((day, idx) => {
    const iso = idx + 1;
    return { day, hours: msToHours(map.get(iso) || 0) };
  });
};

const getStudyStreak = async (userId) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT (started_at::date)::text AS day
     FROM study_sessions
     WHERE user_id = $1
     ORDER BY day DESC`,
    [userId]
  );

  const set = new Set(rows.map((r) => r.day));
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) streak++;
    else break;
  }

  return streak;
};

const getTopicsMastered = async (userId) => {
  const { rows } = await pool.query(
    `SELECT COUNT(DISTINCT topic)::int AS count
     FROM study_tasks
     WHERE user_id = $1`,
    [userId]
  );
  return Number(rows[0]?.count ?? 0);
};

const getTodayStudyPlan = async (userId) => {
  const { rows } = await pool.query(
    `SELECT COALESCE(s.name, 'General') AS subject,
            t.topic,
            t.due_date::text AS due_date,
            t.priority
     FROM study_tasks t
     LEFT JOIN subjects s ON s.id = t.subject_id
     WHERE t.user_id = $1
       AND t.due_date BETWEEN current_date AND (current_date + 1)
     ORDER BY t.due_date ASC,
       CASE t.priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END`,
    [userId]
  );

  const todayKey = new Date().toISOString().slice(0, 10);

  return rows.map((r) => ({
    subject: r.subject,
    topic: r.topic,
    due: r.due_date === todayKey ? "Today" : "Tomorrow",
    priority: r.priority,
  }));
};

const getRecentActivity = async (userId) => {
  const { rows } = await pool.query(
    `SELECT label, created_at, score_percent
     FROM activities
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 10`,
    [userId]
  );

  return rows.map((r) => ({
    activity: r.label,
    time: timeAgo(r.created_at),
    ...(r.score_percent !== null && r.score_percent !== undefined
      ? { score: `${r.score_percent}%` }
      : {}),
  }));
};

module.exports = {
  getTotalStudyHours,
  getWeeklyStudyHours,
  getStudyStreak,
  getTopicsMastered,
  getTodayStudyPlan,
  getRecentActivity,
};

