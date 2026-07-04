"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authenticateToken_1 = __importDefault(require("../middleware/authenticateToken"));
const router = express_1.default.Router();
router.get('/', authenticateToken_1.default, userController_1.getUsers);
router.post('/', authenticateToken_1.default, userController_1.createUser);
router.get('/password-reset-requests', authenticateToken_1.default, userController_1.getPasswordResetRequests);
router.put('/password-reset/:id/reject', authenticateToken_1.default, userController_1.rejectPasswordResetRequest);
router.put('/password-reset/:id', authenticateToken_1.default, userController_1.resetUserPassword);
router.put('/profile/:id', authenticateToken_1.default, userController_1.updateProfile);
router.put('/:id', authenticateToken_1.default, userController_1.updateUser);
router.delete('/:id', authenticateToken_1.default, userController_1.deleteUser);
exports.default = router;
