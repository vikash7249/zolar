const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.get('/stats', authenticate, async (req, res) => {
  try {
    const [projects, tasks, users, overdue] = await Promise.all([
      query(`SELECT
        COUNT(*) as total,
        SUM(status = 'active') as active,
        SUM(status = 'completed') as completed,
        SUM(status = 'planning') as planning
       FROM projects`),
      query(`SELECT
        COUNT(*) as total,
        SUM(status = 'completed') as completed,
        SUM(status = 'in_progress') as in_progress,
        SUM(status = 'todo') as todo
       FROM tasks`),
      query(`SELECT COUNT(*) as total FROM users WHERE status = 'active'`),
      query(`SELECT COUNT(*) as total FROM tasks
             WHERE deadline < CURDATE() AND status != 'completed'`)
    ]);

    res.json({
      projects: projects.rows[0],
      tasks: tasks.rows[0],
      users: users.rows[0],
      overdue: overdue.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;