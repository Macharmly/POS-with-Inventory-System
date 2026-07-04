import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes';
import salesRoutes from './routes/salesRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import financeRoutes from './routes/financeRoutes';
import reportRoutes from './routes/reportRoutes';
import logRoutes from './routes/logRoutes';
import patchNoteRoutes from './routes/patchNoteRoutes';
import businessRoutes from './routes/businessRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', salesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api', reportRoutes);
app.use('/api/patch-notes', patchNoteRoutes);
app.use('/api', businessRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend API is running'
  });
});

/* =========================
   Serve React / Vite Frontend
========================= */

const clientPath = path.join(__dirname, '..', 'dist');

app.use(express.static(clientPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

/* =========================
   Server Start
========================= */

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 App running on port ${PORT}`);
});