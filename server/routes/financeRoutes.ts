import express from 'express';

import {
  getExpenses,
  createExpense,
  revertExpense
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

router.delete(
  '/:id',
  revertExpense
);

export default router;