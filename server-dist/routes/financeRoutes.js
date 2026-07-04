"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const financeController_1 = require("../controllers/financeController");
const router = express_1.default.Router();
router.get('/expenses/:business_id', financeController_1.getExpenses);
router.post('/expenses', financeController_1.createExpense);
router.delete('/:id', financeController_1.revertExpense);
exports.default = router;
