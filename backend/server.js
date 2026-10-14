import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { autoSeedIfEmpty } from './utils/autoSeed.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import researchRoutes from './routes/researchRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import blueprintRoutes from './routes/blueprintRoutes.js';
import productionRoutes from './routes/productionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import audienceRoutes from './routes/audienceRoutes.js';
import contentFamilyRoutes from './routes/contentFamilyRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/discover', feedRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/blueprints', blueprintRoutes);
app.use('/api/content', productionRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/audience', audienceRoutes);
app.use('/api/family', contentFamilyRoutes);
app.use('/api/content-family', contentFamilyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Real-Time Connection
io.on('connection', (socket) => {
  console.log('Socket client connected: ' + socket.id);

  socket.on('join_content', (contentId) => {
    socket.join(contentId);
    console.log('Socket ' + socket.id + ' joined room ' + contentId);
  });

  socket.on('leave_content', (contentId) => {
    socket.leave(contentId);
    console.log('Socket ' + socket.id + ' left room ' + contentId);
  });

  socket.on('disconnect', () => {
    console.log('Socket client disconnected: ' + socket.id);
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await autoSeedIfEmpty();
  server.listen(PORT, () => {
    console.log('CreatorHub Server running on port ' + PORT);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
});