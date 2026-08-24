import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List all alumni placement stories & interview questions
router.get('/', (req, res) => {
  const { company, search } = req.query;
  let posts = db.get('alumniPosts');

  if (company && company !== 'All') {
    posts = posts.filter(p => p.company.toLowerCase() === company.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  res.json(posts.slice().reverse());
});

// Post placement story / interview questions (Alumni action)
router.post('/', (req, res) => {
  const { authorId, authorName, authorRole, company, batch, title, content, tags } = req.body;
  if (!title || !content || !company) {
    return res.status(400).json({ error: 'Title, content, and company name are required' });
  }

  const newPost = db.insert('alumniPosts', {
    authorId: authorId || 'usr_alumni_1',
    authorName: authorName || 'Ananya Verma',
    authorRole: authorRole || 'Software Engineer',
    company,
    batch: batch || 'Class of 2024',
    title,
    content,
    upvotes: 0,
    postedAt: new Date().toISOString().split('T')[0],
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [company, 'Placement Prep'])
  });

  res.status(201).json(newPost);
});

// Upvote post
router.post('/:id/upvote', (req, res) => {
  const post = db.findOne('alumniPosts', p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const updated = db.update('alumniPosts', p => p.id === req.params.id, {
    upvotes: (post.upvotes || 0) + 1
  });

  res.json(updated);
});

export default router;
