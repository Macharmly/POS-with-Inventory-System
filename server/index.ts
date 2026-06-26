import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import salesRoutes from './routes/salesRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import financeRoutes from './routes/financeRoutes';
import reportRoutes from './routes/reportRoutes';
import logRoutes from './routes/logRoutes';
import patchNoteRoutes from './routes/patchNoteRoutes';

// Load environment variables
dotenv.config();

const app = express();

/* =========================
   Middleware
========================= */

app.use(cors());

app.use(express.json());

/* =========================
   API Routes
========================= */

// Authentication Routes

app.use(
  '/api/auth',
  authRoutes
);

// Sales Routes

app.use(
  '/api',
  salesRoutes
);

// Product Routes

app.use(
  '/api/products',
  productRoutes
);

// User Management Routes

app.use(
  '/api/users',
  userRoutes
);

// Activity Logs Routes

app.use(
  '/api/logs',
  logRoutes
);

// Finance Routes

app.use(
  '/api/finance',
  financeRoutes
);

// Report Routes

app.use(
  '/api',
  reportRoutes
);

// Patch Notes Routes

app.use(
  '/api/patch-notes',
  patchNoteRoutes
);

/* =========================
   Health Check API
========================= */

app.get('/api/health', (req, res) => {

  res.json({

    status: 'OK',

    message:
      'Backend API is running'

  });

});

/* =========================
   404 Handler
========================= */

app.use((req, res) => {

  res.status(404).json({

    error:
      `Route not found: ${req.originalUrl}`

  });

});

/* =========================
   Server Start
========================= */

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Secure backend API running on http://localhost:${PORT}`
  );

});