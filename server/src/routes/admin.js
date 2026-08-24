import express from 'express';
import { db } from '../db.js';
import { aiService } from '../aiService.js';

const router = express.Router();

// Campus Overview Analytics & High-Level Metrics
router.get('/overview', (req, res) => {
  const users = db.get('users');
  const complaints = db.get('complaints');
  const events = db.get('events');
  const materials = db.get('materials');
  const iotSensors = db.getIoTSensors();

  const studentCount = users.filter(u => u.role === 'student').length;
  const facultyCount = users.filter(u => u.role === 'faculty').length;
  const alumniCount = users.filter(u => u.role === 'alumni').length;

  const openComplaints = complaints.filter(c => c.status !== 'Resolved').length;
  const criticalComplaints = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length;

  res.json({
    metrics: {
      totalUsers: users.length,
      studentCount,
      facultyCount,
      alumniCount,
      openComplaints,
      criticalComplaints,
      totalEvents: events.length,
      totalMaterials: materials.length,
      serverTemp: iotSensors.temperature?.value || 24.8,
      smokePPM: iotSensors.smoke?.value || 48,
      waterTankPercent: iotSensors.waterLevel?.value || 78,
      powerKW: iotSensors.electricity?.value || 18.4
    },
    recentComplaints: complaints.slice(-5).reverse(),
    activeEvents: events
  });
});

// List Circulars & Notices
router.get('/circulars', (req, res) => {
  const circulars = db.get('circulars');
  res.json(circulars.slice().reverse());
});

// Broadcast new Circular (with automatic AI summarizer)
router.post('/circulars', async (req, res) => {
  const { title, originalText, targetRole, category, publishedBy } = req.body;
  if (!title || !originalText) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Generate AI Summary automatically
  const summaryResult = await aiService.summarizeCircular({ title, text: originalText });

  const newCircular = db.insert('circulars', {
    title,
    originalText,
    aiSummary: summaryResult.summary,
    targetRole: targetRole || 'all',
    category: category || 'General',
    publishedBy: publishedBy || 'Office of the Principal',
    date: new Date().toISOString().split('T')[0]
  });

  res.status(201).json(newCircular);
});

export default router;
