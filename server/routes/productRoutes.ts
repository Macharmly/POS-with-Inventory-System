import express from 'express';

import authenticateToken
from '../middleware/authenticateToken';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getDropdownOptions,
  createDropdownOption,
  getInventoryMovements
} from '../controllers/productController';

const router = express.Router();

router.get('/dropdowns/:type', getDropdownOptions);
router.post('/dropdowns/:type', authenticateToken, createDropdownOption);

router.get('/inventory-movements', getInventoryMovements);

router.get('/', getProducts);
router.post('/', authenticateToken, createProduct);

router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;