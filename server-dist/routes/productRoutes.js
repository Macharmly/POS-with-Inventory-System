"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = __importDefault(require("../middleware/authenticateToken"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.get('/dropdowns/:type', productController_1.getDropdownOptions);
router.post('/dropdowns/:type', authenticateToken_1.default, productController_1.createDropdownOption);
router.get('/', productController_1.getProducts);
router.post('/', authenticateToken_1.default, productController_1.createProduct);
router.put('/:id', authenticateToken_1.default, productController_1.updateProduct);
router.delete('/:id', authenticateToken_1.default, productController_1.deleteProduct);
exports.default = router;
