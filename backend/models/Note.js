const pool = require("../config/db");

const getRecentNotes = async (userId, limit = 5) => {
  const { rows } = await pool.query(
    `SELECT id, title, created_at
     FROM notes
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return rows;
};

module.exports = {
  getRecentNotes,
};
