import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import salesRoutes from './routes/salesRoutes';
import userRoutes from './routes/userRoutes';

import financeRoutes from './routes/financeRoutes';

import reportRoutes from './routes/reportRoutes';

import connection from './dbConnection';

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
// IMPORTANT:
// Keep this as '/api'
// because the frontend already uses:
// /api/history
// /api/reports
// /api/recent-services
// etc.

app.use(
  '/api',
  salesRoutes
);

// User Management Routes

app.use(
  '/api/users',
  userRoutes
);

app.use(
  '/api/finance',
  financeRoutes
);

app.use(
  '/api',
  reportRoutes
);

/* =========================
   Products API
========================= */

// Get Products By Business

app.get('/api/products', (req, res) => {

  const { business_id } = req.query;

  // Validation

  if (!business_id) {

    return res.status(400).json({

      error:
        'business_id is required.'

    });

  }

  const sql = `

    SELECT

      id,
      business_id,
      name,
      sku_barcode,
      category,
      selling_price,
      stock_quantity

    FROM products

    WHERE business_id = ?

  `;

  connection.query(

    sql,

    [business_id],

    (err, results) => {

      // Auto fallback query

      if (err) {

        console.warn(
          '⚠️ Standard columns not found, attempting auto-fallback query...'
        );

        const fallbackSql = `

          SELECT

            id,

            IFNULL(
              business_id,
              1
            ) as business_id,

            name,

            COALESCE(
              selling_price,
              price,
              0
            ) as selling_price,

            COALESCE(
              stock_quantity,
              stock,
              0
            ) as stock_quantity

          FROM products

          WHERE business_id = ?

        `;

        return connection.query(

          fallbackSql,

          [business_id],

          (
            fallbackErr,
            fallbackResults
          ) => {

            if (fallbackErr) {

              console.error(
                '❌ Absolute SQL Failure:',
                fallbackErr.message
              );

              return res.status(500).json({

                error:
                  fallbackErr.message

              });

            }

            return res.json(
              fallbackResults
            );

          }

        );

      }

      return res.json(results);

    }

  );

});

/* =========================
   Create Product API
========================= */

// Create Product

app.post('/api/products', (req, res) => {

  const {

    business_id,
    name,
    sku_barcode,
    category,
    cost_price,
    selling_price,
    stock_quantity

  } = req.body;

  // Validation

  if (
    !business_id ||
    !name ||
    !sku_barcode ||
    !cost_price ||
    !selling_price
  ) {

    return res.status(400).json({

      error:
        'Please provide all required fields.'

    });

  }

  const sql = `

    INSERT INTO products (

      business_id,
      name,
      sku_barcode,
      category,
      cost_price,
      selling_price,
      stock_quantity

    )

    VALUES (?, ?, ?, ?, ?, ?, ?)

  `;

  const values = [

    business_id,

    name,

    sku_barcode,

    category || 'General',

    cost_price,

    selling_price,

    stock_quantity || 0

  ];

  connection.query(

    sql,

    values,

    (err, result) => {

      if (err) {

        console.error(
          '❌ SQL Insert Error:',
          err.message
        );

        return res.status(500).json({

          error:
            err.message

        });

      }

      res.status(201).json({

        message:
          'Product added successfully!',

        id:
          (result as any).insertId

      });

    }

  );

});

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

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Secure backend API running on http://localhost:${PORT}`
  );

});