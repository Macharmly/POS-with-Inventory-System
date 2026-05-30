import {
  Router
} from 'express';

import {
  getPatchNotes,
  getLatestPatchNote,
  createPatchNote,
  updatePatchNote,
  deletePatchNote
} from '../controllers/patchNoteController';

const router = Router();

/* =========================
   PATCH NOTES
========================= */

router.get(
  '/',
  getPatchNotes
);

router.get(
  '/latest',
  getLatestPatchNote
);

router.post(
  '/',
  createPatchNote
);

router.put(
  '/:id',
  updatePatchNote
);

router.delete(
  '/:id',
  deletePatchNote
);

export default router;