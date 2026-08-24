import express from 'express';
import { aiService } from '../aiService.js';
import { db } from '../db.js';

const router = express.Router();

// 24/7 Campus AI Chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, userContext, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const iotSensors = db.getIoTSensors();
    const result = await aiService.chat({ message, userContext, history, iotSensors });
    res.json(result);
  } catch (err) {
    console.error('[AI Chat Route Error]:', err);
    res.status(500).json({ error: 'AI processing failed', details: err.message });
  }
});

// Automatic Complaint Classifier
router.post('/classify-complaint', async (req, res) => {
  try {
    const { title, description, location } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const result = await aiService.classifyComplaint({ title, description, location });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Classification failed', details: err.message });
  }
});

// AI Question Generator from Syllabus / Topic
router.post('/generate-questions', async (req, res) => {
  try {
    const { subject, topic, unit, count } = req.body;
    const result = await aiService.generateQuestions({ subject, topic, unit, count });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Question generation failed', details: err.message });
  }
});

// Circular / Notice Summarizer
router.post('/summarize-circular', async (req, res) => {
  try {
    const { title, text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Circular text is required' });
    }

    const result = await aiService.summarizeCircular({ title, text });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Summarization failed', details: err.message });
  }
});

export default router;
