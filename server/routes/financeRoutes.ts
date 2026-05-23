import express from 'express';

import {
  getExpenses,
  createExpense
} from '../controllers/financeController';

const router = express.Router();

router.get(
  '/expenses/:business_id',
  getExpenses
);

router.post(
  '/expenses',
  createExpense
);

export default router;