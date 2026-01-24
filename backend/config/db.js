// Connects to the database
// Makes it easy to use in models
// backend/config/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'studymate',
  port: process.env.DB_PORT || 5432,
});

pool.connect()
  .then(() => console.log('Postgres database connected ✅'))
  .catch((err) => console.error('Database connection failed:', err));

module.exports = pool;
