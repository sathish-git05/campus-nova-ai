import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List events
router.get('/', (req, res) => {
  const events = db.get('events');
  res.json(events);
});

// Register or Unregister for event
router.post('/:id/register', (req, res) => {
  const event = db.findOne('events', e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const isCurrentlyRegistered = event.isRegistered || false;
  const newRegisteredState = !isCurrentlyRegistered;
  const newCount = newRegisteredState ? (event.registrationsCount || 0) + 1 : Math.max(0, (event.registrationsCount || 1) - 1);

  const updated = db.update('events', e => e.id === req.params.id, {
    isRegistered: newRegisteredState,
    registrationsCount: newCount
  });

  res.json({
    success: true,
    isRegistered: updated.isRegistered,
    registrationsCount: updated.registrationsCount,
    message: newRegisteredState ? 'Successfully registered for event!' : 'Registration cancelled.'
  });
});

// Create new campus event (Admin/Faculty action)
router.post('/', (req, res) => {
  const { title, category, date, time, venue, description, bannerUrl, registrationDeadline, organizer } = req.body;
  if (!title || !date || !venue) {
    return res.status(400).json({ error: 'Title, date, and venue are required' });
  }

  const newEvent = db.insert('events', {
    title,
    category: category || 'Campus Event',
    date,
    time: time || '10:00 AM onwards',
    venue,
    description: description || '',
    bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    registrationDeadline: registrationDeadline || date,
    registrationsCount: 0,
    isRegistered: false,
    organizer: organizer || 'Campus Organizing Committee'
  });

  res.status(201).json(newEvent);
});

export default router;
