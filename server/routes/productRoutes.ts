import express from 'express';

import authenticateToken
from '../middleware/authenticateToken';

import {
  getProducts,
  createProduct
} from '../controllers/productController';

const router = express.Router();

router.get(
  '/',
  getProducts
);

router.post(
  '/',
  authenticateToken,
  createProduct
);

export default router;