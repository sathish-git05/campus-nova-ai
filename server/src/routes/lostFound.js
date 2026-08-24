import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List lost and found items
router.get('/', (req, res) => {
  const { type, status } = req.query;
  let items = db.get('lostFound');

  if (type && type !== 'all') {
    items = items.filter(i => i.type.toLowerCase() === type.toLowerCase());
  }
  if (status && status !== 'all') {
    items = items.filter(i => i.status.toLowerCase() === status.toLowerCase());
  }

  res.json(items.slice().reverse());
});

// Report a lost or found item
router.post('/', (req, res) => {
  const { type, title, description, location, contactPerson, contactPhone, imageUrl } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: 'Title and type (lost/found) are required' });
  }

  const newItem = db.insert('lostFound', {
    type,
    title,
    description: description || '',
    location: location || 'Campus Area',
    contactPerson: contactPerson || 'Anonymous',
    contactPhone: contactPhone || 'Campus Helpdesk',
    status: 'Available',
    imageUrl: imageUrl || (type === 'lost' 
      ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80'),
    date: new Date().toISOString().split('T')[0]
  });

  res.status(201).json(newItem);
});

// Claim or update item status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const item = db.findOne('lostFound', i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const updated = db.update('lostFound', i => i.id === req.params.id, {
    status: status || 'Claimed'
  });
  res.json(updated);
});

export default router;
