// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://6604101342.netlify.app',
  'http://localhost:9500',
  'http://localhost:8080',
];

app.use(cors({
  origin: (origin, callback) => {
    // อนุญาต request ที่ไม่มี origin (เช่น curl, Postman) และ origin ที่อยู่ใน whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));
app.use(express.json());

// === logs dir (ต่อยอดจาก Lab 1.2) ===
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// demo endpoint เดิมจาก Lab 1.2
app.get('/api/demo', (req, res) => {
  const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`;
  fs.appendFileSync(path.join(logsDir, 'access.log'), logMessage);

  res.json({
    git: {
      title: 'Advanced Git Workflow',
      detail:
        'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history สะอาด',
    },
    docker: {
      title: 'Advanced Docker',
      detail:
        'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm',
    },
  });
});

// health check root
app.get('/', (_req, res) => {
  res.json({
    message: 'API พร้อมใช้งาน (Supabase + Prisma + Quasar Frontend)',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Task API (Lab 2.1)
app.use('/api/tasks', taskRoutes);

// ✅ fallback 404 สำหรับทุก route ที่ไม่ match
app.use((req, res) => {
  res.status(404).json({
    message: 'ไม่พบเส้นทาง',
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
