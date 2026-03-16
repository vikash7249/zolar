const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get all tasks
router.get('/', authenticate, async (req, res) => {
  try {
    const { projectId, status, assignee } = req.query;

    let sql = `
      SELECT t.*,
        CONCAT(u.first_name, ' ', u.last_name) as assignee_name,
        p.name as project_name,
        p.color as project_color
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (projectId) {
      sql += ' AND t.project_id = ?';
      params.push(projectId);
    }
    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }
    if (assignee) {
      sql += ' AND t.assigned_to = ?';
      params.push(assignee);
    }

    sql += ' ORDER BY t.created_at DESC';

    const result = await query(sql, params);
    res.json({ tasks: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      title, description, projectId,
      assignedTo, priority, status, deadline
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title aur project zaroori hain' });
    }

    const id = uuidv4();
    await query(
      `INSERT INTO tasks
        (id, title, description, project_id, assigned_to, priority, status, deadline, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, title, description || '',
        projectId,
        assignedTo || null,
        priority || 'medium',
        status || 'todo',
        deadline || null,
        req.userId
      ]
    );

    const result = await query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { status, priority, title, assigned_to, description } = req.body;

    await query(
      `UPDATE tasks SET
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        title = COALESCE(?, title),
        assigned_to = COALESCE(?, assigned_to),
        description = COALESCE(?, description),
        updated_at = NOW()
       WHERE id = ?`,
      [
        status || null,
        priority || null,
        title || null,
        assigned_to || null,
        description || null,
        req.params.id
      ]
    );

    const result = await query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;