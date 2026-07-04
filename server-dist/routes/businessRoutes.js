"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const businessController_1 = require("../controllers/businessController");
const router = express_1.default.Router();
router.get('/business/:id', businessController_1.getBusinessById);
router.put('/business/:id', businessController_1.updateBusiness);
exports.default = router;
