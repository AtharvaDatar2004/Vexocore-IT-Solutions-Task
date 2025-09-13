const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    const [result] = await pool.query('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)', [userId, title, description]);
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update task (title, description, status)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;
    await pool.query('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?', [title, description, status, id, userId]);
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
