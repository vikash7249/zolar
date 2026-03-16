const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get all projects
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*,
        COUNT(DISTINCT t.id) as total_tasks,
        SUM(t.status = 'completed') as completed_tasks,
        COUNT(DISTINCT pm.user_id) as member_count
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json({ projects: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE id = ?',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      name, description, status,
      priority, deadline, color, start_date
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name zaroori hai' });
    }

    const id = uuidv4();
    await query(
      `INSERT INTO projects
        (id, name, description, status, priority, deadline, start_date, color, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, name, description || '',
        status || 'planning',
        priority || 'medium',
        deadline || null,
        start_date || null,
        color || '#06b6d4',
        req.userId
      ]
    );

    const result = await query(
      'SELECT * FROM projects WHERE id = ?', [id]
    );
    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', authenticate, async (req, res) => {
  try {
    const {
      name, description, status,
      priority, deadline, progress
    } = req.body;

    await query(
      `UPDATE projects SET
        name = ?, description = ?, status = ?,
        priority = ?, deadline = ?, progress = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        name, description, status,
        priority, deadline || null,
        progress || 0,
        req.params.id
      ]
    );

    const result = await query(
      'SELECT * FROM projects WHERE id = ?',
      [req.params.id]
    );
    res.json({ project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;