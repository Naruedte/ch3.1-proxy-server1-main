const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Ultra-permissive CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    status: 'Live', 
    message: 'Backend API is running correctly (Standardized Version)',
    version: '1.3.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/debug-cors', (req, res) => {
  res.json({ 
    message: 'CORS manual headers are active', 
    headers: res.getHeaders(),
    time: new Date().toISOString()
  });
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

// Fallback JSON 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
