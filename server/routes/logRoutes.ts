import express from 'express';

import {
  getLogs
} from '../controllers/logController';

import authenticateToken from '../middleware/authenticateToken';

import authorizeRoles from '../middleware/authorizeRoles';

const router =
  express.Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  getLogs
);

export default router;