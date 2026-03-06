"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
    'https://6604101342.netlify.app',
    'http://localhost:9500',
    'http://localhost:8080',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // อนุญาต request ที่ไม่มี origin (เช่น curl, Postman) และ origin ที่อยู่ใน whitelist
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// === logs dir (ต่อยอดจาก Lab 1.2) ===
const logsDir = path_1.default.join(__dirname, '../logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// demo endpoint เดิมจาก Lab 1.2
app.get('/api/demo', (req, res) => {
    const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`;
    fs_1.default.appendFileSync(path_1.default.join(logsDir, 'access.log'), logMessage);
    res.json({
        git: {
            title: 'Advanced Git Workflow',
            detail: 'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history สะอาด',
        },
        docker: {
            title: 'Advanced Docker',
            detail: 'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm',
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
app.use('/api/tasks', task_routes_1.default);
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
