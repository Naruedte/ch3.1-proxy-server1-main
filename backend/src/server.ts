import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Ultra-permissive CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    status: 'Live', 
    message: 'Backend API is running correctly (Standardized TS Version)',
    version: '1.3.0'
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
  } catch (err: any) {
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

// Fallback JSON 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
