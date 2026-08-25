const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { findAllByUserId, findById, create, update, deleteById } = require('../models/ChildProfile');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const children = await findAllByUserId(req.user.id);
    res.json(children);
  } catch (err) {
    console.error('Get children error:', err);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, age, supportLevel, interests, learningPreferences, createdBy } = req.body;

    if (!name || !age || !supportLevel) {
      return res.status(400).json({ error: 'Name, age, and supportLevel are required' });
    }

    if (!['mild', 'moderate', 'substantial', 'other'].includes(supportLevel)) {
      return res.status(400).json({ error: 'Invalid supportLevel' });
    }

    const child = await create({ name, age, supportLevel, interests, learningPreferences, createdBy }, req.user.id);
    res.status(201).json(child);
  } catch (err) {
    console.error('Create child error:', err);
    res.status(500).json({ error: 'Failed to create child profile' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, supportLevel, interests, learningPreferences } = req.body;

    if (!name || !age || !supportLevel) {
      return res.status(400).json({ error: 'Name, age, and supportLevel are required' });
    }

    if (!['mild', 'moderate', 'substantial', 'other'].includes(supportLevel)) {
      return res.status(400).json({ error: 'Invalid supportLevel' });
    }

    const result = await update(id, req.user.id, { name, age, supportLevel, interests, learningPreferences });
    
    if (result.count === 0) {
      return res.status(404).json({ error: 'Child profile not found' });
    }

    const child = await findById(id, req.user.id);
    res.json(child);
  } catch (err) {
    console.error('Update child error:', err);
    res.status(500).json({ error: 'Failed to update child profile' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteById(id, req.user.id);

    if (result.count === 0) {
      return res.status(404).json({ error: 'Child profile not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete child error:', err);
    res.status(500).json({ error: 'Failed to delete child profile' });
  }
});

module.exports = router;
