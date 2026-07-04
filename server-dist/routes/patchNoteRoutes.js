"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patchNoteController_1 = require("../controllers/patchNoteController");
const router = (0, express_1.Router)();
/* =========================
   PATCH NOTES
========================= */
router.get('/', patchNoteController_1.getPatchNotes);
router.get('/latest', patchNoteController_1.getLatestPatchNote);
router.post('/', patchNoteController_1.createPatchNote);
router.put('/:id', patchNoteController_1.updatePatchNote);
router.delete('/:id', patchNoteController_1.deletePatchNote);
exports.default = router;
