import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List all study materials & PYQs
router.get('/', (req, res) => {
  const { type, subjectCode, search } = req.query;
  let list = db.get('materials');

  if (type && type !== 'All') {
    list = list.filter(m => m.type.toLowerCase() === type.toLowerCase());
  }
  if (subjectCode) {
    list = list.filter(m => m.subjectCode.toLowerCase() === subjectCode.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.subjectName.toLowerCase().includes(q) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  res.json(list);
});

// Upload new study material / PYQ
router.post('/', (req, res) => {
  const { title, subjectCode, subjectName, type, uploadedBy, tags, fileSize, fileName, fileUrl, description } = req.body;
  if (!title || !subjectCode) {
    return res.status(400).json({ error: 'Title and subject code are required' });
  }

  const generatedFileName = fileName || `${title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.pdf`;

  const newMaterial = db.insert('materials', {
    title,
    subjectCode,
    subjectName: subjectName || 'Computer Science & Engineering',
    type: type || 'Lecture Notes',
    fileUrl: fileUrl || '#',
    fileName: generatedFileName,
    fileSize: fileSize || '2.8 MB',
    description: description || 'Official uploaded study resource for students.',
    uploadedBy: uploadedBy || 'Faculty / Student Member',
    uploadedAt: new Date().toISOString().split('T')[0],
    downloads: 0,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Study Resource'])
  });

  res.status(201).json(newMaterial);
});

// Increment download counter
router.post('/:id/download', (req, res) => {
  const item = db.findOne('materials', m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Resource not found' });

  const updated = db.update('materials', m => m.id === req.params.id, {
    downloads: (item.downloads || 0) + 1
  });
  res.json({ success: true, downloads: updated.downloads });
});

export default router;
