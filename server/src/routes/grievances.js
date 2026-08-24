import express from 'express';
import { db } from '../db.js';
import { aiService } from '../aiService.js';

const router = express.Router();

// List complaints
router.get('/', (req, res) => {
  const { studentId, status, category, priority } = req.query;
  let complaints = db.get('complaints');

  if (studentId) {
    complaints = complaints.filter(c => c.submittedBy === studentId);
  }
  if (status && status !== 'All') {
    complaints = complaints.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }
  if (category && category !== 'All') {
    complaints = complaints.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }
  if (priority && priority !== 'All') {
    complaints = complaints.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
  }

  // Return newest first
  res.json(complaints.slice().reverse());
});

// Submit new complaint with Automatic AI Classification & Priority Triage
router.post('/', async (req, res) => {
  const { title, description, location, submittedBy, submitterName, category } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  // Automatic AI NLP classification
  const aiResult = await aiService.classifyComplaint({ title, description, location });

  const newComplaint = db.insert('complaints', {
    id: `cmp_${Date.now().toString().slice(-4)}`,
    title,
    description,
    location: location || 'Campus Premises',
    category: category || aiResult.category,
    aiCategory: aiResult.category,
    priority: aiResult.priority,
    aiPriority: aiResult.priority,
    aiConfidence: aiResult.confidence,
    status: 'Open',
    submittedBy: submittedBy || 'usr_student_1',
    submitterName: submitterName || 'Rohan Sharma',
    assignedTo: aiResult.assignedTo,
    adminRemarks: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  res.status(201).json(newComplaint);
});

// Admin / Faculty update status & remarks
router.patch('/:id', (req, res) => {
  const { status, adminRemarks, assignedTo, priority } = req.body;
  const cmp = db.findOne('complaints', c => c.id === req.params.id);
  if (!cmp) return res.status(404).json({ error: 'Complaint not found' });

  const updated = db.update('complaints', c => c.id === req.params.id, {
    ...(status && { status }),
    ...(adminRemarks !== undefined && { adminRemarks }),
    ...(assignedTo && { assignedTo }),
    ...(priority && { priority }),
    updatedAt: new Date().toISOString()
  });

  res.json(updated);
});

export default router;
