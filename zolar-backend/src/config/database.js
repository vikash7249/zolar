const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME     || 'zolar_db',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'mysql123',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL Database connected!');
    conn.release();
    return true;
  } catch (error) {
    console.error('❌ Database error:', error.message);
    throw error;
  }
};

const query = async (text, params = []) => {
  const mysqlQuery = text.replace(/\$\d+/g, '?');
  try {
    const [rows] = await pool.execute(mysqlQuery, params);
    return {
      rows: Array.isArray(rows) ? rows : [rows],
      rowCount: Array.isArray(rows) ? rows.length : 1
    };
  } catch (error) {
    console.error('Query Error:', error.message);
    throw error;
  }
};

module.exports = { pool, connectDB, query };