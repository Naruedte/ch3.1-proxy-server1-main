const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all for now to perfectly fix CORS
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));
app.use(express.json());

// Logs Dir
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    status: 'Live', 
    message: 'Backend API is running correctly with Task routes',
    version: '1.2.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Task API
const taskRouter = express.Router();

taskRouter.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

taskRouter.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await prisma.task.create({ data: { title, description } });
    res.status(201).json({ data: task });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

taskRouter.patch('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { title, description }
    });
    res.json({ data: task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

taskRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

app.use('/api/tasks', taskRouter);

// Fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
