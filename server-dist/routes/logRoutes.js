"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logController_1 = require("../controllers/logController");
const authenticateToken_1 = __importDefault(require("../middleware/authenticateToken"));
const authorizeRoles_1 = __importDefault(require("../middleware/authorizeRoles"));
const router = express_1.default.Router();
router.get('/', authenticateToken_1.default, (0, authorizeRoles_1.default)('admin'), logController_1.getLogs);
exports.default = router;
