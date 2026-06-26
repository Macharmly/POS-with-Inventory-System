import express from 'express';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getPasswordResetRequests,
  resetUserPassword,
  rejectPasswordResetRequest
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

router.get(
  '/password-reset-requests',
  authenticateToken,
  getPasswordResetRequests
);

router.put(
  '/password-reset/:id/reject',
  authenticateToken,
  rejectPasswordResetRequest
);

router.put(
  '/password-reset/:id',
  authenticateToken,
  resetUserPassword
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