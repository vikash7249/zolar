const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get all users
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, first_name, last_name, email,
        role, department, job_profile,
        status, gender, phone, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, first_name, last_name, email, role, department, job_profile, status FROM users WHERE id = ?',
      [req.params.id]
    );
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      first_name, last_name, email,
      password, role, department,
      job_profile, gender, phone
    } = req.body;

    const passwordHash = await bcrypt.hash(
      password || 'Admin@123',
      parseInt(process.env.BCRYPT_ROUNDS) || 12
    );

    const id = uuidv4();
    await query(
      `INSERT INTO users
        (id, first_name, last_name, email, password_hash, role, department, job_profile, gender, phone, status, email_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 1)`,
      [
        id, first_name, last_name,
        email.toLowerCase(), passwordHash,
        role || 'team_member',
        department || '',
        job_profile || '',
        gender || 'male',
        phone || ''
      ]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const {
      first_name, last_name,
      department, role, status, phone
    } = req.body;

    await query(
      `UPDATE users SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        department = COALESCE(?, department),
        role = COALESCE(?, role),
        status = COALESCE(?, status),
        phone = COALESCE(?, phone)
       WHERE id = ?`,
      [
        first_name || null,
        last_name || null,
        department || null,
        role || null,
        status || null,
        phone || null,
        req.params.id
      ]
    );
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;