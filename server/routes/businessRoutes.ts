import express from 'express';

import {
  getBusinessById,
  updateBusiness
} from '../controllers/businessController';

const router = express.Router();

router.get(
  '/business/:id',
  getBusinessById
);

router.put(
  '/business/:id',
  updateBusiness
);

export default router;