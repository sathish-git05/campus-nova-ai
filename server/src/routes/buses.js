import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all bus routes
router.get('/', (req, res) => {
  const buses = db.get('buses');
  res.json(buses);
});

// Update bus transit status / location
router.patch('/:id/location', (req, res) => {
  const { currentLocation, etaMinutes, status } = req.body;
  const bus = db.findOne('buses', b => b.id === req.params.id);
  if (!bus) return res.status(404).json({ error: 'Bus not found' });

  const updated = db.update('buses', b => b.id === req.params.id, {
    ...(currentLocation && { currentLocation }),
    ...(etaMinutes !== undefined && { etaMinutes: Number(etaMinutes) }),
    ...(status && { status })
  });

  res.json(updated);
});

export default router;
