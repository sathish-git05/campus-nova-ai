import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

import { iotService } from './src/iotService.js';
import authRoutes from './src/routes/auth.js';
import academicsRoutes from './src/routes/academics.js';
import materialsRoutes from './src/routes/materials.js';
import facultyRoutes from './src/routes/faculty.js';
import grievancesRoutes from './src/routes/grievances.js';
import lostFoundRoutes from './src/routes/lostFound.js';
import busesRoutes from './src/routes/buses.js';
import eventsRoutes from './src/routes/events.js';
import alumniRoutes from './src/routes/alumni.js';
import iotRoutes from './src/routes/iot.js';
import aiRoutes from './src/routes/ai.js';
import adminRoutes from './src/routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/academics', academicsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/grievances', grievancesRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CampusNova AI - Smart Campus Management Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Create HTTP Server & attach WebSockets
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  iotService.registerClient(ws);
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CampusNova AI Backend Server is live on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
