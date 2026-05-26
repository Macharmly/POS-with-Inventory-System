import express from 'express';

import {
  getProductPerformanceReport
} from '../controllers/reportController';

const router = express.Router();

router.get(
  '/reports/product-performance',
  getProductPerformanceReport
);

export default router;