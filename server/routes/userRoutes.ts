import express from 'express';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile
} from '../controllers/userController';

const router = express.Router();

router.get(
  '/',
  getUsers
);

router.post(
  '/',
  createUser
);

router.put(
  '/profile/:id',
  updateProfile
);

router.put(
  '/:id',
  updateUser
);

router.delete(
  '/:id',
  deleteUser
);

export default router;