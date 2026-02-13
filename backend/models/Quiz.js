const pool = require("../config/db");

const getAverageScore = async (userId) => {
  const { rows } = await pool.query(
    `SELECT AVG(score_percent)::numeric(10,2) AS avg
     FROM quiz_attempts
     WHERE user_id = $1`,
    [userId]
  );

  return rows[0]?.avg ? Math.round(Number(rows[0].avg)) : 0;
};

const getSubjectPerformance = async (userId) => {
  const { rows } = await pool.query(
    `SELECT COALESCE(s.name, 'Unknown') AS subject,
            AVG(qa.score_percent)::numeric(10,2) AS score
     FROM quiz_attempts qa
     JOIN quizzes q ON q.id = qa.quiz_id
     LEFT JOIN subjects s ON s.id = q.subject_id
     WHERE qa.user_id = $1
     GROUP BY subject
     ORDER BY subject ASC`,
    [userId]
  );

  return rows.map((r) => ({
    subject: r.subject,
    score: r.score ? Math.round(Number(r.score)) : 0,
  }));
};

module.exports = {
  getAverageScore,
  getSubjectPerformance,
};
