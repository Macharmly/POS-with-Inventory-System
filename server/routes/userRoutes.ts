import express from 'express';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile
} from '../controllers/userController';

import authenticateToken
from '../middleware/authenticateToken';

const router = express.Router();

router.get(
  '/',
  authenticateToken,
  getUsers
);

router.post(
  '/',
  authenticateToken,
  createUser
);

router.put(
  '/profile/:id',
  authenticateToken,
  updateProfile
);

router.put(
  '/:id',
  authenticateToken,
  updateUser
);

router.delete(
  '/:id',
  authenticateToken,
  deleteUser
);

export default router;